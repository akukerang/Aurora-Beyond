import { useCharacter } from "../../hooks/CharacterContext";
import { useEffect, useState } from "react";

const MagicStats = () => {
  const { character } = useCharacter();
  const classMagic = character?.Magic.ClassSpells;

  const [saveDC, setSaveDC] = useState<string>("");
  const [attack, setAttack] = useState<string>("");

  useEffect(() => {
    if (classMagic) {
      const saveDCValues = new Set<number>();
      const attackValues = new Set<number>();

      for (const className in classMagic) {
        const magicStats = classMagic[className];
        if (magicStats) {
          saveDCValues.add(magicStats.SaveDC);
          attackValues.add(magicStats.Attack);
        }
      }

      // If values same for all classes, set them to a single value
      // Else separate
      setSaveDC(
        saveDCValues.size === 1
          ? `${[...saveDCValues][0]}`
          : [...saveDCValues].join(" | ")
      );

      setAttack(
        attackValues.size === 1
          ? `${[...attackValues][0] > 0 ? "+" : "-"}${[...attackValues][0]}` // check positive/negative
          : [...attackValues]
              .map((value) => (value > 0 ? `+${value}` : `-${value}`))
              .join(" | ")
      );
    }
  }, [classMagic]);

  return (
    <div className="flex flex-row justify-center gap-6">
      <div className="flex flex-col justify-center">
        <h1 className="text-xl text-center">Save DC</h1>
        <div className="text-lg text-center">{saveDC}</div>
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-xl text-center">Spell Attack</h1>
        <div className="text-lg text-center">{attack}</div>
      </div>
    </div>
  );
};

export default MagicStats;
