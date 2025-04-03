import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useLog } from "../../hooks/logContext";
import DiceIcon from "./DiceIcon";
import { parseDiceText, rollDice } from "./RollFunc";

const DiceMenu = ({
  rollsArray,
  setRollsArray,
}: {
  rollsArray: number[];
  setRollsArray: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const addIndex = (index: number) => {
    setRollsArray((prevRolls) => {
      const newRolls = [...prevRolls];
      newRolls[index] += 1;
      return newRolls;
    });
  };

  const removeIndex = (index: number) => {
    setRollsArray((prevRolls) => {
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
        addIndex(6);
        break;
      case "d6":
        addIndex(5);
        break;
      case "d8":
        addIndex(4);
        break;
      case "d10":
        addIndex(3);
        break;
      case "d12":
        addIndex(2);
        break;
      case "d20":
        addIndex(1);
        break;
      case "d100":
        addIndex(0);
        break;
      default:
        break;
    }
  };

  const removeDice = (type: string) => {
    switch (type) {
      case "d4":
        removeIndex(6);
        break;
      case "d6":
        removeIndex(5);
        break;
      case "d8":
        removeIndex(4);
        break;
      case "d10":
        removeIndex(3);
        break;
      case "d12":
        removeIndex(2);
        break;
      case "d20":
        removeIndex(1);
        break;
      case "d100":
        removeIndex(0);
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
        value={rollsArray[1]}
      />
      <DiceIcon
        type="d12"
        onLeftClick={() => addDice("d12")}
        onRightClick={() => removeDice("d12")}
        value={rollsArray[2]}
      />
      <DiceIcon
        type="d10"
        onLeftClick={() => addDice("d10")}
        onRightClick={() => removeDice("d10")}
        value={rollsArray[3]}
      />
      <DiceIcon
        type="d100"
        onLeftClick={() => addDice("d100")}
        onRightClick={() => removeDice("d100")}
        value={rollsArray[0]}
      />
      <DiceIcon
        type="d8"
        onLeftClick={() => addDice("d8")}
        onRightClick={() => removeDice("d8")}
        value={rollsArray[4]}
      />
      <DiceIcon
        type="d6"
        onLeftClick={() => addDice("d6")}
        onRightClick={() => removeDice("d6")}
        value={rollsArray[5]}
      />
      <DiceIcon
        type="d4"
        onLeftClick={() => addDice("d4")}
        onRightClick={() => removeDice("d4")}
        value={rollsArray[6]}
      />
    </>
  );
};

const DiceRoller = () => {
  const { addLog } = useLog();
  const [isOpen, setIsOpen] = useState(false);
  const [rollsArray, setRollsArray] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  // index == type of roll, d4 - d100
  const hasRolls = Object.values(rollsArray).some((roll) => roll > 0);

  const toggleMenu = () => {
    if (isOpen) {
      setRollsArray([0, 0, 0, 0, 0, 0, 0]); //reset rolls
    }
    setIsOpen(!isOpen);
  };

  const getDiceNotation = (diceRolls: number[]) => {
    let notation = "";
    for (let i = 0; i < diceRolls.length; i++) {
      if (diceRolls[i] > 0) {
        let type = "";
        switch (i) {
          case 6:
            type = `d4`;
            break;
          case 5:
            type = `d6`;
            break;
          case 4:
            type = `d8`;
            break;
          case 3:
            type = `d10`;
            break;
          case 2:
            type = `d12`;
            break;
          case 1:
            type = `d20`;
            break;
          case 0:
            type = `d100`;
            break;
          default:
            break;
        }
        if (notation.length > 0) {
          notation += "+";
        }
        notation += `${diceRolls[i]}${type}`;
      }
    }
    return notation;
  };
  const handleClick = () => {
    const diceNotation = getDiceNotation(rollsArray);
    const { rolls: parsedDice } = parseDiceText(diceNotation, 0);
    const { rolls, total } = rollDice(parsedDice, false, false);
    let rollsText = "";
    rolls.forEach((roll, index) => {
      if (index == 0) {
        rollsText += roll;
      } else {
        rollsText += `+${roll}`;
      }
    });
    addLog({
      context: "Custom",
      type: "Roll",
      total: total,
      rollNotation: diceNotation,
      rolls: rollsText,
    });
  };

  return (
    <div className="fixed bottom-4 left-4 flex flex-col gap-2 items-center z-50">
      {isOpen ? (
        <DiceMenu rollsArray={rollsArray} setRollsArray={setRollsArray} />
      ) : null}
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
              onClick={handleClick}
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
