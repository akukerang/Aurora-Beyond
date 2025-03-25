import { FC } from "react";
import RollDice from "../RollDice";
type Props = {
  name: string;
  range: string;
  hitDC: number;
  damage: string;
};
const AttackItem: FC<Props> = ({ name, range, hitDC, damage }) => {
  const attackContext = `${name} Attack`;
  const damageContext = `${name} Damage`;
  return (
    <div className="flex flex-row rounded-md mb-2">
      <h2 className="w-[25%]">{name}</h2>
      <h2 className="w-[12.5%]">{range}</h2>
      <div className="w-[12.5%]">
        <div className="w-[50%]">
          <RollDice mod={hitDC} context={attackContext} />
        </div>
      </div>
      <div className="w-[50%]">
        <div className="w-[75%]">
          <RollDice text={damage} context={damageContext} />
        </div>
      </div>
    </div>
  );
};
export default AttackItem;
