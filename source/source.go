package source

import (
	"embed"
	"encoding/xml"
	"fmt"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
)

//go:embed Types
var typeFS embed.FS

type SourceInfo struct {
	SourceElements []SourceElement `xml:"element"`
}

type SourceElement struct {
	Name        string      `xml:"name,attr"`
	Type        string      `xml:"type,attr"`
	ID          string      `xml:"id,attr"`
	Description Description `xml:"description"` // use this if no sheet description is present
	Sheet       Sheet       `xml:"sheet"`       // description for displaying on sheet
	Rules       Rules       `xml:"rules"`       // grants and rules for displaying stats on sheet
	Setters     []Setters   `xml:"setters>set"` // setters for displaying stats on sheet
}

type Description struct {
	InnerXML string `xml:",innerxml"`
	Usage    string `xml:"usage,attr"`
	Level    int    `xml:"level,attr"`
}

type Ability struct {
	Score int
	Mod   int
}

type Sheet struct {
	Action      string        `xml:"action,attr"`
	Usage       string        `xml:"usage,attr"`
	Display     bool          `xml:"display,attr"`
	Description []Description `xml:"description"`
}

func (s *Sheet) UnmarshalXML(d *xml.Decoder, start xml.StartElement) error { // defaults sheet display to true
	s.Display = true
	type Alias Sheet
	return d.DecodeElement((*Alias)(s), &start)
}

type Detail struct {
	Name        string
	Description string
	Usage       string
}

type ItemDetail struct {
	Name        string
	Description string
	Rarity      string
	Category    string
	Amount      int
	Equipped    bool
	// Weapon Variables
	Damage  *string
	DMGType *string
	Range   *string
	// Armor Variables
	Stealth   *bool // if value disadvantage set true
	AC        *string
	ArmorType *string
}

type Rules struct {
	Stat  []Stat  `xml:"stat"`
	Grant []Grant `xml:"grant"`
	// <Select> should be in the Characther sheet, so no need from here
}

type Stat struct {
	ParentID    string
	Name        string `xml:"name,attr"`
	Value       string `xml:"value,attr"`
	Level       int    `xml:"level,attr"`
	Bonus       string `xml:"bonus,attr"`
	Requirement string `xml:"requirements,attr"`
}

type Grant struct {
	Type        string `xml:"type,attr"`
	ID          string `xml:"id,attr"`
	Level       int    `xml:"level,attr"`
	Requirement string `xml:"requirements,attr"`
}

type Setters struct {
	Name     string  `xml:"name,attr"`
	Value    string  `xml:",chardata"`
	Currency *string `xml:"currency,attr"`
	Addition *string `xml:"addition,attr"`
	Type     *string `xml:"type,attr"`
}

type FeatDetail struct {
	Type        string
	Name        string
	ID          string
	Level       int
	Description Description
	Sheet       Sheet
}

type Feat struct {
	Features []FeatDetail
	Profs    []FeatDetail
	Grants   []FeatDetail
	Language []FeatDetail
}

type Spell struct {
	ID          string `xml:"id,attr"`
	Level       int    `xml:"level,attr"`
	Prepared    bool   `xml:"prepared,attr"`
	Known       bool   `xml:"known,attr"`
	Hit         int
	Effect      Dice
	SaveDC      string
	Name        string
	Description string
	Time        string
	Range       string
	Duration    string
	Ritual      bool
}

type Dice struct {
	Rolls map[int]int
	Text  string
}

func getElement(typeName string, id string) (SourceElement, error) {
	filePath := fmt.Sprintf("Types/%s.xml", typeName)

	xmlData, err := typeFS.ReadFile(filePath)
	if err != nil {
		return SourceElement{}, fmt.Errorf("error reading embedded file %w", err)
	}

	var items SourceInfo
	err = xml.Unmarshal(xmlData, &items) // unmarshal XML data into struct
	if err != nil {
		return SourceElement{}, fmt.Errorf("error Unmarshalling xml %w", err)

	}

	// Binary Search ID
	index := sort.Search(len(items.SourceElements), func(i int) bool {
		return items.SourceElements[i].ID >= id
	})

	// Check if the element was found
	if index < len(items.SourceElements) && items.SourceElements[index].ID == id {
		return items.SourceElements[index], nil
	}

	return SourceElement{}, fmt.Errorf("cannot find element with ID %s", id)
}

