import { FC, useEffect, useState } from "react";
import { useSpells } from "../../hooks/SpellContext";

type Props = {
  level: number;
};

const SpellLevelHeader: FC<Props> = ({ level }) => {
  const { slots, replenishSlot, useSlot } = useSpells();
  const [checkedSlots, setCheckedSlots] = useState<boolean[]>([]);

  useEffect(() => {
    if (level !== 0 && slots.maxSlots[level - 1] !== undefined) {
      setCheckedSlots(
        Array.from(
          { length: slots.maxSlots[level - 1] || 0 },
          (_, i) => i < (slots.availableSlots[level - 1] || 0)
        )
      );
    }
  }, [level, slots.availableSlots, slots.maxSlots]);

  const handleCheck = (index: number) => {
    setCheckedSlots((prevCheckedSlots) => {
      const isChecked = prevCheckedSlots[index];
      const newCheckedSlots = [...prevCheckedSlots];
      newCheckedSlots[index] = !isChecked;
      if (isChecked) {
        replenishSlot(level - 1);
      } else {
        useSlot(level - 1);
      }
      return newCheckedSlots;
    });
  };

  return (
    <div className="flex flex-row border-b border-white pb-1 mb-1 justify-between items-center">
      {level === 0 ? ( // Cantrips have no slots
        <h2 className="text-xl">Cantrips</h2>
      ) : (
        <>
          <h2 className="text-xl">{`Level ${level} Spells`}</h2>
          <div className="flex gap-1 items-center">
            {Array.from({ length: slots.maxSlots[level - 1] || 0 }).map(
              (_, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox w-6 h-6 accent-red-500"
                    checked={checkedSlots[index] || false} // Ensure checked is always a boolean
                    onChange={() => handleCheck(index)}
                  />
                </label>
              )
            )}
            <p className="text-lg font-semibold">SLOTS</p>
          </div>
        </>
      )}
    </div>
  );
};

export default SpellLevelHeader;
