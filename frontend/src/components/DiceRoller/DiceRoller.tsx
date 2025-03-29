import DiceIcon from "./DiceIcon";

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
  return (
    <div className="fixed bottom-4 left-4 flex flex-col gap-2">
      <DiceMenu />
      <DiceIcon type="d20" />
    </div>
  );
};
export default DiceRoller;
