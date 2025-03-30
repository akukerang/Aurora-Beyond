import { FC } from "react";
import "./Dice.css";
import DiceCounter from "./DiceCounter";

type Props = {
  type: string;
  className?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  value?: number;
};
const DiceIcon: FC<Props> = ({
  type,
  className = "bg-gray-500 hover:bg-gray-600 text-white",
  onLeftClick,
  onRightClick,
  value = 0,
}) => {
  return (
    <div
      className={`relative w-14 h-14 flex items-center justify-center cursor-pointer z-50 shadow-xl rounded-full ${className}`}
      onClick={onLeftClick}
      onContextMenu={(event) => {
        event.preventDefault(); // prevent context menu from
        if (onRightClick) onRightClick();
      }}
    >
      <div className={`dice-icon-die--${type} dice-icon-die`}></div>
      {value > 0 ? <DiceCounter value={value} /> : null}
    </div>
  );
};
export default DiceIcon;
