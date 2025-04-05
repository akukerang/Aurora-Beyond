import { FC } from "react";
import { source } from "../../../wailsjs/go/models"; // Adjust the import path as necessary
import AbilityScoreBox from "./AbilityScoreBox";

type Props = {
  abilityScore: Record<string, source.Ability>;
};

const AbilityScores: FC<Props> = ({ abilityScore }) => {
  return (
    <>
      <h1 className="text-lg mb-2">Ability Scores</h1>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 w-full bg-gray-800">
        <AbilityScoreBox name="STR" score={abilityScore["strength"].Score} />
        <AbilityScoreBox name="DEX" score={abilityScore["dexterity"].Score} />
        <AbilityScoreBox
          name="CON"
          score={abilityScore["constitution"].Score}
        />
        <AbilityScoreBox
          name="INT"
          score={abilityScore["intelligence"].Score}
        />
        <AbilityScoreBox name="WIS" score={abilityScore["wisdom"].Score} />
        <AbilityScoreBox name="CHA" score={abilityScore["charisma"].Score} />
      </div>
    </>
  );
};

export default AbilityScores;
