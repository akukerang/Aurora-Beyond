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
          context="Acrobatics Check"
        />
        <SkillItem
          name="Animal Handling"
          mod={skillProf["Animal Handling"].Mod}
          prof={skillProf["Animal Handling"].Proficient}
          context="Animal Handling Check"
        />
        <SkillItem
          name="Arcana"
          mod={skillProf["Arcana"].Mod}
          prof={skillProf["Arcana"].Proficient}
          context="Arcana Check"
        />
        <SkillItem
          name="Athletics"
          mod={skillProf["Athletics"].Mod}
          prof={skillProf["Athletics"].Proficient}
          context="Athletics Check"
        />
        <SkillItem
          name="Deception"
          mod={skillProf["Deception"].Mod}
          prof={skillProf["Deception"].Proficient}
          context="Deception Check"
        />
        <SkillItem
          name="History"
          mod={skillProf["History"].Mod}
          prof={skillProf["History"].Proficient}
          context="History Check"
        />
        <SkillItem
          name="Insight"
          mod={skillProf["Insight"].Mod}
          prof={skillProf["Insight"].Proficient}
          context="Insight Check"
        />
        <SkillItem
          name="Intimidation"
          mod={skillProf["Intimidation"].Mod}
          prof={skillProf["Intimidation"].Proficient}
          context="Intimidation Check"
        />
        <SkillItem
          name="Investigation"
          mod={skillProf["Investigation"].Mod}
          prof={skillProf["Investigation"].Proficient}
          context="Investigation Check"
        />
        <SkillItem
          name="Medicine"
          mod={skillProf["Medicine"].Mod}
          prof={skillProf["Medicine"].Proficient}
          context="Medicine Check"
        />
        <SkillItem
          name="Nature"
          mod={skillProf["Nature"].Mod}
          prof={skillProf["Nature"].Proficient}
          context="Nature Check"
        />
        <SkillItem
          name="Perception"
          mod={skillProf["Perception"].Mod}
          prof={skillProf["Perception"].Proficient}
          context="Perception Check"
        />
        <SkillItem
          name="Performance"
          mod={skillProf["Performance"].Mod}
          prof={skillProf["Performance"].Proficient}
          context="Performance Check"
        />
        <SkillItem
          name="Persuasion"
          mod={skillProf["Persuasion"].Mod}
          prof={skillProf["Persuasion"].Proficient}
          context="Persuasion Check"
        />
        <SkillItem
          name="Religion"
          mod={skillProf["Religion"].Mod}
          prof={skillProf["Religion"].Proficient}
          context="Religion Check"
        />
        <SkillItem
          name="Sleight of Hand"
          mod={skillProf["Sleight of Hand"].Mod}
          prof={skillProf["Sleight of Hand"].Proficient}
          context="Sleight of Hand Check"
        />
        <SkillItem
          name="Stealth"
          mod={skillProf["Stealth"].Mod}
          prof={skillProf["Stealth"].Proficient}
          context="Stealth Check"
        />
        <SkillItem
          name="Survival"
          mod={skillProf["Survival"].Mod}
          prof={skillProf["Survival"].Proficient}
          context="Survival Check"
        />
      </div>
    </div>
  );
};
export default Skills;
