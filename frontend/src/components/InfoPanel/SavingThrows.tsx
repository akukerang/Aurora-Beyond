import { FC } from "react";
import SkillItem from "./SkillItem";
import { character } from "../../../wailsjs/go/models"; // Adjust the import path as necessary

type Props = {
  savingProf: Record<string, character.Skill>;
};

const SavingThrows: FC<Props> = ({ savingProf }) => {
  return (
    <div>
      <h1 className="text-xl border-b border-white pb-1 mb-3">Saving Throws</h1>
      <div className="flex flex-col">
        <SkillItem
          name="Strength"
          mod={savingProf["Strength"].Mod}
          prof={savingProf["Strength"].Proficient}
          context="Strength Saving Throw"
        />
        <SkillItem
          name="Dexterity"
          mod={savingProf["Dexterity"].Mod}
          prof={savingProf["Dexterity"].Proficient}
          context="Dexterity Saving Throw"
        />
        <SkillItem
          name="Constitution"
          mod={savingProf["Constitution"].Mod}
          prof={savingProf["Constitution"].Proficient}
          context="Constitution Saving Throw"
        />
        <SkillItem
          name="Intelligence"
          mod={savingProf["Intelligence"].Mod}
          prof={savingProf["Intelligence"].Proficient}
          context="Intelligence Saving Throw"
        />
        <SkillItem
          name="Wisdom"
          mod={savingProf["Wisdom"].Mod}
          prof={savingProf["Wisdom"].Proficient}
          context="Wisdom Saving Throw"
        />
        <SkillItem
          name="Charisma"
          mod={savingProf["Charisma"].Mod}
          prof={savingProf["Charisma"].Proficient}
          context="Charisma Saving Throw"
        />
      </div>
    </div>
  );
};

export default SavingThrows;
