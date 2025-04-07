import CloseIcon from "@mui/icons-material/Close";
import { FC } from "react";
import TypeText from "./TypeText";

type Props = {
  context: string;
  type: string;
  total: number;
  className?: string;
  onClick: () => void;
};

// TODO : Animation when log item shows up.
const LogItemMin: FC<Props> = ({
  context,
  type,
  total,
  onClick,
  className,
}) => {
  return (
    <div
      className={`relative flex flex-row bg-gray-900 rounded-md my-2 mr-4 px-4 py-4 items-center ${className}`}
    >
      <CloseIcon
        className="absolute top-2 right-2 cursor-pointer"
        fontSize="small"
        onClick={onClick}
      />
      <div className="flex flex-col w-[75%] justify-center">
        <h1 className="text-base truncate font-semibold">
          {context} : <TypeText type={type} />
        </h1>
      </div>
      <div className="w-[2px] bg-gray-700 h-full mx-2"></div>
      <div className="w-[25%] flex items-center justify-center">
        <h1 className="text-xl font-semibold">{total}</h1>
      </div>
    </div>
  );
};

export default LogItemMin;
