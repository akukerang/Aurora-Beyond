export namespace character {
	
	export class AttackDetail {
	    Name: string;
	    Range: string;
	    Hit: number;
	    Damage: source.Dice;
	
	    static createFrom(source: any = {}) {
	        return new AttackDetail(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Range = source["Range"];
	        this.Hit = source["Hit"];
	        this.Damage = this.convertValues(source["Damage"], source.Dice);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Money {
	    Copper: number;
	    Silver: number;
	    Electrum: number;
	    Gold: number;
	    Platinum: number;
	
	    static createFrom(source: any = {}) {
	        return new Money(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Copper = source["Copper"];
	        this.Silver = source["Silver"];
	        this.Electrum = source["Electrum"];
	        this.Gold = source["Gold"];
	        this.Platinum = source["Platinum"];
	    }
	}
	export class spells {
	    ClassName: string;
	    SpellSlots: number[];
	    Ability: string;
	    Attack: number;
	    SaveDC: number;
	    Spells: source.Spell[];
	    Cantrips: source.Spell[];
	
	    static createFrom(source: any = {}) {
	        return new spells(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ClassName = source["ClassName"];
	        this.SpellSlots = source["SpellSlots"];
	        this.Ability = source["Ability"];
	        this.Attack = source["Attack"];
	        this.SaveDC = source["SaveDC"];
	        this.Spells = this.convertValues(source["Spells"], source.Spell);
	        this.Cantrips = this.convertValues(source["Cantrips"], source.Spell);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Magic {
	    Multiclassing: boolean;
	    SpellSlots: number[];
	    Level: number;
	    ClassSpells: spells[];
	
	    static createFrom(source: any = {}) {
	        return new Magic(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Multiclassing = source["Multiclassing"];
	        this.SpellSlots = source["SpellSlots"];
	        this.Level = source["Level"];
	        this.ClassSpells = this.convertValues(source["ClassSpells"], spells);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Skill {
	    Name: string;
	    Mod: number;
	    Ability: string;
	    Proficient: boolean;
	    Advantage: boolean;
	    Disadvantage: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Skill(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Mod = source["Mod"];
	        this.Ability = source["Ability"];
	        this.Proficient = source["Proficient"];
	        this.Advantage = source["Advantage"];
	        this.Disadvantage = source["Disadvantage"];
	    }
	}
	export class Character {
	    Portrait: string;
	    Level: number;
	    Multiclassing: boolean;
	    AttackNum: number;
	    AbilityScore: Record<string, source.Ability>;
	    Name: string;
	    Class: string;
	    Race: string;
	    Background: string;
	    Languages: string[];
	    Conditions: string[];
	    ArmorProf: string[];
	    WeaponProf: string[];
	    ToolProf: string[];
	    HP: number;
	    AC: number;
	    Speed: number;
	    ProfBonus: number;
	    Skills: Record<string, Skill>;
	    SavingThrows: Record<string, Skill>;
	    Initiative: Skill;
	    Magic: Magic;
	    Attacks: AttackDetail[];
	    Inventory: source.ItemDetail[];
	    FeatsFinal: source.Detail[];
	    PassiveSkills: Record<string, number>;
	    Money: Money;
	
	    static createFrom(source: any = {}) {
	        return new Character(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Portrait = source["Portrait"];
	        this.Level = source["Level"];
	        this.Multiclassing = source["Multiclassing"];
	        this.AttackNum = source["AttackNum"];
	        this.AbilityScore = this.convertValues(source["AbilityScore"], source.Ability, true);
	        this.Name = source["Name"];
	        this.Class = source["Class"];
	        this.Race = source["Race"];
	        this.Background = source["Background"];
	        this.Languages = source["Languages"];
	        this.Conditions = source["Conditions"];
	        this.ArmorProf = source["ArmorProf"];
	        this.WeaponProf = source["WeaponProf"];
	        this.ToolProf = source["ToolProf"];
	        this.HP = source["HP"];
	        this.AC = source["AC"];
	        this.Speed = source["Speed"];
	        this.ProfBonus = source["ProfBonus"];
	        this.Skills = this.convertValues(source["Skills"], Skill, true);
	        this.SavingThrows = this.convertValues(source["SavingThrows"], Skill, true);
	        this.Initiative = this.convertValues(source["Initiative"], Skill);
	        this.Magic = this.convertValues(source["Magic"], Magic);
	        this.Attacks = this.convertValues(source["Attacks"], AttackDetail);
	        this.Inventory = this.convertValues(source["Inventory"], source.ItemDetail);
	        this.FeatsFinal = this.convertValues(source["FeatsFinal"], source.Detail);
	        this.PassiveSkills = source["PassiveSkills"];
	        this.Money = this.convertValues(source["Money"], Money);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	

}

export namespace source {
	
	export class Ability {
	    Score: number;
	    Mod: number;
	
	    static createFrom(source: any = {}) {
	        return new Ability(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Score = source["Score"];
	        this.Mod = source["Mod"];
	    }
	}
	export class Detail {
	    Name: string;
	    Description: string;
	    Usage: string;
	
	    static createFrom(source: any = {}) {
	        return new Detail(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Description = source["Description"];
	        this.Usage = source["Usage"];
	    }
	}
	export class Dice {
	    Rolls: Record<number, number>;
	    Text: string;
	
	    static createFrom(source: any = {}) {
	        return new Dice(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Rolls = source["Rolls"];
	        this.Text = source["Text"];
	    }
	}
	export class ItemDetail {
	    Name: string;
	    Description: string;
	    Rarity: string;
	    Category: string;
	    Amount: number;
	    Equipped: boolean;
	    Damage?: string;
	    DMGType?: string;
	    Range?: string;
	    Stealth?: boolean;
	    AC?: string;
	    ArmorType?: string;
	
	    static createFrom(source: any = {}) {
	        return new ItemDetail(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Description = source["Description"];
	        this.Rarity = source["Rarity"];
	        this.Category = source["Category"];
	        this.Amount = source["Amount"];
	        this.Equipped = source["Equipped"];
	        this.Damage = source["Damage"];
	        this.DMGType = source["DMGType"];
	        this.Range = source["Range"];
	        this.Stealth = source["Stealth"];
	        this.AC = source["AC"];
	        this.ArmorType = source["ArmorType"];
	    }
	}
	export class Spell {
	    ID: string;
	    Level: number;
	    Prepared: boolean;
	    Known: boolean;
	    Hit: number;
	    Effect: Dice;
	    SaveDC: string;
	    Name: string;
	    Description: string;
	    Time: string;
	    Range: string;
	    Duration: string;
	    Ritual: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Spell(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Level = source["Level"];
	        this.Prepared = source["Prepared"];
	        this.Known = source["Known"];
	        this.Hit = source["Hit"];
	        this.Effect = this.convertValues(source["Effect"], Dice);
	        this.SaveDC = source["SaveDC"];
	        this.Name = source["Name"];
	        this.Description = source["Description"];
	        this.Time = source["Time"];
	        this.Range = source["Range"];
	        this.Duration = source["Duration"];
	        this.Ritual = source["Ritual"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

