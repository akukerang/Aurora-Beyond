import { FC } from "react";

type Props = {
  length: number;
  title: string;
  onChange: (index: number) => void;
  checkedSlots: boolean[];
};

const CheckboxTracker: FC<Props> = ({
  length,
  title,
  onChange,
  checkedSlots,
}) => {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length }).map((_, index) => (
        <label key={index} className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox w-6 h-6 accent-red-500"
            checked={checkedSlots[index] || false}
            onChange={() => onChange(index)}
          />
        </label>
      ))}
      <p className="text-lg font-semibold">{title}</p>
    </div>
  );
};

export default CheckboxTracker;
