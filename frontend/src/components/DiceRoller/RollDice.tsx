import React from "react";
import { useLog } from "../../hooks/logContext";
import { rollDice } from "./RollFunc";
import { source } from "../../../wailsjs/go/models"; // Adjust the import path as necessary

interface RollDiceProps {
  dice?: source.Dice;
  mod?: number; // modifier
  context: string;
  type: string;
  advantage?: boolean;
  disadvantage?: boolean;
}

const RollDice: React.FC<RollDiceProps> = ({
  dice,
  mod = 0,
  context = "Dice",
  type = "Roll",
  advantage = false,
  disadvantage = false,
}) => {
  const { addLog } = useLog();

  const handleClick = () => {
    if (dice != null) {
      const { results, total } = rollDice(dice.Rolls, advantage, disadvantage);
      addLog({
        context: context,
        type: type,
        total: total,
        rollNotation: dice.Text,
        rolls: results,
      });
    } else {
      const { results, total } = rollDice(
        { 20: 1, 0: mod },
        advantage,
        disadvantage
      ); // Handle the case where only a modifier is present
      addLog({
        context: context,
        type: type,
        total: total,
        rollNotation: `1d20${mod > 0 ? `+${mod}` : mod < 0 ? `${mod}` : ""}`, // Display modifier in notation
        rolls: results,
      });
    }
  };

  return (
    <div
      className="bg-white text-black rounded-md hover:bg-gray-300 cursor-pointer text-center p-2 min-h-[40px] min-w-[40px]"
      onClick={handleClick}
    >
      {dice?.Text || (mod >= 0 ? `+${mod}` : mod)}
    </div>
  );
};

export default RollDice;