// Stats name is name, value is either an integer, string corresponding to another stat, or a string
// TODO: Make stats more general, so don't need to write a new stat for everything.
//* Example: Amulet of Health <stat name="constitution:score:set" value="19" bonus="base" />
//* Find Constitution set score to 19
// TODO: Make requirements more general
//* <stat name="speed" value="-10" bonus="armor" requirements="![str:13]" />
//* If strength is less than 13, subtract 10 from speed
//* <stat name="persuasion:proficiency" value="proficiency" bonus="double" requirements="ID_PROFICIENCY_SKILL_PERSUASION" />
//* Need to have proficiency in persuasion to double proficiency bonus

func GetStat(typeName string, id string, level int, ch chan<- Stat, errCh chan<- error, wg *sync.WaitGroup) {
	defer wg.Done()
	element, err := getElement(typeName, id)
	if err != nil {
		errCh <- fmt.Errorf("error getting element %w", err)
		return
	}

	// Append stats to the stats map
	for _, stat := range element.Rules.Stat {
		if stat.Level <= level {
			stat.ParentID = id
			ch <- stat
		}
	}
}

func cleanInnerXML(input string) string {
	re := regexp.MustCompile(`<[^>]*>`) // Cleans xml tags
	input = re.ReplaceAllString(input, " ")

	// Replace newlines and tabs with spaces
	input = strings.ReplaceAll(input, "\n", " ")
	input = strings.ReplaceAll(input, "\t", " ")

	// Remove multiple spaces and replace with single space
	re = regexp.MustCompile(`\s+`)
	input = re.ReplaceAllString(input, " ")

	// Trim spaces
	return strings.TrimSpace(input)
}

func replaceStatValue(input string, stats map[string]string) string {
	input = cleanInnerXML(input) // turns the innerxml into a normalized string
	reg := regexp.MustCompile(`\{\{(.*?)\}\}`)
	result := reg.ReplaceAllStringFunc(input, func(match string) string {
		key := strings.Trim(match, "{}")
		if val, exists := stats[key]; exists {
			return val
		}
		return match // Keep the original if key not found
	})
	return result
}

func GetDetails(typeName string, id string, level int, stats map[string]string) (Detail, error) {
	element, err := getElement(typeName, id)
	if err != nil {
		return Detail{}, fmt.Errorf("error getting element %w", err)
	}
	details := Detail{}
	if !element.Sheet.Display { // if sheet display is false, don't display anything
		details.Name = element.Name
		details.Description = ""
	} else if element.Sheet.Description == nil { // no sheet, display description
		details.Name = element.Name
		details.Description = cleanInnerXML(element.Description.InnerXML)

	} else { // sheet display sheet
		action := ""
		usage := ""
		desc := Description{}
		if element.Sheet.Action != "" || element.Sheet.Usage != "" {
			action = element.Sheet.Action
			usage = element.Sheet.Usage
		}
		for _, description := range element.Sheet.Description {
			// Check description level, and if level met, take highest one
			if description.Level <= level {
				if description.Usage != "" {
					usage = description.Usage
				}
				desc = description
			}
		}
		details.Description = replaceStatValue(desc.InnerXML, stats)
		usage = replaceStatValue(usage, stats)
		if action != "" && usage != "" {
			details.Name = fmt.Sprintf("%s (%s - %s)", element.Name, action, usage)
			details.Usage = usage
		} else if action != "" && usage == "" {
			details.Name = fmt.Sprintf("%s (%s)", element.Name, action)
		} else if action == "" && usage != "" {
			details.Name = fmt.Sprintf("%s (%s)", element.Name, usage)
			details.Usage = usage

		} else {
			details.Name = element.Name
		}

	}
	return details, nil
}

func GetRaceStats(raceID string, stats *[]Stat) error {
	element, err := getElement("Race", raceID)

	if err != nil {
		return fmt.Errorf("error getting race element %w", err)
	}

	for _, stat := range element.Rules.Stat { // only add ability score stats
		stat.ParentID = raceID
		(*stats) = append((*stats), stat)
	}

	return nil
}

func GetItemDetails(typeName string, id string, amount int, equipped bool, stats *[]Stat) (ItemDetail, error) {
	itemDetail := ItemDetail{}
	element, err := getElement(typeName, id)
	if err != nil {
		return itemDetail, fmt.Errorf("error getting Item %w", err)
	}
	for _, set := range element.Setters {
		switch set.Name {
		case "rarity":
			itemDetail.Rarity = set.Value
		case "category":
			itemDetail.Category = set.Value
		}
	}
	itemDetail.Equipped = equipped
	if itemDetail.Equipped { // if item is equipped, check rules
		for _, stat := range element.Rules.Stat {
			stat.ParentID = id
			(*stats) = append((*stats), stat)
		}
	}

	itemDetail.Amount = amount
	itemDetail.Name = element.Name
	itemDetail.Description = cleanInnerXML(element.Description.InnerXML)
	return itemDetail, nil
}

