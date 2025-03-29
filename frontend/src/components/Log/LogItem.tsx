import { FC } from "react";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  index: number;
  length: number;
  context: string;
  type: string;
  total: number;
  rolls: string;
  rollNotation: string;
  onClick: () => void;
};

// TODO : Animation when log item shows up.
const LogItem: FC<Props> = ({
  index,
  length,
  context,
  type,
  total,
  rolls,
  rollNotation,
  onClick,
}) => {
  return (
    <div
      className={`relative flex flex-row bg-gray-900 rounded-md my-2 mr-3 px-4 p-2 items-center
        animate-slide-in transition-transform duration-300 ease-in-out`}
    >
      <CloseIcon
        className="absolute top-2 right-2 cursor-pointer"
        fontSize="small"
        onClick={onClick}
      />
      <div className="flex flex-col w-[75%] justify-center">
        <h1 className="text-md truncate">
          {context} : {type} : {index} : {length}
        </h1>
        <h2 className="text-xl truncate">{rolls}</h2>
        <h2 className="text-md truncate">{rollNotation}</h2>
      </div>
      <div className="w-[2px] bg-gray-700 h-full mx-2"></div>
      <div className="w-[25%] flex items-center justify-center">
        <h1 className="text-2xl">{total}</h1>
      </div>
    </div>
  );
};

export default LogItem;
