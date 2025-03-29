import { FC } from "react";
import "./Dice.css";

type Props = {
  type: string;
};
const DiceIcon: FC<Props> = ({ type }) => {
  return (
    <div className=" bg-red-700 text-white p-3 hover:bg-red-400 cursor-pointer z-50 shadow-xl rounded-full">
      <div className={`dice-icon-die--${type} dice-icon-die`}></div>
    </div>
  );
};
export default DiceIcon;
