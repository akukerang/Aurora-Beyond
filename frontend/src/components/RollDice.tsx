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
    const diceGroups = diceText.split(/(?=[+-])/); // Split at + or -

    if (!diceGroups || diceText === "")
      return {
        rolls: [
          { count: 1, sides: 20, modifier: 0 },
          { count: 0, sides: 0, modifier: mod },
        ], // Default to 1d20 if no valid dice notation is found
        notation: `1d20${mod > 0 ? `+${mod}` : `${mod}`}`,
      };

    let notation = "";
    const rolls: { count: number; sides: number; modifier: number }[] = [];
    diceGroups.forEach((group) => {
      const diceMatch = group.match(/(\d*)d(\d+)/);

      // Dice Group Case (e.g., 2d20, 5d8)
      if (diceMatch) {
        const count = diceMatch[1] ? parseInt(diceMatch[1], 10) : 1;
        const sides = parseInt(diceMatch[2], 10);
        notation += group;
        rolls.push({ count, sides, modifier: 0 });
      } else {
        const modifierMatch = group.match(/[+-]\d+/);
        if (modifierMatch) {
          notation += modifierMatch[0];
          rolls.push({
            count: 0,
            sides: 0,
            modifier: parseInt(modifierMatch[0], 10),
          });
        }
      }

      // Modifier Case (e.g., +4, -3)
    });

    return { rolls, notation };
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

  const handleClick = () => {
    const { rolls: parsedDice, notation: diceNotation } = parseDiceText(text);
    console.log(parsedDice);
    const { rolls, total } = rollDice(parsedDice);
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
