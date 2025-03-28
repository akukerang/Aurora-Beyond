import LogItem from "./LogItem";
import { useLog } from "../../hooks/logContext";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
const LogSmall = () => {
  const { log, removeLog, setNewLog } = useLog();
  const [toggled, setToggled] = useState(true);
  const clearLog = () => {
    setNewLog([]);
    setToggled(true);
  };

  return (
    <div className="flex flex-col p-4 w-full">
      {toggled && log
        ? log
            .slice(-3)
            .map((logItem, index) => (
              <LogItem
                key={index}
                context={logItem.context}
                type={logItem.type}
                total={logItem.total}
                rolls={logItem.rolls}
                onClick={() => removeLog(index)}
              />
            ))
        : null}
      <div className="flex flex-row justify-end gap-2 pr-4">
        {log.length > 0 ? (
          <>
            <div
              className="bg-gray-900 text-white text-lg hover:cursor-pointer hover:bg-gray-800 w-12 h-8 flex items-center justify-center p-2 rounded-md"
              onClick={() => setToggled(!toggled)}
            >
              {toggled ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </div>
            <div
              className="bg-gray-900 text-white text-lg hover:cursor-pointer hover:bg-gray-800 w-20 h-8 flex items-center justify-center  p-2 rounded-md"
              onClick={clearLog}
            >
              Clear
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
export default LogSmall;
