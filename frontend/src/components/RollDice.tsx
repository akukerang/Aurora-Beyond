import React from "react";
import { useLog } from "../hooks/logContext";

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

  function parseDiceText(diceText: string) {
    const diceGroups = diceText.match(/(\d*)d(\d+)|[+-]\d+/g);
    if (!diceGroups || diceText === "")
      return [
        { count: 1, sides: 20, modifier: 0 },
        { count: 0, sides: 0, modifier: mod },
      ]; // Default to 1d20 if no valid dice notation is found

    return diceGroups.map((group) => {
      const diceMatch = group.match(/(\d*)d(\d+)/);
      if (diceMatch) {
        const count = diceMatch[1] ? parseInt(diceMatch[1], 10) : 1;
        const sides = parseInt(diceMatch[2], 10);
        return { count, sides, modifier: 0 };
      }

      // Modifier handle
      const modifierMatch = group.match(/[+-]\d+/);
      if (modifierMatch) {
        return { count: 0, sides: 0, modifier: parseInt(modifierMatch[0], 10) };
      }

      return { count: 0, sides: 0, modifier: 0 };
    });
  }

  function rollDice(
    parsedDice: { count: number; sides: number; modifier: number }[]
  ) {
    let total = 0;
    const rolls: string[] = [];

    parsedDice.forEach(({ count, sides, modifier }) => {
      if (sides > 0) {
        const groupRolls = Array.from(
          { length: count },
          () => Math.floor(Math.random() * sides) + 1
        );
        rolls.push(...groupRolls.map((roll) => roll.toString()));
        total += groupRolls.reduce((sum, roll) => sum + roll, 0);
      }
      total += modifier;
      if (modifier !== 0) {
        rolls.push(modifier > 0 ? `+${modifier}` : `${modifier}`);
      }
    });

    return { rolls, total };
  }

  function getNotation(
    parsedDice: { count: number; sides: number; modifier: number }[]
  ) {
    let notation = "";
    parsedDice.forEach(({ count, sides, modifier }) => {
      if (count !== 0 && sides !== 0) {
        notation += `${count}d${sides}`;
      }
      if (modifier !== 0) {
        notation += modifier > 0 ? `+${modifier}` : `${modifier}`;
      }
    });
    return notation;
  }

  const handleClick = () => {
    const parsedDice = parseDiceText(text);
    console.log(parsedDice); // Log the parsed dice for debugging
    const { rolls, total } = rollDice(parsedDice);
    const diceNotation = getNotation(parsedDice);
    addLog({
      context: context,
      type: type,
      total: total,
      rollNotation: diceNotation,
      rolls: rolls.join(" "),
    });
    // addLog({
    //   context: context,
    //   type: type,
    //   total: total,
    //   rollNotation: text !== "" ? text : `1d20+${modifier}`,
    //   rolls: `${rolls.join(" + ")} ${
    //     modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ""
    //   }`,
    // });
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
