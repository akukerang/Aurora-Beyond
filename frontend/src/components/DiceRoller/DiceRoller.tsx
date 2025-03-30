import DiceIcon from "./DiceIcon";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
const DiceMenu = ({
  rolls,
  setRolls,
}: {
  rolls: number[];
  setRolls: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const addIndex = (index: number) => {
    setRolls((prevRolls) => {
      const newRolls = [...prevRolls];
      newRolls[index] += 1;
      return newRolls;
    });
  };

  const removeIndex = (index: number) => {
    setRolls((prevRolls) => {
      const newRolls = [...prevRolls];
      if (newRolls[index] > 0) {
        newRolls[index] -= 1;
      }
      return newRolls;
    });
  };

  const addDice = (type: string) => {
    switch (type) {
      case "d4":
        addIndex(0);
        break;
      case "d6":
        addIndex(1);
        break;
      case "d8":
        addIndex(2);
        break;
      case "d10":
        addIndex(3);
        break;
      case "d12":
        addIndex(4);
        break;
      case "d20":
        addIndex(5);
        break;
      case "d100":
        addIndex(6);
        break;
      default:
        break;
    }
  };

  const removeDice = (type: string) => {
    switch (type) {
      case "d4":
        removeIndex(0);
        break;
      case "d6":
        removeIndex(1);
        break;
      case "d8":
        removeIndex(2);
        break;
      case "d10":
        removeIndex(3);
        break;
      case "d12":
        removeIndex(4);
        break;
      case "d20":
        removeIndex(5);
        break;
      case "d100":
        removeIndex(6);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <DiceIcon
        type="d20"
        onLeftClick={() => addDice("d20")}
        onRightClick={() => removeDice("d20")}
        value={rolls[5]}
      />
      <DiceIcon
        type="d12"
        onLeftClick={() => addDice("d12")}
        onRightClick={() => removeDice("d12")}
        value={rolls[4]}
      />
      <DiceIcon
        type="d10"
        onLeftClick={() => addDice("d10")}
        onRightClick={() => removeDice("d10")}
        value={rolls[3]}
      />
      <DiceIcon
        type="d100"
        onLeftClick={() => addDice("d100")}
        onRightClick={() => removeDice("d100")}
        value={rolls[6]}
      />
      <DiceIcon
        type="d8"
        onLeftClick={() => addDice("d8")}
        onRightClick={() => removeDice("d8")}
        value={rolls[2]}
      />
      <DiceIcon
        type="d6"
        onLeftClick={() => addDice("d6")}
        onRightClick={() => removeDice("d6")}
        value={rolls[1]}
      />
      <DiceIcon
        type="d4"
        onLeftClick={() => addDice("d4")}
        onRightClick={() => removeDice("d4")}
        value={rolls[0]}
      />
    </>
  );
};

const DiceRoller = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rolls, setRolls] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  // index == type of roll, d4 - d100

  const toggleMenu = () => {
    if (isOpen) {
      setRolls([0, 0, 0, 0, 0, 0, 0]); //reset rolls
    }
    setIsOpen(!isOpen);
  };
  const hasRolls = Object.values(rolls).some((roll) => roll > 0);
  return (
    <div className="fixed bottom-4 left-4 flex flex-col gap-2 items-center">
      {isOpen ? <DiceMenu rolls={rolls} setRolls={setRolls} /> : null}
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
          hasRolls ? (
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
