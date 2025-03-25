import { FC, useState } from "react";

type Props = {
  level: number;
  slots: number;
};

const SpellLevelHeader: FC<Props> = ({ level, slots }) => {
  const [checkedCount, setChecked] = useState(0);
  return (
    <div className="flex flex-row border-b border-white pb-1 mb-1 justify-between">
      {level === 0 ? ( // Cantrips no slots
        <>
          <h2 className="text-xl">Cantrips</h2>
        </>
      ) : (
        <>
          <h2 className="text-xl">{`Level ${level} Spells`}</h2>
          <div className="flex gap-2">
            {Array.from({ length: slots }).map((_, index) => (
              <label key={index} className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
              </label>
            ))}
            <p className="font-semibold text-lg">SLOTS</p>
          </div>
        </>
      )}
    </div>
  );
};

export default SpellLevelHeader;
