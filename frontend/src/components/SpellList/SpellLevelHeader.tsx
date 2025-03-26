import { FC, useState } from "react";

type Props = {
  level: number;
  slots: number;
};

const SpellLevelHeader: FC<Props> = ({ level, slots }) => {
  const [checkedSlots, setCheckedSlots] = useState<boolean[]>(
    Array(slots).fill(false)
  );
  const [checkCount, setCheckCount] = useState(0);

  const handleCheck = (index: number) => {
    setCheckCount((prevCount) => {
      const isChecked = checkedSlots[index];
      const newCount = isChecked ? prevCount - 1 : prevCount + 1;

      if (newCount >= 0 && newCount <= slots) {
        setCheckedSlots(
          Array(slots)
            .fill(false)
            .map((_, i) => i < newCount)
        );
        return newCount;
      }

      return prevCount;
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
            {Array.from({ length: slots }).map((_, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox w-6 h-6 accent-red-500"
                  checked={checkedSlots[index]}
                  onChange={() => handleCheck(index)}
                />
              </label>
            ))}
            <p className="text-lg font-semibold">SLOTS</p>
          </div>
        </>
      )}
    </div>
  );
};

export default SpellLevelHeader;
