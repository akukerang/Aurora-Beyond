import { FC } from "react";
import RollDice from "../RollDice";
type Props = {
  name: string;
  mod: number;
  prof: boolean;
  context: string;
};
const SkillItem: FC<Props> = ({ name, mod, prof, context }) => {
  return (
    <div className="flex flex-row w-full mb-2 items-center space-x-4">
      <input
        type="checkbox"
        className="form-checkbox accent-red-500 w-6 h-6"
        checked={prof}
      />
      <label className="flex-grow text-left">{name}</label>
      <div className="w-20">
        <RollDice mod={mod} context={context} />
      </div>
    </div>
  );
};

export default SkillItem;
