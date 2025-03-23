package character

import (
	"Aurora-Beyond/source"
	"encoding/xml"
	"fmt"
	"io"
	"math"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
)

type characterInfo struct {
	XMLName             xml.Name `xml:"character"`
	TotalLevel          int      `xml:"display-properties>level"`
	ClassData           map[string]classData
	AbilityPoints       abilities `xml:"build>abilities"`
	AbilityTable        map[string]int
	ItemList            []item    `xml:"build>equipment>item"`
	Elements            []element `xml:"build>elements>element"`
	LevelElements       []element
	OtherElements       []element
	SkillProf           []string
	SavingProf          []string
	StatsRaw            []source.Stat
	Feats               source.Feat
	Stats               map[string]string
	stealthDisadvantage bool
	initAdv             bool

	// * GOES TO FINAL CHARACTER CLASS
	Name       string   `xml:"display-properties>name"`
	Class      string   `xml:"display-properties>class"`
	Race       string   `xml:"display-properties>race"`
	Background string   `xml:"display-properties>background"`
	Magic      Magic    `xml:"build>magic"`
	Attacks    []Attack `xml:"build>input>attacks>attack"`
	ProfBonus  int
}

type Ability struct {
	score int
	mod   int
}

type Character struct { // Goes to Final
	AbilityScore map[string]Ability
	Name         string
	Class        string
	Race         string
	Background   string
	Languages    []string
	Conditions   []string
	ArmorProf    []string
	WeaponProf   []string
	ToolProf     []string
	HP           int
	AC           int
	Speed        int
	ProfBonus    int
	Skills       []Skill
	SavingThrows []Skill
	Initiative   Skill
	Magic        Magic
	Attacks      []Attack
	Inventory    []source.ItemDetail
	FeatsFinal   []source.Detail
}

type Skill struct {
	Name         string
	Mod          int
	Ability      string
	Proficient   bool
	Advantage    bool
	Disadvantage bool
}

type element struct {
	Type       string    `xml:"type,attr"`
	Name       string    `xml:"name,attr"`
	Class      string    `xml:"class,attr"`
	RndHP      string    `xml:"rndhp,attr"`
	Registered string    `xml:"registered,attr"`
	ID         string    `xml:"id,attr"`
	Elements   []element `xml:"element"`
}

type abilities struct {
	Strength     int `xml:"strength"`
	Dexterity    int `xml:"dexterity"`
	Constitution int `xml:"constitution"`
	Intelligence int `xml:"intelligence"`
	Wisdom       int `xml:"wisdom"`
	Charisma     int `xml:"charisma"`
}

type Magic struct {
	Multiclassing bool `xml:"multiclass,attr"`
	SpellSlots    []int
	Level         int      `xml:"level,attr"`
	ClassSpells   []spells `xml:"spellcasting"`
}

type spells struct {
	ClassName  string         `xml:"name,attr"`
	SpellSlots []int          `xml:"spellcasting>slots"`
	Ability    string         `xml:"ability,attr"`
	Attack     int            `xml:"attack,attr"`
	SaveDC     int            `xml:"dc,attr"`
	Spells     []source.Spell `xml:"spells>spell"`
	Cantrips   []source.Spell `xml:"cantrips>spell"`
}

type spellSlots struct {
	S1 int `xml:"s1,attr"`
	S2 int `xml:"s2,attr"`
	S3 int `xml:"s3,attr"`
	S4 int `xml:"s4,attr"`
	S5 int `xml:"s5,attr"`
	S6 int `xml:"s6,attr"`
	S7 int `xml:"s7,attr"`
	S8 int `xml:"s8,attr"`
	S9 int `xml:"s9,attr"`
}

type Attack struct {
	Range  string `xml:"range,attr"`
	Hit    string `xml:"attack,attr"`
	Damage string `xml:"damage,attr"`
}

type item struct {
	ID       string   `xml:"id,attr"`
	Amount   int      `xml:"amount,attr"`
	Equipped bool     `xml:"equipped"`
	Adorner  *adorner `xml:"items>adorner"`
}

type adorner struct {
	ID string `xml:"id,attr"`
}

type classData struct {
	totalLevel int
	totalHP    int
	rndHP      []int
	feats      source.Feat
	stats      []source.Stat
}

type data struct {
	ID    string
	feats source.Feat
	stats []source.Stat
}

func (i *item) UnmarshalXML(d *xml.Decoder, start xml.StartElement) error {
	type Alias item
	aux := &struct {
		Amount int `xml:"amount,attr"`
		*Alias
	}{
		Amount: 1,
		Alias:  (*Alias)(i),
	}

	if err := d.DecodeElement(aux, &start); err != nil {
		return err
	}

	// defaults inventory items amount to 1
	i.Amount = aux.Amount
	return nil
}

func (s *spells) UnmarshalXML(d *xml.Decoder, start xml.StartElement) error {
	type Alias spells
	aux := &struct {
		Slots    spellSlots     `xml:"slots"`
		Spells   []source.Spell `xml:"spells>spell"`
		Cantrips []source.Spell `xml:"cantrips>spell"`
		*Alias
	}{
		Alias: (*Alias)(s),
	}

	if err := d.DecodeElement(aux, &start); err != nil {
		return err
	}

	// Add all cantrips
	s.Cantrips = aux.Cantrips

	// Add only prepared spells
	for _, spell := range aux.Spells {
		if spell.Prepared || spell.Known {
			s.Spells = append(s.Spells, spell)
		}
	}

	allSlots := []int{aux.Slots.S1, aux.Slots.S2, aux.Slots.S3, aux.Slots.S4, aux.Slots.S5, aux.Slots.S6, aux.Slots.S7, aux.Slots.S8, aux.Slots.S9} // add all spell slots to array
	for _, slot := range allSlots {
		if slot != 0 {
			s.SpellSlots = append(s.SpellSlots, slot)
		}
	}

	return nil
}

func stringToIntArray(input string) ([]int, error) {
	parts := strings.Split(input, ",") // Split string by commas
	var result []int

	for _, part := range parts {
		part = strings.TrimSpace(part) // Remove spaces
		num, err := strconv.Atoi(part) // Convert to int
		if err != nil {
			return nil, err // Return error if conversion fails
		}
		result = append(result, num)
	}

	return result, nil
}

func removeDuplicateHelper(feats []source.FeatDetail) []source.FeatDetail {
	keys := make(map[string]bool)
	list := []source.FeatDetail{}
	for _, entry := range feats {
		if _, value := keys[entry.ID]; !value {
			keys[entry.ID] = true
			list = append(list, entry)
		}
	}
	return list
}

