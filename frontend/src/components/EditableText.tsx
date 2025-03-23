import React, { useState } from "react";

interface EditableStatProps {
  value: string;
  onChange: (newValue: string) => void;
}

const EditableText: React.FC<EditableStatProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(inputValue);
  };

  return isEditing ? (
    <input
      type="text"
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

export default EditableText;
