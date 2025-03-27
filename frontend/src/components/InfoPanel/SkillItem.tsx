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
    <div className="flex flex-row w-full mb-2 justify-between items-center">
      <div className="flex flex-row gap-2 justify-start items-center">
        <input
          key={name}
          type="checkbox"
          className="form-checkbox accent-red-500 w-6 h-6"
          checked={prof}
          readOnly={true}
        />
        <h1>{name}</h1>
      </div>
      <div>
        <RollDice mod={mod} context={context} />
      </div>
    </div>
  );
};

export default SkillItem;