func removeDuplicateFeats(feats source.Feat) source.Feat {
	return source.Feat{
		Features: removeDuplicateHelper(feats.Features),
		Profs:    removeDuplicateHelper(feats.Profs),
		Grants:   removeDuplicateHelper(feats.Grants),
		Language: removeDuplicateHelper(feats.Language),
	}
}

// * Gets Data for each Class: Level, HP, Feats, and Stats for feats based on class level.
func extractClassData(character *characterInfo) (map[string]classData, error) {
	mainClass := ""
	classLevels := make(map[string]classData)
	sort.Slice(character.LevelElements, func(i, j int) bool { // Sometimes order is not correct, not sure why
		return character.LevelElements[i].Name < character.LevelElements[j].Name
	})
MainLoop:
	for _, element := range character.LevelElements {
		if element.Name == "1" {
			subElements := element.Elements
			for _, subElement := range subElements {
				if subElement.Type == "Class" {
					mainClass = subElement.Registered
					break MainLoop // exit MainLoop when main class is found
				}
			}
		}
	}

	// Count levels for each class, default condition main class
	for _, element := range character.LevelElements {
		class := element.Class
		if class == "" && mainClass != "" { // if class is empty, use main class
			class = mainClass
		}

		for _, subElement := range element.Elements {
			if subElement.Type == "Class" || subElement.Type == "Multiclass" {
				feats, profs, grants, langs := getFeatures(subElement, character.TotalLevel)
				tempFeat := source.Feat{
					Features: feats,
					Profs:    profs,
					Grants:   grants,
					Language: langs,
				}
				classLevels[class] = classData{feats: tempFeat}
				break
			}
		}

		if element.RndHP != "" {
			rndHPArray, err := stringToIntArray(element.RndHP)
			if err != nil {
				return nil, fmt.Errorf("error turning string to int array %w", err)
			}
			temp := classLevels[class]
			temp.rndHP = rndHPArray // init rndHP array in classLevels
			classLevels[class] = temp
		}
		if classLevels[class].rndHP != nil { // if rndHP is empty, set to 0
			level := classLevels[class]
			level.totalLevel++                               // increment level
			level.totalHP += level.rndHP[level.totalLevel-1] // add HP from rndHP array for that level
			classLevels[class] = level
		} else {
			return nil, fmt.Errorf("error getting class RNDHP: %s", class)
		}

	}

	// Gets raw stats for the class features from source
	for key, value := range classLevels {

		var wg sync.WaitGroup
		statCh := make(chan source.Stat, len(value.feats.Features))
		errCh := make(chan error, len(value.feats.Features))
		temp := classLevels[key]
		for ind, feat := range value.feats.Features {
			if feat.ID != "" {
				wg.Add(1)
				go source.GetStat(feat.Type, feat.ID, value.totalLevel, statCh, errCh, &wg)
				// Replace feat level with class level
				tempFeat := feat
				tempFeat.Level = value.totalLevel
				value.feats.Features[ind] = tempFeat
			}

		}

		go func() {
			wg.Wait()
			close(statCh)
			close(errCh)
		}()

		// ! ONLY THIS LOOP BREAKS THE PROGRAM, IDK WHY
		// for err := range errCh {
		// 	if err != nil {
		// 		return nil, fmt.Errorf("error getting class stat: %w", err)
		// 	}
		// }

		for result := range statCh {
			temp.stats = append(temp.stats, result)
		}
		classLevels[key] = temp

	}

	return classLevels, nil

}

func extractRaceData(character *characterInfo) (data, error) {
	raceData := data{}
MainLoop:
	for _, element := range character.LevelElements {
		for _, subElement := range element.Elements {
			if subElement.Type == "Race" {
				raceData.ID = subElement.Registered
				raceData.feats.Features, raceData.feats.Profs, raceData.feats.Grants, raceData.feats.Language = getFeatures(subElement, character.TotalLevel)
				break MainLoop
			}
		}
	}

	// Gets Race Feats & Stats from source, and remove duplicate feats
	err := source.GetRaceStats(raceData.ID, &raceData.stats) // Get the class features from source
	if err != nil {
		return data{}, fmt.Errorf("error getting source race stats: %w", err)
	}

	var wg sync.WaitGroup
	statCh := make(chan source.Stat, len(raceData.feats.Features))
	errCh := make(chan error, len(raceData.feats.Features))
	for _, feat := range raceData.feats.Features {
		if feat.ID != "" {
			wg.Add(1)
			go source.GetStat(feat.Type, feat.ID, character.TotalLevel, statCh, errCh, &wg)
		}
	}

	go func() {
		wg.Wait()
		close(statCh)
		close(errCh)
	}()

	for err := range errCh {
		if err != nil {
			return data{}, fmt.Errorf("error getting race stat: %w", err)
		}
	}

	for result := range statCh {
		raceData.stats = append(raceData.stats, result)
	}

	return raceData, nil
}

func extractBackgroundData(characterInfo *characterInfo) (data, error) {
	backgroundData := data{}
MainLoop:
	for _, element := range characterInfo.LevelElements {
		for _, subElement := range element.Elements {
			if subElement.Type == "Background" {
				backgroundData.ID = subElement.Registered
				backgroundData.feats.Features, backgroundData.feats.Profs, backgroundData.feats.Grants, backgroundData.feats.Language = getFeatures(subElement, characterInfo.TotalLevel)
				break MainLoop
			}
		}
	}

	var wg sync.WaitGroup
	statCh := make(chan source.Stat, len(backgroundData.feats.Features))
	errCh := make(chan error, len(backgroundData.feats.Features))
	for _, feat := range backgroundData.feats.Features {
		if feat.ID != "" {
			wg.Add(1)
			go source.GetStat(feat.Type, feat.ID, 0, statCh, errCh, &wg)
		}
	}

	go func() {
		wg.Wait()
		close(statCh)
		close(errCh)
	}()

	for err := range errCh {
		if err != nil {
			return data{}, fmt.Errorf("error getting class stat: %w", err)
		}
	}

	for result := range statCh {
		backgroundData.stats = append(backgroundData.stats, result)
	}

	return backgroundData, nil
}

func extractOtherFeatures(character *characterInfo) data {
	otherData := data{}
	otherData.feats.Features, otherData.feats.Profs, otherData.feats.Grants, otherData.feats.Language = getFeaturesMult(character.OtherElements, character.TotalLevel)
	return otherData
}

