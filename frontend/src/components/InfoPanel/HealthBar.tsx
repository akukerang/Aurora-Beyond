"use client";
import React, { useEffect, FC } from "react";
import { useState } from "react";
import EditableStat from "../EditableStat";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FullTracker from "../FullTracker";
type Props = {
  playerHealth: number;
};

const HealthBar: FC<Props> = ({ playerHealth }) => {
  const [health, setHealth] = useState(0);
  const [maxHealth, setMaxHealth] = useState(0);
  const [tempHealth, setTempHealth] = useState(0);
  const [change, setChange] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChange(value === "" ? 0 : parseInt(value, 10) || 0); // Convert to number, default to 0 if invalid
  };

  const addHealth = () => {
    if (change === 0) {
      setHealth((prev) => Math.min(prev + 1, maxHealth)); // Max at maxHealth
    } else {
      setHealth((prev) => Math.min(prev + change, maxHealth)); // Max at maxHealth
    }
    setChange(0);
  };

  const removeHealth = () => {
    let remainder = 0;
    if (tempHealth > 0) {
      if (change === 0) {
        remainder = tempHealth - 1;
        setTempHealth((prev) => Math.max(prev - 1, 0)); // min 0
        if (remainder < 0) {
          // if remainder is negative, subtract from health
          setHealth((prev) => Math.max(prev + remainder, 0)); // min 0
        }
      } else {
        remainder = tempHealth - change;
        setTempHealth((prev) => Math.max(prev - change, 0)); // min 0
        if (remainder < 0) {
          // if remainder is negative, subtract from health
          setHealth((prev) => Math.max(prev + remainder, 0)); // min 0
        }
      }
    } else {
      if (change === 0) {
        setHealth((prev) => Math.max(prev - 1, 0)); // min 0
      } else {
        setHealth((prev) => Math.max(prev - change, 0)); // min 0
      }
    }
    setChange(0);
  };

  useEffect(() => {
    // gets player hp from Aurora file
    setHealth(playerHealth);
    setMaxHealth(playerHealth);
  }, []);

  return (
    <div className="p-4  bg-gray-700 rounded-lg mb-2 text-center r">
      <div className="flex justify-between ">
        <div className="w-1/3">
          <h1 className="text-xl">Change</h1>
        </div>
        <div className="w-1/3">
          <h1 className="text-xl">Health</h1>
        </div>
        <div className="w-1/3">
          <h1 className="text-xl">Temp</h1>
        </div>
      </div>
      <div className="flex justify-between text-center items-center">
        <div className="w-1/3 p-1">
          <FullTracker
            handleChange={handleChange}
            onAdd={addHealth}
            onRemove={removeHealth}
            className="align-center justify-center w-2/3 mx-auto"
          />
        </div>
        <div className="w-1/3 flex justify-center items-center gap-x-1">
          <EditableStat value={health} onChange={setHealth} />
          <span>/</span>
          <EditableStat value={maxHealth} onChange={setMaxHealth} />
        </div>
        <div className="w-1/3">
          <EditableStat value={tempHealth} onChange={setTempHealth} />
        </div>
      </div>
    </div>
  );
};

export default HealthBar;
