import DiceIcon from "./DiceIcon";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
const DiceMenu = () => {
  return (
    <>
      <DiceIcon type="d20" />
      <DiceIcon type="d12" />
      <DiceIcon type="d10" />
      <DiceIcon type="d100" />
      <DiceIcon type="d8" />
      <DiceIcon type="d6" />
      <DiceIcon type="d4" />
    </>
  );
};

const DiceRoller = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rolls, setRolls] = useState<number[]>([]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setRolls([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    // setRolls([]);
  };

  return (
    <div className="fixed bottom-4 left-4 flex flex-col gap-2 items-center">
      {isOpen ? <DiceMenu /> : null}
      <div className="relative flex flex-col items-center">
        <div
          className="bg-gray-700 hover:bg-gray-600 w-14 h-14 flex items-center justify-center 
            cursor-pointer z-50 shadow-xl rounded-full text-white"
          onClick={toggleMenu}
        >
          {isOpen ? (
            <CloseIcon fontSize="large" />
          ) : (
            <DiceIcon type="d20" className="bg-red-700 hover:bg-red-500" />
          )}
        </div>

        {isOpen ? (
          rolls.length > 0 ? (
            <div
              className="absolute left-0 bottom-0 h-[3.75rem] w-36 bg-red-500
        cursor-pointer shadow-xl rounded-full flex 
        items-center justify-center pl-12 translate-x-[-.125rem] translate-y-[.125rem] text-xl
        font-bold
        "
            >
              ROLL
            </div>
          ) : (
            <div
              className="absolute left-0 bottom-0 h-[3.75rem] w-[3.75rem] bg-red-500
        cursor-pointer shadow-xl rounded-full flex 
        items-center justify-center pl-12 translate-x-[-.125rem] translate-y-[.125rem] text-2xl"
            ></div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default DiceRoller;