// * Multiclass Spell Slot Table
func getMulticlassSpellSlots(totalLevel int) []int {
	spellSlotsTable := [][]int{
		{2},                         // Level 1
		{3},                         // Level 2
		{4, 2},                      // Level 3
		{4, 3},                      // Level 4
		{4, 3, 2},                   // Level 5
		{4, 3, 3},                   // Level 6
		{4, 3, 3, 1},                // Level 7
		{4, 3, 3, 2},                // Level 8
		{4, 3, 3, 3, 1},             // Level 9
		{4, 3, 3, 3, 2},             // Level 10
		{4, 3, 3, 3, 2, 1},          // Level 11
		{4, 3, 3, 3, 2, 1},          // Level 12
		{4, 3, 3, 3, 2, 1, 1},       // Level 13
		{4, 3, 3, 3, 2, 1, 1},       // Level 14
		{4, 3, 3, 3, 2, 1, 1, 1},    // Level 15
		{4, 3, 3, 3, 2, 1, 1, 1},    // Level 16
		{4, 3, 3, 3, 2, 1, 1, 1, 1}, // Level 17
		{4, 3, 3, 3, 3, 1, 1, 1, 1}, // Level 18
		{4, 3, 3, 3, 3, 2, 1, 1, 1}, // Level 19
		{4, 3, 3, 3, 3, 2, 2, 1, 1}, // Level 20
	}
	if totalLevel < 1 || totalLevel > len(spellSlotsTable) { // invalid case
		return []int{}
	}
	return spellSlotsTable[totalLevel-1]
}

// * calculate ability modifier
func calculateMod(ability int) int {
	mod := math.Floor(float64(ability-10) / 2.0)
	return int(mod)
}

func getClassName(classID string) string {
	parts := strings.Split(strings.ToLower(classID), "_") // Split string by commas
	return parts[len(parts)-1]
}

// * gets the name of the proficiency inside parentheses
func formatProfName(name string) string {
	re := regexp.MustCompile(`\((.*)\)`)
	match := re.FindStringSubmatch(name)

	if len(match) > 1 {
		return match[1]
	} else {
		return name
	}
}

// * recursively get deepest level of element
func getDeepestLevel(elements element, feats *[]source.FeatDetail, level int) {

	if len(elements.Elements) == 0 || elements.Elements == nil || elements.Type == "Proficiency" {
		id := ""
		if elements.ID == "" {
			id = elements.Registered
		} else {
			id = elements.ID
		}
		temp := source.FeatDetail{
			Type:  elements.Type,
			Name:  elements.Name,
			ID:    id,
			Level: level,
		}
		*feats = append(*feats, temp)

	} else {
		for _, element := range elements.Elements {
			getDeepestLevel(element, feats, level)
		}
	}
}

func getFeatures(element element, level int) ([]source.FeatDetail, []source.FeatDetail, []source.FeatDetail, []source.FeatDetail) {
	allFeats := make([]source.FeatDetail, 0)
	prof := make([]source.FeatDetail, 0)
	languages := make([]source.FeatDetail, 0)
	grants := make([]source.FeatDetail, 0)
	features := []source.FeatDetail{}
	var wg sync.WaitGroup

	if element.Elements != nil {
		getDeepestLevel(element, &allFeats, level)
	}

	validTypes := map[string]bool{
		"Racial Trait":       true,
		"Class Feature":      true,
		"Feat":               true,
		"Archetype Feature":  true,
		"Background Feature": true,
	}

	langCh := make(chan source.FeatDetail, len(allFeats))
	grantCh := make(chan source.FeatDetail, len(allFeats))
	profCh := make(chan source.FeatDetail, len(allFeats))
	featCh := make(chan source.FeatDetail, len(allFeats))
	for _, feat := range allFeats { // Filters for only features and proficiencies
		wg.Add(1)
		go func(feat source.FeatDetail) {
			defer wg.Done()
			switch {
			case feat.Type == "Language":
				langCh <- feat
			case feat.Type == "Grants", feat.Type == "Condition":
				grantCh <- feat
			case feat.Type == "Proficiency":
				temp := source.FeatDetail{
					Type: feat.Type,
					Name: formatProfName(feat.Name),
					ID:   feat.ID,
				}
				profCh <- temp
			case validTypes[feat.Type]:
				featCh <- feat
			}
		}(feat)
	}

	go func() {
		wg.Wait()
		close(langCh)
		close(grantCh)
		close(profCh)
		close(featCh)
	}()
	for feat := range langCh {
		languages = append(languages, feat)
	}
	for feat := range grantCh {
		grants = append(grants, feat)
	}
	for feat := range profCh {
		prof = append(prof, feat)
	}
	for feat := range featCh {
		features = append(features, feat)
	}

	return features, prof, grants, languages
}

func getFeaturesMult(elementList []element, level int) ([]source.FeatDetail, []source.FeatDetail, []source.FeatDetail, []source.FeatDetail) {
	allFeats := make([]source.FeatDetail, 0)
	prof := make([]source.FeatDetail, 0)
	languages := make([]source.FeatDetail, 0)
	grants := make([]source.FeatDetail, 0)
	features := []source.FeatDetail{}

	for _, element := range elementList {
		if element.Elements != nil {
			getDeepestLevel(element, &allFeats, level)
		}
	}

	var wg sync.WaitGroup

	validTypes := map[string]bool{
		"Racial Trait":       true,
		"Class Feature":      true,
		"Feat":               true,
		"Archetype Feature":  true,
		"Background Feature": true,
	}

	langCh := make(chan source.FeatDetail, len(allFeats))
	grantCh := make(chan source.FeatDetail, len(allFeats))
	profCh := make(chan source.FeatDetail, len(allFeats))
	featCh := make(chan source.FeatDetail, len(allFeats))
	for _, feat := range allFeats { // Filters for only features and proficiencies
		wg.Add(1)
		go func(feat source.FeatDetail) {
			defer wg.Done()
			switch {
			case feat.Type == "Language":
				langCh <- feat
			case feat.Type == "Grants", feat.Type == "Condition":
				grantCh <- feat
			case feat.Type == "Proficiency":
				temp := source.FeatDetail{
					Type: feat.Type,
					Name: formatProfName(feat.Name),
					ID:   feat.ID,
				}
				profCh <- temp
			case validTypes[feat.Type]:
				featCh <- feat
			}
		}(feat)
	}

	go func() {
		wg.Wait()
		close(langCh)
		close(grantCh)
		close(profCh)
		close(featCh)
	}()
	for feat := range langCh {
		languages = append(languages, feat)
	}
	for feat := range grantCh {
		grants = append(grants, feat)
	}
	for feat := range profCh {
		prof = append(prof, feat)
	}
	for feat := range featCh {
		features = append(features, feat)
	}
	return features, prof, grants, languages
}

