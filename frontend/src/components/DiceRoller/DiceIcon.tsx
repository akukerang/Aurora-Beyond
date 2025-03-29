import { FC } from "react";
import "./Dice.css";

type Props = {
  type: string;
  className?: string;
};
const DiceIcon: FC<Props> = ({
  type,
  className = "bg-gray-500 hover:bg-gray-400 text-white",
}) => {
  return (
    <div
      className={`w-14 h-14 flex items-center justify-center cursor-pointer z-50 shadow-xl rounded-full ${className}`}
    >
      <div className={`dice-icon-die--${type} dice-icon-die`}></div>
    </div>
  );
};
export default DiceIcon;