func GetWeaponDetails(id string, equipped bool) (ItemDetail, error) {
	itemDetail := ItemDetail{}
	element, err := getElement("Weapon", id)
	if err != nil {
		return itemDetail, fmt.Errorf("error getting Weapon %w", err)
	}
	for _, set := range element.Setters {
		switch set.Name {
		case "rarity":
			itemDetail.Rarity = set.Value
		case "category":
			itemDetail.Category = set.Value
		case "range":
			itemDetail.Range = &set.Value
		case "damage":
			itemDetail.Damage = &set.Value
			itemDetail.DMGType = set.Type
		}
	}
	itemDetail.Equipped = equipped
	itemDetail.Name = element.Name
	itemDetail.Amount = 1
	return itemDetail, nil
}

func GetArmorDetails(id string, equipped bool, stats *[]Stat) (ItemDetail, error) {
	itemDetail := ItemDetail{}
	element, err := getElement("Armor", id)
	if err != nil {
		return itemDetail, fmt.Errorf("error getting Armor %w", err)
	}
	for _, set := range element.Setters {
		switch set.Name {
		case "rarity":
			itemDetail.Rarity = set.Value
		case "category":
			itemDetail.Category = set.Value
		case "stealth":
			if set.Value == "Disadvantage" {
				stealth := true
				itemDetail.Stealth = &stealth
			} else {
				stealth := true
				itemDetail.Stealth = &stealth
			}
		case "armor":
			itemDetail.ArmorType = &set.Value
		case "armorClass":
			itemDetail.AC = &set.Value
		}

	}
	itemDetail.Equipped = equipped
	if itemDetail.Equipped { // if item is equipped, check rules
		for _, stat := range element.Rules.Stat {
			stat.ParentID = id
			(*stats) = append((*stats), stat)

		}

	}

	itemDetail.Name = element.Name
	itemDetail.Description = cleanInnerXML(element.Description.InnerXML)
	itemDetail.Amount = 1
	return itemDetail, nil
}

func GetMagicItemDetails(id string, amount int, equipped bool, stats *[]Stat) (ItemDetail, error) {
	itemDetail := ItemDetail{}
	element, err := getElement("Magic Item", id)
	if err != nil {
		return itemDetail, fmt.Errorf("error getting Magic Item %w", err)
	}
	for _, set := range element.Setters {
		switch set.Name {
		case "rarity":
			itemDetail.Rarity = set.Value
		case "category":
			itemDetail.Category = set.Value
		}
	}
	itemDetail.Equipped = equipped
	if itemDetail.Equipped { // if item is equipped, check rules
		for _, stat := range element.Rules.Stat {
			stat.ParentID = id
			(*stats) = append((*stats), stat)
		}
	}

	itemDetail.Name = element.Name
	itemDetail.Description = cleanInnerXML(element.Description.InnerXML)
	itemDetail.Amount = amount
	return itemDetail, nil

}

