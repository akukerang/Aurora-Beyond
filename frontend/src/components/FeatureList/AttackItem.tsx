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
    <div className="flex flex-row rounded-md">
      <h2 className="w-1/4">{name}</h2>
      <h2 className="w-1/8">{range}</h2>
      <div className="w-1/8">
        <div className="w-1/2 p-1">
          <RollDice mod={hitDC} context={attackContext} />
        </div>
      </div>
      <div className="w-1/4">
        <div className="p-1">
          <RollDice text={damage} context={damageContext} />
        </div>
      </div>
    </div>
  );
};
export default AttackItem;
