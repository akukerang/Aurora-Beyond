import { FC } from "react";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  msg: string;
  rolls: string;
  onClick: () => void;
};

// TODO : Animation when log item shows up.
const LogItem: FC<Props> = ({ msg, rolls, onClick }) => {
  return (
    <div className="relative bg-gray-500 rounded-md my-2 mr-3 p-4">
      <CloseIcon
        className="absolute top-2 right-4 text-2xl cursor-pointer"
        onClick={onClick}
      />

      {/* Content */}
      <div className="mt-2 px-3">
        <h1>{msg}</h1>
        <h2>{rolls}</h2>
      </div>
    </div>
  );
};

export default LogItem;
