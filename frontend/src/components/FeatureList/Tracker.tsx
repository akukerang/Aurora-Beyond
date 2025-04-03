import { FC, useEffect, useState } from "react";
import { useFeat } from "../../hooks/FeatContext"; // Import the context hook
import CheckboxTracker from "../CheckboxTracker";
import FullTracker from "../FullTracker";
type Props = {
  name: string;
  uses: number;
  per: string;
};
const Tracker: FC<Props> = ({ name, uses, per }) => {
  const { Feat, useCharge, replenishCharge, addFeat } = useFeat(); // Destructure the context hook
  useEffect(() => {
    if (!name || uses <= 0) return;
    if (!Feat[name]) {
      addFeat(name, uses);
    }
  }, [Feat]);

  if (uses <= 6) {
    const [checkedSlots, setCheckedSlots] = useState<boolean[]>([]);
    useEffect(() => {
      setCheckedSlots(
        Array.from(
          { length: Feat[name]?.maxCharges || 0 },
          (_, i) => i < (Feat[name]?.usedCharges || 0) // Fill from left to right
        )
      );
    }, [uses, Feat[name]?.usedCharges, Feat[name]?.maxCharges]);

    const handleCheck = (index: number) => {
      setCheckedSlots((prevCheckedSlots) => {
        const isChecked = prevCheckedSlots[index];
        const newCheckedSlots = [...prevCheckedSlots];
        newCheckedSlots[index] = !isChecked;
        if (isChecked) {
          replenishCharge(name, 1);
        } else {
          useCharge(name, 1);
        }
        return newCheckedSlots;
      });
    };

    return (
      <div className="pt-3">
        <CheckboxTracker
          length={Feat[name]?.maxCharges || 0} // Ensure the length matches maxCharges
          title={"/ " + per}
          checkedSlots={checkedSlots}
          onChange={handleCheck}
        />
      </div>
    );
  } else {
    const [change, setChange] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      setChange(value === "" ? 0 : parseInt(value, 10) || 0); // Convert to number, default to 0 if invalid
      value = "";
    };

    const addUse = () => {
      if (change === 0) {
        replenishCharge(name, 1); // Use 1 charge
      } else {
        replenishCharge(name, change); // Use 'change' charges
      }
      setChange(0);
    };

    const removeUse = () => {
      if (change === 0) {
        useCharge(name, 1); // Replenish 1 charge
      } else {
        useCharge(name, change); // Replenish 'change' charges
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
        <div className="font-bold">
          {"Current: " + (Feat[name]?.maxCharges - Feat[name]?.usedCharges)}
        </div>
      </div>
    );
  }
};
export default Tracker;
