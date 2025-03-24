import React from 'react';
import RollDice from '../RollDice';

interface AbilityScoreBoxProps {
  name: string;
  score: number;
}

const AbilityScoreBox: React.FC<AbilityScoreBoxProps> = ({ name, score }) => {
  const mod = Math.floor((score - 10) / 2);
  const context = `${name} Check`;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-600 rounded-md text-center p-4 h-24 w-full">
      <h1 className="text-lg">{name}</h1>
      <RollDice mod={mod} context={context} />
      <h2 className="text-lg">{score}</h2>
    </div>
  );
};

export default AbilityScoreBox;