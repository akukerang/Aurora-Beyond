import AttackItem from "./AttackItem";
import { useCharacter } from "../../hooks/CharacterContext";
const AttackList = () => {
  const { character } = useCharacter();
  const attacks = character?.Attacks;
  return (
    <div className="flex flex-col justify-between px-4">
      <h1>Attacks per Action: {character?.AttackNum}</h1>
      <div className="flex flex-row mb-1">
        <h2 className="w-[25%] text-lg font-bold">Name</h2>
        <h2 className="w-[12.5%] text-lg font-bold">Range</h2>
        <h2 className="w-[12.5%] text-lg font-bold">Hit/DC</h2>
        <h2 className="w-[50%] text-lg font-bold">Damage</h2>
      </div>
      {attacks
        ? attacks.map((attack: any) => (
            <AttackItem
              key={attack.Name}
              name={attack.Name}
              range={attack.Range}
              hitDC={attack.Hit}
              damage={attack.Damage}
            />
          ))
        : "No Attacks Found"}
    </div>
  );
};
export default AttackList;
