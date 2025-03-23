import React from "react";

interface RollDiceProps {
  text?: string;
  mod?: number;
  context?: string;
}

const RollDice: React.FC<RollDiceProps> = ({ text = "", mod = 0, context = "Dice Roll" }) => {

  return (
    <div
      className="bg-white text-black rounded-md hover:bg-gray-300 cursor-pointer text-center p-2"
    //   onClick={handleClick}
    >
      {text || (mod >= 0 ? `+${mod}` : mod)}
    </div>
  );
};

export default RollDice;