func GetAdornerItemDetails(typeName string, id string, adorner_id string, equipped bool, stats *[]Stat) (ItemDetail, error) {
	itemDetail := ItemDetail{}
	element, err := getElement("Magic Item", adorner_id)
	if err != nil {
		return itemDetail, fmt.Errorf("error getting Adorned Item %w", err)
	}
	statsParent := make(map[string]string)
	switch typeName {
	case "Weapon":
		parentItem, err := GetWeaponDetails(id, equipped)
		if err != nil {
			return itemDetail, fmt.Errorf("error getting Adorned Parent Weapon %w", err)
		}
		itemDetail = parentItem
		statsParent["parent"] = parentItem.Name
		for _, set := range element.Setters {
			switch set.Name {
			case "category":
				itemDetail.Category = set.Value
			case "rarity":
				itemDetail.Rarity = set.Value
			case "enhancement":
				if parentItem.Damage != nil {
					damage := *parentItem.Damage + "+" + set.Value
					itemDetail.Damage = &damage
				}
				statsParent["enhancement"] = set.Value
			case "name-format":
				itemDetail.Name = set.Value
			}
		}
		itemDetail.DMGType = parentItem.DMGType
		itemDetail.Range = parentItem.Range
	case "Armor":
		parentItem, err := GetArmorDetails(id, equipped, stats)
		if err != nil {
			return itemDetail, fmt.Errorf("error getting Adorned Parent Armor %w", err)
		}
		itemDetail = parentItem
		statsParent["parent"] = parentItem.Name
		for _, set := range element.Setters {
			switch set.Name {
			case "category":
				itemDetail.Category = set.Value
			case "rarity":
				itemDetail.Rarity = set.Value
			case "enhancement":
				statsParent["enhancement"] = set.Value
				if parentItem.AC != nil {
					AC := *parentItem.AC + "+" + set.Value
					itemDetail.AC = &AC
				}

			case "name-format":
				itemDetail.Name = set.Value
			}
		}

	}
	itemDetail.Equipped = equipped

	if itemDetail.Equipped { // if item is equipped, check rules
		for _, stat := range element.Rules.Stat {
			stat.ParentID = id
			(*stats) = append((*stats), stat)
		}
	}
	itemDetail.Description = cleanInnerXML(element.Description.InnerXML)
	if itemDetail.Name == "" || !strings.Contains(itemDetail.Name, "{parent}") { // if no name format, use adorner name
		itemDetail.Name = element.Name
	} else {
		itemDetail.Name = replaceStatValue(itemDetail.Name, statsParent)
	}
	itemDetail.Amount = 1

	return itemDetail, nil

}

func formatTime(input string) string {
	// Regex digit and word
	re := regexp.MustCompile(`(\d+)\s+(\w+)`)
	matches := re.FindStringSubmatch(input)

	if len(matches) < 3 {
		return input
	}

	number, word := matches[1], matches[2]

	// Define word mappings
	mappings := map[string]string{
		"action":   "A",
		"bonus":    "BA",
		"minute":   "min",
		"minutes":  "min",
		"reaction": "R",
	}

	// normalize
	word = strings.ToLower(strings.ReplaceAll(word, " ", ""))

	if short, found := mappings[word]; found {
		return number + short
	}

	return number + " " + word
}

func formatRange(input string) string {
	re := regexp.MustCompile(`(\d+)\s+(\w+)`)
	matches := re.FindStringSubmatch(input)

	if len(matches) < 2 {
		return input
	}

	number, word := matches[1], matches[2]

	mappings := map[string]string{
		"feet": "ft",
	}

	// normalize
	word = strings.ToLower(strings.ReplaceAll(word, " ", ""))

	if short, found := mappings[word]; found {
		return number + short
	}

	return number + " " + word
}

func getDCAbility(text string) (string, bool) {
	patterns := []string{
		`must make a (\w+) saving throw`,
		`The target must succeed on a (\w+) saving throw`,
	}

	for _, pattern := range patterns { // check if spell saving throw case met
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(text)
		if len(matches) > 1 {
			return matches[1], true // Return ability type of saving throw
		}
	}
	return "", false
}

func ParseDice(dice string) (Dice, error) {
	d := Dice{
		Rolls: make(map[int]int),
		Text:  dice,
	}
	re := regexp.MustCompile(`([+-]?\d+d\d+|[+-]?\d+)`)
	parts := re.FindAllString(dice, -1) // splits string into dice and modifiers

	reDice := regexp.MustCompile(`([+-]?\d+)d(\d+)`)
	for _, part := range parts {
		if reDice.MatchString(part) { // Dice
			sub := reDice.FindStringSubmatch(part)
			if len(sub) != 3 {
				return Dice{}, fmt.Errorf("invalid dice format: %s", part)
			}
			// Int conversion and validate
			numAmount, err := strconv.Atoi(sub[1])
			numSides, err2 := strconv.Atoi(sub[2])
			if err != nil || err2 != nil || numAmount < 1 || numSides < 1 {
				return Dice{}, fmt.Errorf("invalid dice format: %s", part)
			}

			// Store in map
			if existing, ok := d.Rolls[numSides]; ok {
				d.Rolls[numSides] = existing + numAmount // Add amounts for the same sides
			} else {
				d.Rolls[numSides] = numAmount // Init if DNE
			}
		} else { // Number
			numAmount, err := strconv.Atoi(part)
			if err != nil {
				return Dice{}, fmt.Errorf("invalid number format in dice: %s", part)
			}
			if existing, ok := d.Rolls[0]; ok {
				d.Rolls[0] = existing + numAmount // Add to side 0, for number modifiers
			} else {
				d.Rolls[0] = numAmount // Init if DNE
			}
		}
	}

	return d, nil
}
func addDice(d1, d2 Dice) Dice {
	sum := make(map[int]int)
	for sides, amount := range d1.Rolls {
		sum[sides] = amount // Start with d1 values
	}
	for sides, amount := range d2.Rolls {
		if existing, ok := sum[sides]; ok {
			sum[sides] = existing + amount // Add amounts for the same sides
		} else {
			sum[sides] = amount // Add new sides from d2
		}
	}

	// turn rolls to text

	d := Dice{
		Rolls: sum,
		Text:  rollsToText(sum),
	}

	return d
}

