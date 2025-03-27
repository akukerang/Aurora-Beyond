import { FC } from "react";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  msg: string;
  total: number;
  rolls: string;
  onClick: () => void;
};

// TODO : Animation when log item shows up.
const LogItem: FC<Props> = ({ msg, total, rolls, onClick }) => {
  return (
    <div className="relative flex flex-row bg-gray-900 rounded-md my-2 mr-3 px-4 p-2 items-center">
      <CloseIcon
        className="absolute top-2 right-2 cursor-pointer"
        fontSize="small"
        onClick={onClick}
      />
      <div className="flex flex-col w-[65%] justify-center">
        <h1 className="text-md">{msg}</h1>
        <h2 className="text-xl">{rolls}</h2>
        <h2 className="text-md">1d20+4</h2>
      </div>
      <div className="w-[2px] bg-gray-700 h-full mx-2"></div>
      <div className="w-[35%] flex items-center justify-center">
        <h1 className="text-2xl">{total}</h1>
      </div>
    </div>
  );
};

export default LogItem;
