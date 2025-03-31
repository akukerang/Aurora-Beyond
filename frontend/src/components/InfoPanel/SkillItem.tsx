import { FC } from "react";
import RollDice from "../DiceRoller/RollDice";
type Props = {
  name: string;
  type: string;
  mod: number;
  prof: boolean;
  context: string;
  advantage?: boolean;
  disadvantage?: boolean;
};
const SkillItem: FC<Props> = ({
  name,
  type,
  mod,
  prof,
  context,
  advantage = false,
  disadvantage = false,
}) => {
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
        <RollDice
          mod={mod}
          context={context}
          type={type}
          advantage={advantage}
          disadvantage={disadvantage}
        />
      </div>
    </div>
  );
};

export default SkillItem;