func rollsToText(rolls map[int]int) string {
	d := ""

	// Get Keys
	keys := make([]int, 0, len(rolls))
	for k := range rolls {
		keys = append(keys, k)
	}

	// Sort Descending
	sort.Slice(keys, func(i, j int) bool {
		return keys[i] > keys[j]
	})

	// Add Text
	for _, sides := range keys {
		amount := rolls[sides]
		if amount > 0 {
			if d != "" {
				d += "+"
			}
			if sides == 0 {
				d += strconv.Itoa(amount)
			} else {
				d += strconv.Itoa(amount) + "d" + strconv.Itoa(sides)
			}
		}
	}
	return d
}

func getSpellEffect(input string, ability string, abilityTable map[string]Ability, profBonus int) (diceNotation Dice, ok bool) {

	diceMod := regexp.MustCompile(`(\d+d\d+)\s*\+\s*(.+)`)
	diceOnly := regexp.MustCompile(`(\d+d\d+)`)

	matches := diceMod.FindStringSubmatch(input)
	if len(matches) == 3 {
		modNumber := regexp.MustCompile(`^(\d+)\b.*`)
		modDice := regexp.MustCompile(`^(\d+d\d+)\b.*`)

		dice := matches[1]
		parsed, err := ParseDice(dice)
		if err != nil {
			fmt.Printf("Error parsing dice: %v\n", err)
		}

		mod := matches[2]
		// Mod Cases: Number, Dice, Other Modifier
		matchesTemp := modNumber.FindStringSubmatch(mod)
		parsedMod := Dice{
			Rolls: make(map[int]int),
			Text:  "",
		}
		parsedMod.Text = "" // to get rid of linter error for unused variable
		if len(matchesTemp) > 0 {
			parsedMod, err = ParseDice(matchesTemp[1])
			if err != nil {
				fmt.Printf("Error parsing modifier number: %v\n", err)
				return Dice{}, false
			}

		} else if matchesTemp = modDice.FindStringSubmatch(mod); len(matchesTemp) > 0 {
			parsedMod, err = ParseDice(matchesTemp[1])
			if err != nil {
				fmt.Printf("Error parsing modifier number: %v\n", err)
				return Dice{}, false
			}
		} else if strings.Contains(mod, "modifier") {
			// Modifier Case
			if strings.Contains(mod, "your spellcasting ability modifier") {
				parsedMod, err = ParseDice(strconv.Itoa(abilityTable[strings.ToLower(ability)].Mod))
				if err != nil {
					fmt.Printf("Error parsing modifier number: %v\n", err)
					return Dice{}, false
				}
			} else if strings.Contains(mod, "your Constitution modifier") {
				parsedMod, err = ParseDice(strconv.Itoa(abilityTable["constitution"].Mod))
				if err != nil {
					fmt.Printf("Error parsing modifier number: %v\n", err)
					return Dice{}, false
				}
			} else if strings.Contains(mod, "your Strength modifier") {
				parsedMod, err = ParseDice(strconv.Itoa(abilityTable["strength"].Mod))
				if err != nil {
					fmt.Printf("Error parsing modifier number: %v\n", err)
					return Dice{}, false
				}
			} else if strings.Contains(mod, "your Dexterity modifier") {
				parsedMod, err = ParseDice(strconv.Itoa(abilityTable["dexterity"].Mod))
				if err != nil {
					fmt.Printf("Error parsing modifier number: %v\n", err)
					return Dice{}, false
				}
			} else if strings.Contains(mod, "your proficiency modifier") {
				parsedMod, err = ParseDice(strconv.Itoa(profBonus))
				if err != nil {
					fmt.Printf("Error parsing modifier number: %v\n", err)
					return Dice{}, false
				}
			} else { // other case
				return Dice{}, false
			}
		} else {
			return Dice{}, false
		}
		addedDice := addDice(parsed, parsedMod)
		return addedDice, true
	}

	// No modifier
	matches = diceOnly.FindStringSubmatch(input)
	if len(matches) == 2 {
		dice := matches[1]
		parsed, err := ParseDice(dice)
		if err != nil {
			fmt.Printf("Error parsing dice: %v\n", err)
		}
		return parsed, true
	}

	return Dice{}, false
}

