import React from "react";
import { useLog } from "../../hooks/logContext";
import { parseDiceText, rollDice } from "./RollFunc";

interface RollDiceProps {
  text?: string; // dice notation (1d6+4)
  mod?: number; // modifier
  context: string;
  type: string;
  advantage?: boolean;
  disadvantage?: boolean;
}

const RollDice: React.FC<RollDiceProps> = ({
  text = "",
  mod = 0,
  context = "Dice",
  type = "Roll",
  advantage = false,
  disadvantage = false,
}) => {
  const { addLog } = useLog();

  const handleClick = () => {
    const { rolls: parsedDice, notation: diceNotation } = parseDiceText(
      text,
      mod
    );
    const { rolls, total } = rollDice(parsedDice, advantage, disadvantage);
    let rollsText = "";
    rolls.forEach((roll, index) => {
      if (index == 0 || index == rolls.length - 1) {
        rollsText += roll;
      } else {
        rollsText += `+${roll}`;
      }
    });
    addLog({
      context: context,
      type: type,
      total: total,
      rollNotation: diceNotation,
      rolls: rollsText,
    });
  };

  return (
    <div
      className="bg-white text-black rounded-md hover:bg-gray-300 cursor-pointer text-center p-2 min-h-[40px] min-w-[40px]"
      onClick={handleClick}
    >
      {text || (mod >= 0 ? `+${mod}` : mod)}
    </div>
  );
};

export default RollDice;
