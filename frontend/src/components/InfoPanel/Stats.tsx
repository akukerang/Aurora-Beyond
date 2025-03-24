import { FC } from "react";
import HoverInfo from "../HoverInfo";
import RollDice from "../RollDice";
type Props = {
  profBonus: number;
  initiative: number;
};
const Stats: FC<Props> = ({ profBonus, initiative }) => {
  const bonus = `+${profBonus}`;
  return (
    <>
      <h1 className="text-lg mb-2">Stats</h1>

      <div className="flex flex-row gap-2 text-center">
        <div className="flex flex-col items-center justify-center bg-gray-600 rounded-md text-center p-4 h-24 w-full">
          <h1 className="text-xl mb-4">AC</h1>
          <HoverInfo info="420" />
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-600 rounded-md text-center p-4 h-24 w-full">
          <h1 className="text-xl mb-4">Init</h1>
          <RollDice mod={initiative} context={"Initiative Roll: "} />
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-600 rounded-md text-center p-4 h-24 w-full">
          <h1 className="text-xl mb-4">Prof</h1>
          <HoverInfo info={bonus} />
        </div>
      </div>
    </>
  );
};
export default Stats;