func calculateProfBonus(level int) int {
	switch {
	case level < 5:
		return 2
	case level < 9:
		return 3
	case level < 13:
		return 4
	case level < 17:
		return 5
	default:
		return 6
	}
}

func processStats(character *characterInfo) error {

	// Ability Score Table,
	if character.AbilityTable == nil {
		character.AbilityTable = make(map[string]int)
		character.AbilityTable["strength"] = character.AbilityPoints.Strength
		character.AbilityTable["dexterity"] = character.AbilityPoints.Dexterity
		character.AbilityTable["constitution"] = character.AbilityPoints.Constitution
		character.AbilityTable["intelligence"] = character.AbilityPoints.Intelligence
		character.AbilityTable["wisdom"] = character.AbilityPoints.Wisdom
		character.AbilityTable["charisma"] = character.AbilityPoints.Charisma
	}

	// Initialize Stats, with values already known
	if character.Stats == nil {
		character.Stats = make(map[string]string)
		for key, value := range character.AbilityTable { // Initalizes the base value
			character.Stats[key+":score:set"] = "0"
			character.Stats[key+":score"] = strconv.Itoa(value)
			character.Stats[key+":max"] = "0"    // maximum_score = 20 + score:max
			character.Stats[key+":change"] = "0" // total change in score
		}
		character.ProfBonus = calculateProfBonus(character.TotalLevel)
		character.Stats["proficiency"] = strconv.Itoa(character.ProfBonus)
		character.Stats["proficiency:half"] = strconv.Itoa(int(math.Ceil(float64(character.ProfBonus) / 2)))
		character.Stats["proficiency:half:up"] = strconv.Itoa(int(math.Ceil(float64(character.ProfBonus) / 2)))

		for key, value := range character.ClassData { // class levels
			character.Stats["level:"+getClassName(key)] = strconv.Itoa(value.totalLevel)
			character.Stats["level:"+getClassName(key)+":half"] = strconv.Itoa(int(math.Ceil(float64(value.totalLevel) / 2))) // TODO: look into a better way
		}
	}

	var wg sync.WaitGroup
	errCh := make(chan error, len(character.StatsRaw))
	statCh := make(chan source.Stat, len(character.StatsRaw))
	updateCh := make(chan func(), len(character.StatsRaw))
	mu := &sync.Mutex{}
	// Get all ability scores changes first, update them and modifiers, then process rest of stats
	for _, stat := range character.StatsRaw {
		wg.Add(1)
		go func(stat source.Stat) {
			defer wg.Done()
			switch stat.Name {
			case "strength:score:set", "dexterity:score:set", "constitution:score:set", "intelligence:score:set", "wisdom:score:set", "charisma:score:set":
				// if current is less than set, keep current else use set, but set can't be raised above set.
				parts := strings.Split(stat.Name, ":")
				ability := parts[0]
				changeKey := ability + ":change"             // change key
				scoreKey := ability + ":score"               // score key
				newSetValue, err := strconv.Atoi(stat.Value) // New Set Value
				if err != nil {
					errCh <- err
					return
				}
				oldSetvalue, err := strconv.Atoi(character.Stats[stat.Name]) // Old Set Value
				if err != nil {
					errCh <- err
					return
				}
				updateCh <- func() {
					mu.Lock()
					defer mu.Unlock()
					if newSetValue > oldSetvalue { // if new set value is greater than old set value, set to new
						character.Stats[stat.Name] = stat.Value
					}
					change, err := strconv.Atoi(character.Stats[changeKey]) // get total change for ability
					if err != nil {
						errCh <- err
						return
					}
					totalScore := character.AbilityTable[ability] + change // Base + Change
					if totalScore < newSetValue {                          // if total score is less than new set value, set to new set value
						character.Stats[scoreKey] = strconv.Itoa(newSetValue)
					} else {
						character.Stats[scoreKey] = strconv.Itoa(totalScore)
					}
				}
			case "strength:max", "dexterity:max", "constitution:max", "intelligence:max", "wisdom:max", "charisma:max":
				parts := strings.Split(stat.Name, ":")
				ability := parts[0]
				changeKey := ability + ":change"        // change key
				setKey := ability + ":score:set"        // set key
				scoreKey := ability + ":score"          // score key
				newMax, err := strconv.Atoi(stat.Value) // new max
				if err != nil {
					errCh <- err
					return
				}
				currentMax, err := strconv.Atoi(character.Stats[stat.Name]) // old max
				if err != nil {
					errCh <- err
					return
				}
				change, err := strconv.Atoi(character.Stats[changeKey]) // get current change
				if err != nil {
					errCh <- err
					return
				}
				if newMax > currentMax {
					updateCh <- func() {
						mu.Lock()
						defer mu.Unlock()
						character.Stats[stat.Name] = stat.Value                // update max
						setValue, err := strconv.Atoi(character.Stats[setKey]) // get set value
						if err != nil {
							errCh <- err
							return
						}
						totalScore := character.AbilityTable[ability] + change // Base + Change
						if setValue > totalScore {                             // if set value is greater than total score, set to set value, make sure below max
							if setValue < 20+newMax { // if set value is less than new max, set to set value
								character.Stats[scoreKey] = strconv.Itoa(setValue)
							} else {
								character.Stats[scoreKey] = strconv.Itoa(20 + newMax) // else set to max
							}
						} else { // if total score is greater than set value, set to total score
							if totalScore < 20+newMax { // if set value is less than new max, set to set value
								character.Stats[scoreKey] = strconv.Itoa(totalScore)
							} else {
								character.Stats[scoreKey] = strconv.Itoa(20 + newMax) // else set to max
							}
						}
					}
				}
			case "strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma":
				scoreKey := stat.Name + ":score"   // current score key
				changeKey := stat.Name + ":change" // change key
				maxKey := stat.Name + ":max"       // max key
				setKey := stat.Name + ":score:set" // set key
				updateCh <- func() {
					mu.Lock()
					defer mu.Unlock()
					newVal, err := strconv.Atoi(stat.Value)
					if err != nil {
						errCh <- err
						return
					}
					currentMax, err := strconv.Atoi(character.Stats[maxKey]) // get current max
					if err != nil {
						errCh <- err
						return
					}
					currentSet, err := strconv.Atoi(character.Stats[setKey]) // get current set
					if err != nil {
						errCh <- err
						return
					}
					change, err := strconv.Atoi(character.Stats[changeKey]) // get change
					if err != nil {
						errCh <- err
						return
					}

					newChange := change + newVal
					character.Stats[changeKey] = strconv.Itoa(newChange)

					baseValue := character.AbilityTable[stat.Name] // get base value
					newScore := baseValue + newChange              // calculate new score

					if newScore > currentSet { // check if above set value
						if newScore < 20+currentMax { // if new score is less than max, set to new score
							character.Stats[scoreKey] = strconv.Itoa(newScore)
						} else {
							character.Stats[scoreKey] = strconv.Itoa(20 + currentMax) // else set to max
						}
					} // if less than current set keep as current set.
				}
			default:
				// filteredRawStats = append(filteredRawStats, stat) // remove ability score stats from raw stats
				statCh <- stat // send to channel for processing

			}

		}(stat)
	}
	go func() {
		wg.Wait()
		close(errCh)
		close(updateCh)
		close(statCh)
	}()

	for err := range errCh {
		if err != nil {
			return fmt.Errorf("error getting stats: %w", err)
		}
	}

	for update := range updateCh {
		update()
	}

	filteredRawStats := []source.Stat{}

	for stat := range statCh {
		filteredRawStats = append(filteredRawStats, stat) // add to filtered raw stats
	}
	character.StatsRaw = filteredRawStats

	for key := range character.AbilityTable { // update modifiers
		value, err := strconv.Atoi(character.Stats[key+":score"])
		if err != nil {
			return fmt.Errorf("error converting string to int: %w", err)
		}
		character.Stats[key+":modifier"] = strconv.Itoa(calculateMod(value))
	}

	errCh = make(chan error, len(character.StatsRaw))
	updateCh = make(chan func(), len(character.StatsRaw))

	for _, s := range character.StatsRaw {
		wg.Add(1)
		go func(stat source.Stat) {
			defer wg.Done()

			updateCh <- func() {
				defer mu.Unlock()
				mu.Lock()
				if stat.Requirement != "" && stat.Name == "speed" { // Check if strength requirement is met
					re := regexp.MustCompile(`\d+`)          // Matches one or more digits
					match := re.FindString(stat.Requirement) // Extracts the first number found

					strength, err := strconv.Atoi(character.Stats["strength:score"])
					if err != nil {
						errCh <- err
						return
					}
					strengthReq, err := strconv.Atoi(match)
					if err != nil {
						errCh <- err
						return
					}
					if strength >= strengthReq { // if pass check, then skip stat
						return
					}
				}

				if character.Stats[stat.Name] != "" { // check if stat already exists
					// Requirement and Level Checker here
					// check if stat value is an int or a string
					// if its an int, add it to the existing stat
					existingValue, err := strconv.Atoi(character.Stats[stat.Name])
					if err != nil {
						errCh <- err
						return
					}

					if newValue, err := strconv.Atoi(stat.Value); err == nil {
						character.Stats[stat.Name] = strconv.Itoa(existingValue + newValue)

					} else if character.Stats[stat.Value] != "" {
						// if its a string, check if its a another stat value or a string
						// check if stat value is a key in character.stats
						newValue, err := strconv.Atoi(character.Stats[stat.Value])
						if err != nil {
							errCh <- err
							return
						}
						character.Stats[stat.Name] = strconv.Itoa(existingValue + newValue)
					} else { // just a string, add
						// character.Stats[stat.Name] = character.Stats[stat.Name] + stat.Value // for debugging
						character.Stats[stat.Name] = stat.Value
					}
				} else {
					// initialize stat value for that key
					if character.Stats[stat.Value] != "" { // check if stat value is a key in character.stats
						character.Stats[stat.Name] = character.Stats[stat.Value]
					} else {
						character.Stats[stat.Name] = stat.Value
					}
				}
			}
		}(s)
	}
	go func() {
		wg.Wait()
		close(errCh)
		close(updateCh)
	}()
	for err := range errCh {
		if err != nil {
			return fmt.Errorf("error getting stats: %w", err)
		}
	}

	for update := range updateCh {
		update()
	}

	character.StatsRaw = []source.Stat{} // clear raw stats
	return nil
}

