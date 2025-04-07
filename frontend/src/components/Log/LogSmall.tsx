import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import { useLog } from "../../hooks/logContext";
import LogItem from "./LogItem";
import LogItemMin from "./LogItemMin";
const LogSmall = () => {
  const { log, removeLog, setNewLog } = useLog();
  const [toggled, setToggled] = useState(true);
  const clearLog = () => {
    setNewLog([]);
    setToggled(true);
  };

  const toggle = () => {
    setToggled((prev) => !prev);
  };

  return (
    <div className="flex flex-col p-4 w-full">
      {toggled && log
        ? log.map((logItem, index, array) => {
            if (index === array.length - 1) {
              return (
                <LogItem
                  key={index}
                  context={logItem.context}
                  type={logItem.type}
                  total={logItem.total}
                  rolls={logItem.rolls}
                  rollNotation={logItem.rollNotation}
                  onClick={() => removeLog(index)}
                />
              );
            }
            return (
              <LogItemMin
                key={index}
                context={logItem.context}
                type={logItem.type}
                total={logItem.total}
                onClick={() => removeLog(index)}
              />
            );
          })
        : null}
      <div className="flex flex-row justify-end gap-2 pr-4">
        {log.length > 0 ? (
          <>
            <div
              className="bg-gray-900 text-white text-lg hover:cursor-pointer hover:bg-gray-800 w-12 h-8 flex items-center justify-center p-2 rounded-md"
              onClick={toggle}
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