func getDiceLevel(text string, level int) string {
	re := regexp.MustCompile(`(\d+)th level \((\d+d\d+)\)`)
	matches := re.FindAllStringSubmatch(text, -1)
	base := ""
	for _, match := range matches {
		lvl, _ := strconv.Atoi(match[1])
		dice := match[2]
		if level >= lvl {
			base = dice
		}
	}

	return base

}

func GetSpellDetail(
	spell Spell, maxLevel int, attack int, saveDC int, ability string, abilityTable map[string]Ability, profBonus int) (SpellList []Spell, err error) {
	element, err := getElement("Spell", spell.ID)
	if err != nil {
		return nil, fmt.Errorf("error getting Spell %w", err)
	}

	SpellDetail := spell // Start with the provided spell details
	SpellDetail.Name = element.Name
	SpellDetail.Description = cleanInnerXML(element.Description.InnerXML)

	descriptionArray := strings.Split(SpellDetail.Description, ".")
	for i, sentence := range descriptionArray {
		if strings.Contains(sentence, "On a hit") { //* Hit Case
			SpellDetail.Hit = attack
			if effectDice, found := getSpellEffect(sentence, ability, abilityTable, profBonus); found {
				// Effect dice usually within same sentence as "On a hit"
				SpellDetail.Effect = effectDice

			}
			break
		} else if savingThrow, found := getDCAbility(sentence); found { //* DC Case
			SpellDetail.SaveDC = fmt.Sprintf("%d %s", saveDC, savingThrow)
			for j := i + 1; j < len(descriptionArray); j++ {
				if effectDice, found := getSpellEffect(descriptionArray[j], ability, abilityTable, profBonus); found {
					// From next sentence, after find effect dice. Stop at first found.
					SpellDetail.Effect = effectDice
					break
				}
			}
			break
		} else if effectDice, found := getSpellEffect(sentence, ability, abilityTable, profBonus); found { // * Other case, with effects
			// From next sentence, after find effect dice. Stop at first found.
			SpellDetail.Effect = effectDice
			break // Stop after finding the first effect dice
		}
	}

	for _, setter := range element.Setters {
		switch setter.Name {
		case "time":
			SpellDetail.Time = formatTime(setter.Value)
		case "duration":
			SpellDetail.Duration = setter.Value
		case "range":
			SpellDetail.Range = formatRange(setter.Value)
		case "isRitual":
			if setter.Value == "true" {
				SpellDetail.Ritual = true
			} else {
				SpellDetail.Ritual = false
			}
		}
	}

	spellList := []Spell{} // Initialize with the base spell detail
	// * Upcast Spell Check
	for i, sentence := range descriptionArray {
		if strings.Contains(sentence, "At Higher Levels") { // Upcasted separate spells
			for j := i; j < len(descriptionArray); j++ {
				if effectDice, found := getSpellEffect(descriptionArray[j], ability, abilityTable, profBonus); found {
					addEffect := effectDice

					for k := spell.Level + 1; k <= maxLevel; k++ {

						currEffect := SpellDetail.Effect
						for l := 0; l < k-1; l++ {
							currEffect = addDice(currEffect, addEffect)
						}
						spellUpcast := SpellDetail
						spellUpcast.Level = k
						spellUpcast.Effect = currEffect
						spellList = append(spellList, spellUpcast)
					}
					break
				}
			}
			break
		} else if strings.Contains(sentence, "when you reach 5th level") { // Replaces the spell with the maximum allowed level
			replaceDiceEffect := getDiceLevel(sentence, 5)
			if replaceDiceEffect != "" {
				// replace
				parsedEffect, err := ParseDice(replaceDiceEffect)
				if err != nil {
					fmt.Printf("Error parsing upcast replace dice: %v\n", err)
				}
				SpellDetail.Effect = parsedEffect
			}
			break
		}
	}
	spellList = append(spellList, SpellDetail)
	return spellList, nil
}

func GetLanguage(id string) (string, error) {
	element, err := getElement("Language", id)
	if err != nil {
		return "", fmt.Errorf("error getting element %w", err)
	}
	if element.Name == "" {
		return "", fmt.Errorf("cannot find element with ID %s", id)
	}
	return element.Name, nil
}
