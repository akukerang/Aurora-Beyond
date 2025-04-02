package source

import (
	"encoding/xml"
	"fmt"
	"io"
	"os"
	"regexp"
	"sort"
	"strings"
	"sync"
)

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
	Name        string
	Description string
	Time        string
	Range       string
	Duration    string
	Ritual      bool
}

func getElement(typeName string, id string) (SourceElement, error) {

	filePath := "Types/" + typeName + ".xml"

	file, err := os.Open(filePath)
	if err != nil {
		return SourceElement{}, fmt.Errorf("error opening file %w", err)
	}
	defer file.Close()

	xmlData, err := io.ReadAll(file)
	if err != nil {
		return SourceElement{}, fmt.Errorf("error reading file %w", err)
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
	if itemDetail.Name == "" { // if no name format, use adorner name
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

func GetSpellDetail(spell *Spell) error {
	element, err := getElement("Spell", spell.ID)
	if err != nil {
		return fmt.Errorf("error getting Spell %w", err)
	}
	spell.Name = element.Name
	spell.Description = cleanInnerXML(element.Description.InnerXML)
	for _, setter := range element.Setters {
		switch setter.Name {
		case "time":
			spell.Time = formatTime(setter.Value)
		case "duration":
			spell.Duration = setter.Value
		case "range":
			spell.Range = formatRange(setter.Value)
		case "isRitual":
			if setter.Value == "true" {
				spell.Ritual = true
			} else {
				spell.Ritual = false
			}
		}
	}
	return nil
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
