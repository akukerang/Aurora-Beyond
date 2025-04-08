import React, { createContext, useContext, useState } from "react";
import { GetCharacterData } from "../../wailsjs/go/main/App";
import { character } from "../../wailsjs/go/models"; // Adjust the import path as necessary

// Define the shape of the character data

interface CharacterContextType {
  character: character.Character | null;
  loadCharacter: (filePath: string) => Promise<void>;
}

// Create the context
const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

// Provider component
export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [character, setCharacter] = useState<character.Character | null>(null);
  // Function to load character data from the backend
  const loadCharacter = async (filePath: string) => {
    try {
      setCharacter(null); // Reset character state before loading new data
      GetCharacterData(filePath)
        .then((result) => {
          setCharacter(result);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.error("Error loading character data:", error);
    }
  };

  return (
    <CharacterContext.Provider value={{ character, loadCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
};

// Custom hook to use the context
export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
};
