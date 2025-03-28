import { FC } from "react";
import SkillItem from "./SkillItem";
import { character } from "../../../wailsjs/go/models"; // Adjust the import path as necessary

type Props = {
  skillProf: Record<string, character.Skill>;
};
const Skills: FC<Props> = ({ skillProf }) => {
  return (
    <div className="w-1/2 py-4 px-6">
      <h1 className="text-xl border-b border-white pb-1 mb-3">Skills</h1>
      <div className="flex flex-col">
        <SkillItem
          name="Acrobatics"
          mod={skillProf["Acrobatics"].Mod}
          prof={skillProf["Acrobatics"].Proficient}
          context="Acrobatics"
          type="Check"
        />
        <SkillItem
          name="Animal Handling"
          mod={skillProf["Animal Handling"].Mod}
          prof={skillProf["Animal Handling"].Proficient}
          context="Animal Handling"
          type="Check"
        />
        <SkillItem
          name="Arcana"
          mod={skillProf["Arcana"].Mod}
          prof={skillProf["Arcana"].Proficient}
          context="Arcana"
          type="Check"
        />
        <SkillItem
          name="Athletics"
          mod={skillProf["Athletics"].Mod}
          prof={skillProf["Athletics"].Proficient}
          context="Athletics"
          type="Check"
        />
        <SkillItem
          name="Deception"
          mod={skillProf["Deception"].Mod}
          prof={skillProf["Deception"].Proficient}
          context="Deception"
          type="Check"
        />
        <SkillItem
          name="History"
          mod={skillProf["History"].Mod}
          prof={skillProf["History"].Proficient}
          context="History"
          type="Check"
        />
        <SkillItem
          name="Insight"
          mod={skillProf["Insight"].Mod}
          prof={skillProf["Insight"].Proficient}
          context="Insight"
          type="Check"
        />
        <SkillItem
          name="Intimidation"
          mod={skillProf["Intimidation"].Mod}
          prof={skillProf["Intimidation"].Proficient}
          context="Intimidation"
          type="Check"
        />
        <SkillItem
          name="Investigation"
          mod={skillProf["Investigation"].Mod}
          prof={skillProf["Investigation"].Proficient}
          context="Investigation"
          type="Check"
        />
        <SkillItem
          name="Medicine"
          mod={skillProf["Medicine"].Mod}
          prof={skillProf["Medicine"].Proficient}
          context="Medicine"
          type="Check"
        />
        <SkillItem
          name="Nature"
          mod={skillProf["Nature"].Mod}
          prof={skillProf["Nature"].Proficient}
          context="Nature"
          type="Check"
        />
        <SkillItem
          name="Perception"
          mod={skillProf["Perception"].Mod}
          prof={skillProf["Perception"].Proficient}
          context="Perception"
          type="Check"
        />
        <SkillItem
          name="Performance"
          mod={skillProf["Performance"].Mod}
          prof={skillProf["Performance"].Proficient}
          context="Performance"
          type="Check"
        />
        <SkillItem
          name="Persuasion"
          mod={skillProf["Persuasion"].Mod}
          prof={skillProf["Persuasion"].Proficient}
          context="Persuasion"
          type="Check"
        />
        <SkillItem
          name="Religion"
          mod={skillProf["Religion"].Mod}
          prof={skillProf["Religion"].Proficient}
          context="Religion"
          type="Check"
        />
        <SkillItem
          name="Sleight of Hand"
          mod={skillProf["Sleight of Hand"].Mod}
          prof={skillProf["Sleight of Hand"].Proficient}
          context="Sleight of Hand"
          type="Check"
        />
        <SkillItem
          name="Stealth"
          mod={skillProf["Stealth"].Mod}
          prof={skillProf["Stealth"].Proficient}
          context="Stealth"
          type="Check"
          disadvantage={skillProf["Stealth"].Disadvantage}
        />
        <SkillItem
          name="Survival"
          mod={skillProf["Survival"].Mod}
          prof={skillProf["Survival"].Proficient}
          context="Survival"
          type="Check"
        />
      </div>
    </div>
  );
};
export default Skills;
