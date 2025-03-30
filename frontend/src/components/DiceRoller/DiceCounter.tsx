import { FC } from "react";

type Props = {
  value: number;
};
const DiceCounter: FC<Props> = ({ value }) => {
  return (
    <div
      className="
        z-100 bg-red-500 rounded-full absolute top-[-.5rem] right-[-1rem] w-8 h-8 flex items-center justify-center text-white font-semibold text-lg shadow-lg"
    >
      {value}
    </div>
  );
};
export default DiceCounter;
