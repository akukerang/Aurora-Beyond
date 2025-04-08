import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState, useEffect, useRef } from "react";
import { useLog } from "../../hooks/logContext";
import LogItem from "./LogItem";
import LogItemMin from "./LogItemMin";

const Log = () => {
  const { log, removeLog, setNewLog } = useLog();
  const [toggled, setToggled] = useState(true);

  // Animation control
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [addedIndex, setAddedIndex] = useState<number | null>(null);
  const [overflowAnimationIndex, setOverflowAnimationIndex] = useState<
    number | null
  >(null);
  const prevLogLength = useRef(log.length);
  const [hasMounted, setHasMounted] = useState(false);

  const clearLog = () => {
    setNewLog([]);
    setToggled(true);
  };

  const toggle = () => {
    setToggled((prev) => !prev);
  };

  const animateAdd = "animate-slide-in";
  const animateRemove =
    "animate-slide-out transition-all duration-300 ease-in-out";
  const animateOverflow =
    "animate-slide-out-up transition-all duration-300 ease-in-out";

  useEffect(() => {
    if (log.length > prevLogLength.current) {
      if (log.length === 1) {
        setHasMounted(false); // Reset
        const timer = setTimeout(() => setHasMounted(true), 10);
        return () => clearTimeout(timer);
      }

      if (log.length > 3) {
        setOverflowAnimationIndex(0);
        setTimeout(() => {
          setOverflowAnimationIndex(null);
          removeLog(0);
        }, 300);
      }

      const lastLogIndex = log.length - 1;
      setAddedIndex(lastLogIndex);
      setTimeout(() => setAddedIndex(null), 400);
    }

    prevLogLength.current = log.length;
  }, [log]);

  const handleRemoveLog = (index: number) => {
    setRemovingIndex(index);
    setTimeout(() => {
      removeLog(index);
      setRemovingIndex(null);
    }, 300);
  };

  return (
    <div className="flex flex-col p-4 w-full">
      {toggled && log
        ? log.map((logItem, index, array) => {
            const isRemoving = index === removingIndex;
            const isAdded = index === addedIndex;
            const isOverflow = index === overflowAnimationIndex;
            const animationClass = isRemoving
              ? animateRemove
              : isAdded
              ? animateAdd
              : isOverflow
              ? animateOverflow
              : "";

            if (index === array.length - 1) {
              if (array.length === 1) {
                return (
                  <LogItem
                    key={index}
                    context="TEST"
                    type={logItem.type}
                    total={logItem.total}
                    rolls={logItem.rolls}
                    rollNotation={logItem.rollNotation}
                    onClick={() => handleRemoveLog(index)}
                    className={`${hasMounted ? animateAdd : "opacity-0"}`}
                  />
                );
              }

              return (
                <LogItem
                  key={index}
                  context={logItem.context}
                  type={logItem.type}
                  total={logItem.total}
                  rolls={logItem.rolls}
                  rollNotation={logItem.rollNotation}
                  onClick={() => handleRemoveLog(index)}
                  className={animationClass}
                />
              );
            }

            return (
              <LogItemMin
                key={index}
                context={logItem.context}
                type={logItem.type}
                total={logItem.total}
                onClick={() => handleRemoveLog(index)}
                className={animationClass}
              />
            );
          })
        : null}

      <div className="flex flex-row justify-end gap-2 pr-4">
        {log.length > 0 && (
          <>
            <div
              className="bg-gray-900 text-white text-lg hover:cursor-pointer hover:bg-gray-800 w-12 h-8 flex items-center justify-center p-2 rounded-md"
              onClick={toggle}
            >
              {toggled ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </div>
            <div
              className="bg-gray-900 text-white text-lg hover:cursor-pointer hover:bg-gray-800 w-20 h-8 flex items-center justify-center p-2 rounded-md"
              onClick={clearLog}
            >
              Clear
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Log;
