import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { FC, useRef } from "react";

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onRemove: () => void;
  className?: string;
};

const FullTracker: FC<Props> = ({
  handleChange,
  onAdd,
  onRemove,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    onAdd();
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input field
    }
  };

  const handleRemove = () => {
    onRemove();
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input field
    }
  };

  return (
    <div className={`flex gap-x-0.5 ${className}`}>
      <div
        className="w-[27.5%] bg-red-400 rounded-md flex justify-center items-center hover:bg-red-600 cursor-pointer"
        onClick={handleRemove}
      >
        <KeyboardArrowDownIcon />
      </div>
      <input
        ref={inputRef} // Attach the ref to the input field
        className="w-[45%] bg-white text-black text-center"
        onChange={handleChange}
      />
      <div
        className="w-[27.5%] bg-green-400 rounded-md flex justify-center items-center hover:bg-green-600 cursor-pointer"
        onClick={handleAdd}
      >
        <KeyboardArrowUpIcon />
      </div>
    </div>
  );
};

export default FullTracker;
