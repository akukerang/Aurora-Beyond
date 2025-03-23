import React, { useState } from "react";

interface EditableStatProps {
  value: number;
  onChange: (newValue: number) => void;
}

const EditableStat: React.FC<EditableStatProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleBlur = () => {
    setIsEditing(false);
    const newValue = parseInt(inputValue, 10) || 0; // Convert input to number, default to 0 if invalid
    onChange(newValue);
  };

  return isEditing ? (
    <input
      type="number"
      className="w-full bg-white text-black text-center"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <div
      className="cursor-pointer hover:bg-gray-500 rounded-sm"
      onClick={() => setIsEditing(true)}
    >
      {value}
    </div>
  );
};

export default EditableStat;
