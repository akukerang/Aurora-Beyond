import React from "react";
import { useLog } from "../hooks/logContext";

type Log = {
  msg: string;
  rolls: string;
};

interface RollDiceProps {
  text?: string;
  mod?: number;
  context?: string;
}

const RollDice: React.FC<RollDiceProps> = ({
  text = "",
  mod = 0,
  context = "Dice Roll",
}) => {
  const { addLog } = useLog();

  function parseDiceText(diceText: string) {
    const match = diceText.match(/(\d*)d(\d+)([+-]\d+)?/);
    if (match) {
      const count = match[1] ? parseInt(match[1], 10) : 1;
      const sides = parseInt(match[2], 10);
      const modifier = match[3] ? parseInt(match[3], 10) : 0;
      return { count, sides, modifier };
    }
    return { count: 1, sides: 20, modifier: mod };
  }

  function rollDice(count: number, sides: number, mod: number) {
    const rolls = Array.from(
      { length: count },
      () => Math.floor(Math.random() * sides) + 1
    );
    const total = rolls.reduce((sum, roll) => sum + roll, 0) + mod;
    return { rolls, total };
  }

  const handleClick = () => {
    const { count, sides, modifier } = parseDiceText(text);
    const { rolls, total } = rollDice(count, sides, modifier);
    // alert(`${context}: You rolled ${total} (${rolls.join(" + ")} ${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ""})`);
    addLog({
      msg: `${context}: You rolled ${total}`,
      rolls: `${rolls.join(" + ")} ${
        modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ""
      }`,
    });
  };

  return (
    <div
      className="bg-white text-black rounded-md hover:bg-gray-300 cursor-pointer text-center p-2"
      onClick={handleClick}
    >
      {text || (mod >= 0 ? `+${mod}` : mod)}
    </div>
  );
};

export default RollDice;
