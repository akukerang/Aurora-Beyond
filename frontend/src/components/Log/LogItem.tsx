import CloseIcon from "@mui/icons-material/Close";
import { FC } from "react";
import TypeText from "./TypeText";

type Props = {
  context: string;
  type: string;
  total: number;
  rolls: string;
  rollNotation: string;
  className?: string;
  onClick: () => void;
};

// TODO : Animation when log item shows up.
const LogItem: FC<Props> = ({
  context,
  type,
  total,
  rolls,
  rollNotation,
  className,
  onClick,
}) => {
  return (
    <div
      className={`relative flex flex-row bg-gray-900 rounded-md my-2 mr-4 px-4 p-2 items-center ${className}`}
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
        <h2 className="text-xl truncate">{rolls}</h2>
        <h2 className="text-base truncate">{rollNotation}</h2>
      </div>
      <div className="w-[2px] bg-gray-700 h-full mx-2"></div>
      <div className="w-[25%] flex items-center justify-center">
        <h1 className="text-2xl">{total}</h1>
      </div>
    </div>
  );
};

export default LogItem;