func combineFeats(feats ...source.Feat) source.Feat {
	combined := source.Feat{}
	for _, src := range feats {
		combined.Features = append(combined.Features, src.Features...)
		combined.Profs = append(combined.Profs, src.Profs...)
		combined.Grants = append(combined.Grants, src.Grants...)
		combined.Language = append(combined.Language, src.Language...)
	}
	combined = removeDuplicateFeats(combined)

	return combined
}

func combineRawStats(stats ...[]source.Stat) []source.Stat {
	combined := []source.Stat{}
	for _, src := range stats {
		combined = append(combined, src...)
	}
	return combined
}

// * Class Object Setters
func (character *Character) setFeatsAndProfs(characterInfo *characterInfo) error {
	// Get Feats and Profs from Class, Race, Background
	var wg sync.WaitGroup
	errCh := make(chan error, 4)
	classData := make(map[string]classData)
	raceData := data{}
	backgroundData := data{}
	otherData := data{}
	err := error(nil)

	wg.Add(1)
	go func() {
		defer wg.Done()
		classData, err = extractClassData(characterInfo)
		if err != nil {
			errCh <- fmt.Errorf("error extracting class data: %w", err)
		}
		characterInfo.ClassData = classData
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		raceData, err = extractRaceData(characterInfo)
		if err != nil {
			errCh <- fmt.Errorf("error extracting race data: %w", err)
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		backgroundData, err = extractBackgroundData(characterInfo)
		if err != nil {
			errCh <- fmt.Errorf("error extracting background data: %w", err)
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		otherData = extractOtherFeatures(characterInfo)
	}()

	go func() {
		wg.Wait()
		close(errCh)
	}()

	for err := range errCh {
		if err != nil {
			return err
		}
	}

	// Combine Feats
	characterInfo.Feats = combineFeats(
		raceData.feats,
		backgroundData.feats,
		otherData.feats,
		func() source.Feat {
			combined := source.Feat{}
			for _, value := range characterInfo.ClassData {
				combined.Features = append(combined.Features, value.feats.Features...)
				combined.Profs = append(combined.Profs, value.feats.Profs...)
				combined.Language = append(combined.Language, value.feats.Language...)
				combined.Grants = append(combined.Grants, value.feats.Grants...)
			}
			return combined
		}(),
	)

	// Combine Raw Stats
	characterInfo.StatsRaw = combineRawStats(
		raceData.stats,
		backgroundData.stats,
		otherData.stats,
		func() []source.Stat {
			combined := []source.Stat{}
			for _, value := range characterInfo.ClassData {
				combined = append(combined, value.stats...)
			}
			return combined
		}(),
	)

	// Sort Proficiencies
	savingCh := make(chan string, len(characterInfo.Feats.Profs))
	armorCh := make(chan string, len(characterInfo.Feats.Profs))
	weaponCh := make(chan string, len(characterInfo.Feats.Profs))
	toolCh := make(chan string, len(characterInfo.Feats.Profs))
	skillCh := make(chan string, len(characterInfo.Feats.Profs))

	// Sort Proficiencies
	for _, prof := range characterInfo.Feats.Profs {
		wg.Add(1)
		go func(prof source.FeatDetail) {
			defer wg.Done()
			switch {
			case strings.Contains(prof.ID, "SAVING"):
				savingCh <- prof.ID
			case strings.Contains(prof.ID, "ARMOR"):
				armorCh <- prof.Name
			case strings.Contains(prof.ID, "WEAPON"):
				weaponCh <- prof.Name
			case strings.Contains(prof.ID, "TOOL") || strings.Contains(prof.ID, "GAMING"):
				toolCh <- prof.Name
			case strings.Contains(prof.ID, "SKILL"):
				skillCh <- prof.ID
			default:
				fmt.Println("Unknown Proficiency:", prof.ID)
			}
		}(prof)
	}

	go func() {
		wg.Wait()
		close(savingCh)
		close(armorCh)
		close(weaponCh)
		close(toolCh)
		close(skillCh)
	}()

	// Process the channels
	for prof := range savingCh {
		characterInfo.SavingProf = append(characterInfo.SavingProf, prof)
	}
	for prof := range armorCh {
		character.ArmorProf = append(character.ArmorProf, prof)
	}
	for prof := range weaponCh {
		character.WeaponProf = append(character.WeaponProf, prof)
	}
	for prof := range toolCh {
		character.ToolProf = append(character.ToolProf, prof)
	}
	for prof := range skillCh {
		characterInfo.SkillProf = append(characterInfo.SkillProf, prof)
	}

	processStats(characterInfo)

	featDetailCh := make(chan source.Detail, len(characterInfo.Feats.Features))
	errCh = make(chan error, len(characterInfo.Feats.Features))
	// Final Feat List
	for _, feat := range characterInfo.Feats.Features {
		wg.Add(1)
		go func(feat source.FeatDetail) {
			defer wg.Done()
			if feat.ID == "" {
				return
			}
			details, err := source.GetDetails(feat.Type, feat.ID, feat.Level, characterInfo.Stats)
			if err != nil {
				errCh <- err
				return
			}
			if details.Description != "" { // only add feats with descriptions
				featDetailCh <- details
			}
		}(feat)
	}

	go func() {
		wg.Wait()
		close(featDetailCh)
		close(errCh)
	}()

	for details := range featDetailCh {
		character.FeatsFinal = append(character.FeatsFinal, details)
	}
	for err := range errCh {
		if err != nil {
			return fmt.Errorf("error getting feat details: %w", err)
		}
	}

	return nil
}

func (character *Character) setItems(characterInfo *characterInfo) error {
	character.Inventory = []source.ItemDetail{}
	var wg sync.WaitGroup

	itemCh := make(chan source.ItemDetail, len(characterInfo.ItemList))
	errCh := make(chan error, len(characterInfo.ItemList))

	for _, i := range characterInfo.ItemList {
		wg.Add(1)
		go func(item item) {
			defer wg.Done()
			var curr source.ItemDetail
			var err error
			if item.Adorner != nil { // Adorner Case
				switch {
				case strings.Contains(item.ID, "ARMOR") || strings.Contains(item.ID, "GEAR"):
					curr, err = source.GetAdornerItemDetails("Armor", item.ID, item.Adorner.ID, item.Equipped, &characterInfo.StatsRaw)
				case strings.Contains(item.ID, "WEAPON"):
					curr, err = source.GetAdornerItemDetails("Weapon", item.ID, item.Adorner.ID, item.Equipped, &characterInfo.StatsRaw)
				default:
					fmt.Println("Unknown Adorner Item", item.ID)
					err = fmt.Errorf("unknown adorner item: %s", item.ID)
				}
			} else { // Normal Item Case
				switch {
				case strings.Contains(item.ID, "ARMOR") || strings.Contains(item.ID, "GEAR"):
					curr, err = source.GetArmorDetails(item.ID, item.Equipped, &characterInfo.StatsRaw)
				case strings.Contains(item.ID, "WEAPON"):
					curr, err = source.GetWeaponDetails(item.ID, item.Equipped)
				case strings.Contains(item.ID, "MAGIC_ITEM"):
					curr, err = source.GetMagicItemDetails(item.ID, item.Amount, item.Equipped, &characterInfo.StatsRaw)
				case strings.Contains(item.ID, "ITEM"):
					curr, err = source.GetItemDetails("Item", item.ID, item.Amount, item.Equipped, &characterInfo.StatsRaw)
				default:
					fmt.Println("Unknown Item", item.ID, item.Amount)
					err = fmt.Errorf("unknown item: %s", item.ID)
				}
			}

			if err != nil {
				errCh <- err
			} else {
				itemCh <- curr
			}
		}(i)
	}

	go func() {
		wg.Wait()
		close(itemCh)
		close(errCh)
	}()

	for item := range itemCh {
		character.Inventory = append(character.Inventory, item)
	}

	for err := range errCh {
		return fmt.Errorf("error occurred: %w", err)
	}

	processStats(characterInfo)
	return nil
}

func (character *Character) setAC(characterInfo *characterInfo) error {
	armorType := ""
	armorClass := 0
	for _, item := range character.Inventory {
		if item.Equipped && item.ArmorType != nil && *item.ArmorType != "Shield" { // Find equipped armor
			armorType = *item.ArmorType
		}
	}

	for key, stats := range characterInfo.Stats { // adds together all ac stats
		if strings.Contains(key, "ac:") {
			acStat, err := strconv.Atoi(stats)
			if err != nil {
				return fmt.Errorf("error converting AC stat to int: %w", err)
			}
			armorClass += acStat
		}
	}
	switch armorType {
	case "Heavy":
		character.AC = armorClass
	case "Medium":
		dexMod := character.AbilityScore["dexterity"].mod
		if dexMod > 2 { // max dex mod is 2 for medium armor
			dexMod = 2
		}
		armorClass += dexMod
		character.AC = armorClass
	case "Light":
		dexMod := character.AbilityScore["dexterity"].mod
		armorClass += dexMod
		character.AC = armorClass
	}
	return nil

}

func (character *Character) setHP(characterInfo *characterInfo) error {
	mod := character.AbilityScore["constitution"].mod
	character.HP = 0
	for _, class := range characterInfo.ClassData { // add together class levels
		character.HP += class.totalHP
	}
	character.HP += (mod * characterInfo.TotalLevel) // add together constitution modifier
	return nil
}

func (character *Character) setSpells(characterInfo *characterInfo) error {
	if characterInfo.Magic.Multiclassing { // if multiclassing use multiclass spell slots rules
		characterInfo.Magic.SpellSlots = getMulticlassSpellSlots(characterInfo.Magic.Level)
	} else { // use normal spell slots
		characterInfo.Magic.SpellSlots = characterInfo.Magic.ClassSpells[0].SpellSlots
	}
	var wg sync.WaitGroup

	for _, class := range characterInfo.Magic.ClassSpells {
		errCh := make(chan error, len(class.Cantrips)+len(class.Spells))

		for i := range class.Cantrips {
			wg.Add(1)
			go func(cantrip *source.Spell) {
				defer wg.Done()
				err := source.GetSpellDetail(cantrip)
				if err != nil {
					errCh <- err
				}
			}(&class.Cantrips[i])
		}

		for i := range class.Spells {
			wg.Add(1)
			go func(spell *source.Spell) {
				defer wg.Done()
				err := source.GetSpellDetail(spell)
				if err != nil {
					errCh <- err
				}
			}(&class.Spells[i])
		}

		go func() {
			wg.Wait()
			close(errCh)
		}()

		var errs []error
		for err := range errCh {
			if err != nil {
				errs = append(errs, err)
			}
		}

		if len(errs) > 0 {
			return fmt.Errorf("error getting spell details: %v", errs)
		}

	}

	character.Magic = characterInfo.Magic
	return nil
}

func (character *Character) setSpeed(characterInfo *characterInfo) error {
	character.Speed = 0
	for key, element := range characterInfo.Stats {
		if key == "innate speed" || key == "speed" || key == "innate speed:misc" {
			speed, err := strconv.Atoi(element)
			if err != nil {
				return fmt.Errorf("error converting speed to int: %w", err)
			}
			character.Speed += speed
		}
	}
	return nil
}

func (character *Character) setSkills(characterInfo *characterInfo) error {
	skillTable := map[string]Skill{
		"ID_PROFICIENCY_SKILL_ACROBATICS": {
			Name:       "Acrobatics",
			Mod:        0,
			Ability:    "dexterity",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_ANIMAL_HANDLING": {
			Name:       "Animal Handling ",
			Mod:        0,
			Ability:    "wisdom",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_ARCANA": {
			Name:       "Arcana",
			Mod:        0,
			Ability:    "intelligence",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_ATHLETICS": {
			Name:       "Athletics",
			Mod:        0,
			Ability:    "strength",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_DECEPTION": {
			Name:       "Deception",
			Mod:        0,
			Ability:    "charisma",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_HISTORY": {
			Name:       "History",
			Mod:        0,
			Ability:    "intelligence",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_INSIGHT": {
			Name:       "Insight",
			Mod:        0,
			Ability:    "wisdom",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_INTIMIDATION": {
			Name:       "Intimidation",
			Mod:        0,
			Ability:    "charisma",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_INVESTIGATION": {
			Name:       "Investigation",
			Mod:        0,
			Ability:    "intelligence",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_MEDICINE": {
			Name:       "Medicine",
			Mod:        0,
			Ability:    "wisdom",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_NATURE": {
			Name:       "Nature",
			Mod:        0,
			Ability:    "intelligence",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_PERCEPTION": {
			Name:       "Perception",
			Mod:        0,
			Ability:    "wisdom",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_PERFORMANCE": {
			Name:       "Performance",
			Mod:        0,
			Ability:    "charisma",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_PERSUASION": {
			Name:       "Persuasion",
			Mod:        0,
			Ability:    "charisma",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_RELIGION": {
			Name:       "Religion",
			Mod:        0,
			Ability:    "intelligence",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_SLEIGHT_OF_HAND": {
			Name:       "Sleight of Hand",
			Mod:        0,
			Ability:    "dexterity",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_STEALTH": {
			Name:       "Stealth",
			Mod:        0,
			Ability:    "dexterity",
			Proficient: false,
		},
		"ID_PROFICIENCY_SKILL_SURVIVAL": {
			Name:       "Survival",
			Mod:        0,
			Ability:    "wisdom",
			Proficient: false,
		},
	}

	for _, skill := range characterInfo.SkillProf { // Gets proficiency from proficiency list
		temp := Skill{}
		temp = skillTable[skill]
		temp.Proficient = true
		skillTable[skill] = temp // set skill to true
	}

	// Check for stealth disadvantage
	tempSkill := skillTable["ID_PROFICIENCY_SKILL_STEALTH"]
	tempSkill.Disadvantage = characterInfo.stealthDisadvantage
	skillTable["ID_PROFICIENCY_SKILL_STEALTH"] = tempSkill

	for _, value := range skillTable { // set skill modifiers, check for proficiency
		mod := character.AbilityScore[value.Ability].mod
		if value.Proficient {
			mod += characterInfo.ProfBonus // add proficiency bonus
		}
		tempSkill := value
		tempSkill.Mod = mod
		character.Skills = append(character.Skills, tempSkill)
	}
	return nil
}

func (character *Character) setSavingThrows(characterInfo *characterInfo) error {

	savingThrows := map[string]Skill{
		"ID_PROFICIENCY_SAVINGTHROW_STRENGTH": {
			Name:       "Strength",
			Mod:        0,
			Ability:    "strength",
			Proficient: false,
		},
		"ID_PROFICIENCY_SAVINGTHROW_DEXTERITY": {
			Name:       "Dexterity",
			Mod:        0,
			Ability:    "dexterity",
			Proficient: false,
		},
		"ID_PROFICIENCY_SAVINGTHROW_CONSTITUTION": {
			Name:       "Constitution",
			Mod:        0,
			Ability:    "constitution",
			Proficient: false,
		},
		"ID_PROFICIENCY_SAVINGTHROW_INTELLIGENCE": {
			Name:       "Intelligence",
			Mod:        0,
			Ability:    "intelligence",
			Proficient: false,
		},
		"ID_PROFICIENCY_SAVINGTHROW_WISDOM": {
			Name:       "Wisdom",
			Mod:        0,
			Ability:    "wisdom",
			Proficient: false,
		},
		"ID_PROFICIENCY_SAVINGTHROW_CHARISMA": {
			Name:       "Charisma",
			Mod:        0,
			Ability:    "charisma",
			Proficient: false,
		},
	}

	for _, ability := range characterInfo.SavingProf { // Gets proficiency from proficiency list
		temp := Skill{}
		temp = savingThrows[ability]
		temp.Proficient = true
		savingThrows[ability] = temp // set skill to true
	}

	for _, value := range savingThrows { // set skill modifiers, check for proficiency
		mod := character.AbilityScore[value.Ability].mod
		if value.Proficient {
			mod += characterInfo.ProfBonus // add proficiency bonus
		}
		temp := value
		temp.Mod = mod
		character.SavingThrows = append(character.SavingThrows, temp)
	}

	return nil
}

func (character *Character) setInitiative(characterInfo *characterInfo) error {
	dexMod := character.AbilityScore["dexterity"].mod
	character.Initiative = Skill{
		Name:      "Initiative",
		Mod:       dexMod,
		Advantage: false,
	}

	character.Initiative.Advantage = characterInfo.initAdv

	return nil
}

func (character *Character) setLanguages(characterInfo *characterInfo) error {
	for _, value := range characterInfo.Feats.Language {
		lang, err := source.GetLanguage(value.ID)
		if err != nil {
			return fmt.Errorf("error getting language: %w", err)
		}
		character.Languages = append(character.Languages, lang)
	}
	return nil
}

func (character *Character) setConditions(characterInfo *characterInfo) error {
	for _, value := range characterInfo.Feats.Grants {
		if (value.Type) == "Condition" {
			character.Conditions = append(character.Conditions, value.Name)
		} else if value.ID == "ID_INTERNAL_GRANTS_STEALTH_DISADVANTAGE" {
			characterInfo.stealthDisadvantage = true
		} else if value.ID == "ID_INTERNAL_GRANTS_INITIATIVE_ADVANTAGE" {
			characterInfo.initAdv = true
		}
	}
	return nil
}

func (character *Character) setAbilityScore(characterInfo *characterInfo) error {
	if character.AbilityScore == nil {
		character.AbilityScore = make(map[string]Ability)
	}

	for key := range characterInfo.AbilityTable {
		score, err := strconv.Atoi(characterInfo.Stats[key+":score"])
		if err != nil {
			return fmt.Errorf("error converting %s to int: %w", key, err)
		}
		mod, err := strconv.Atoi(characterInfo.Stats[key+":modifier"])
		if err != nil {
			return fmt.Errorf("error converting %s to int: %w", key, err)
		}
		temp := Ability{
			score: score,
			mod:   mod,
		}
		character.AbilityScore[key] = temp
	}
	return nil

}

func GetCharacterData(filePath string) (Character, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return Character{}, fmt.Errorf("error opening file: %w", err)
	}
	defer file.Close()

	xmlData, err := io.ReadAll(file)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return Character{}, fmt.Errorf("error reading file: %w", err)

	}

	var characterInfo characterInfo
	err = xml.Unmarshal(xmlData, &characterInfo) // unmarshal XML data into struct
	if err != nil {
		return Character{}, fmt.Errorf("error unmarshalling XML: %w", err)
	}

	// Filter Elements for only Level Elements
	var wg sync.WaitGroup
	levelCh := make(chan element, len(characterInfo.Elements))
	otherCh := make(chan element, len(characterInfo.Elements))
	for _, e := range characterInfo.Elements {
		wg.Add(1)
		go func(element element) {
			defer wg.Done()
			if element.Type == "Level" {
				levelCh <- element
			} else {
				otherCh <- element
			}
		}(e)
	}
	go func() {
		wg.Wait()
		close(levelCh)
		close(otherCh)
	}()

	for element := range levelCh {
		characterInfo.LevelElements = append(characterInfo.LevelElements, element)
	}
	for element := range otherCh {
		characterInfo.OtherElements = append(characterInfo.OtherElements, element)
	}

	var character Character

	//* Features, Proficiency, Proficiency Bonus
	err = character.setFeatsAndProfs(&characterInfo)
	if err != nil {
		return Character{}, fmt.Errorf("error getting feats and profs: %w", err)
	}
	//* Items
	err = character.setItems(&characterInfo)
	if err != nil {
		return Character{}, fmt.Errorf("error getting items: %w", err)
	}
	//* Magic
	err = character.setSpells(&characterInfo)
	if err != nil {
		return Character{}, fmt.Errorf("error getting spells: %w", err)
	}

	//* Ability Score
	err = character.setAbilityScore(&characterInfo)
	if err != nil {
		return Character{}, fmt.Errorf("error getting ability score: %w", err)
	}

	// * Skills, Saving Throws, Initiative
	err = character.setConditions(&characterInfo)
	if err != nil {
		return Character{}, fmt.Errorf("error getting conditions: %w", err)
	}

	errCh := make(chan error, 7)
	wg.Add(1)
	go func() {
		defer wg.Done()
		err = character.setSkills(&characterInfo)
		if err != nil {
			errCh <- fmt.Errorf("error getting skills: %w", err)
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		err = character.setSavingThrows(&characterInfo)
		if err != nil {
			errCh <- fmt.Errorf("error getting saving throws: %w", err)
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		err = character.setInitiative(&characterInfo)
		if err != nil {
			errCh <- fmt.Errorf("error getting initiative: %w", err)
		}
	}()

	//* Languages
	wg.Add(1)
	go func() {
		defer wg.Done()
		err = character.setLanguages(&characterInfo)
		if err != nil {
			errCh <- fmt.Errorf("error getting languages: %w", err)
		}
	}()

	//* HP, AC, Speed
	wg.Add(1)
	go func() {
		defer wg.Done()
		err = character.setHP(&characterInfo) // HP
		if err != nil {
			errCh <- fmt.Errorf("error getting HP: %w", err)
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		err = character.setAC(&characterInfo)
		if err != nil {
			errCh <- fmt.Errorf("error getting AC: %w", err)
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		err = character.setSpeed(&characterInfo)
		if err != nil {
			errCh <- fmt.Errorf("error getting AC: %w", err)
		}
	}()

	go func() {
		wg.Wait()
		close(errCh)
	}()
	for err := range errCh {
		if err != nil {
			return Character{}, err
		}
	}

	character.Name = characterInfo.Name
	character.Class = characterInfo.Class
	character.Race = characterInfo.Race
	character.Background = characterInfo.Background
	character.Attacks = characterInfo.Attacks
	character.ProfBonus = characterInfo.ProfBonus

	return character, nil
}
