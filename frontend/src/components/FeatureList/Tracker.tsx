import { FC, useEffect, useState } from "react";
import CheckboxTracker from "../CheckboxTracker";
import FullTracker from "../FullTracker";

type Props = {
  uses: number;
  per: string;
};
const Tracker: FC<Props> = ({ uses, per }) => {
  if (uses <= 6) {
    const [checkedSlots, setCheckedSlots] = useState<boolean[]>([]);
    useEffect(() => {
      setCheckedSlots(Array.from({ length: uses }, (_, i) => i > uses));
    }, [uses]);

    const handleCheck = (index: number) => {
      setCheckedSlots((prevCheckedSlots) => {
        const isChecked = prevCheckedSlots[index];
        const newCheckedSlots = [...prevCheckedSlots];
        newCheckedSlots[index] = !isChecked;
        return newCheckedSlots;
      });
    };

    return (
      <div className="pt-3">
        <CheckboxTracker
          length={uses}
          title={"/ " + per}
          onChange={handleCheck}
          checkedSlots={checkedSlots}
        />
      </div>
    );
  } else {
    const [numUse, setNumUse] = useState(uses);
    const [change, setChange] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      setChange(value === "" ? 0 : parseInt(value, 10) || 0); // Convert to number, default to 0 if invalid
      value = "";
    };

    const addUse = () => {
      if (change === 0) {
        setNumUse((prev) => Math.min(prev + 1, uses)); // Max at uses
      } else {
        setNumUse((prev) => Math.min(prev + change, uses)); // Max at uses
      }
      setChange(0);
    };

    const removeUse = () => {
      if (change === 0) {
        setNumUse((prev) => Math.max(prev - 1, 0)); // min 0
      } else {
        setNumUse((prev) => Math.max(prev - change, 0)); // min 0
      }
      setChange(0);
    };

    return (
      <div className="pt-3 flex flex-row items-center gap-x-3">
        <div className="w-[12.5%]">
          <FullTracker
            handleChange={handleChange}
            onAdd={addUse}
            onRemove={removeUse}
          />
        </div>
        <div className="font-bold">{"Current: " + numUse}</div>
      </div>
    );
  }
};
export default Tracker;
