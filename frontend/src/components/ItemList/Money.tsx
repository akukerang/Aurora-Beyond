import { FC } from "react";
import { character } from "../../../wailsjs/go/models"; // Adjust the import path as necessary

type Props = {
  money: character.Money;
};

const MoneyItem = ({ amount, type }: { amount: number; type: string }) => {
  return amount > 0 ? (
    <div className="text-base font-semibold">
      <span>
        {type}
        {": "}
      </span>
      <span className="text-yellow-500">{amount}</span>
    </div>
  ) : null;
};

const Money: FC<Props> = ({ money }) => {
  return (
    <div className="flex flex-row gap-2 mb-2">
      {money.Copper > 0 ? (
        <MoneyItem amount={money.Copper} type="Copper" />
      ) : null}
      {money.Silver > 0 ? (
        <MoneyItem amount={money.Silver} type="Silver" />
      ) : null}
      {money.Electrum > 0 ? (
        <MoneyItem amount={money.Electrum} type="Electrum" />
      ) : null}
      {money.Gold > 0 ? <MoneyItem amount={money.Gold} type="Gold" /> : null}
      {money.Platinum > 0 ? (
        <MoneyItem amount={money.Platinum} type="Platinum" />
      ) : null}
    </div>
  );
};
export default Money;
