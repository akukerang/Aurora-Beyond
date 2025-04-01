import { FC } from "react";
import { character } from "../../../wailsjs/go/models"; // Adjust the import path as necessary
import HoverInfo from "../HoverInfo";
import RollDice from "../DiceRoller/RollDice";
import RollMod from "../RollMod";
type Props = {
  profBonus: number;
  initiative: character.Skill;
  ac: number;
  speed: number;
};
const Stats: FC<Props> = ({ profBonus, initiative, ac, speed }) => {
  const bonus = `+${profBonus}`;
  return (
    <>
      <h1 className="text-lg mb-2">Stats</h1>

      <div className="flex flex-row gap-2 text-center">
        <div className="flex flex-col items-center justify-center bg-gray-600 rounded-md text-center p-4 h-24 w-full">
          <h1 className="text-xl mb-4">AC</h1>
          <HoverInfo info={ac.toString()} />
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-600 rounded-md text-center p-4 h-24 w-full">
          <div
            className={`flex flex-row items-center ${
              initiative.Advantage ? "mb-1.5" : "mb-4"
            }`}
          >
            <h1 className="text-xl">Init</h1>
            {initiative.Advantage ? (
              <RollMod advantage={initiative.Advantage} />
            ) : null}
          </div>

          <RollDice
            mod={initiative.Mod}
            context="Initiative"
            type="Roll"
            advantage={initiative.Advantage}
          />
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-600 rounded-md text-center p-4 h-24 w-full">
          <h1 className="text-xl mb-4">Prof</h1>
          <HoverInfo info={bonus} />
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-600 rounded-md text-center p-4 h-24 w-full">
          <h1 className="text-xl mb-4">Speed</h1>
          <HoverInfo info={speed + " ft"} />
        </div>
      </div>
    </>
  );
};
export default Stats;
