"use client";
import LogItem from "./LogItem";
import { useLog } from "../../hooks/logContext";
import { useEffect, useRef, useState } from "react";
const Log = () => {
  const { log, removeLog } = useLog();
  const endOfLog = useRef<HTMLDivElement | null>(null);
  const [prevLogLength, setPrevLogLength] = useState(log.length);
  useEffect(() => {
    if (log.length > prevLogLength && endOfLog.current) {
      // scroll to bottom when new log is added
      endOfLog.current.scrollIntoView({ behavior: "smooth" });
    }
    setPrevLogLength(log.length); // dont move to bottom if log is removed
  }, [log]);
  return (
    <div className="flex flex-col max-h-screen overflow-y-scroll">
      {log
        ? log.map((logItem, index) => (
            <LogItem
              key={index}
              msg={logItem.msg}
              rolls={logItem.rolls}
              onClick={() => removeLog(index)}
            />
          ))
        : null}
      <div ref={endOfLog} />
    </div>
  );
};
export default Log;
