import { FC, useState, useContext, createContext, ReactNode } from "react";

type Slots = {
  availableSlots: number[];
  maxSlots: number[];
};

type SpellContextType = {
  slots: Slots;
  useSlot: (index: number) => void;
  replenishSlot: (index: number) => void;
  loadSlots: (spellSlots: number[]) => void;
};

const SpellContext = createContext<SpellContextType | undefined>(undefined);

interface SpellProviderProps {
  children: ReactNode;
}

export const SpellProvider: FC<SpellProviderProps> = ({ children }) => {
  const [slots, setSlots] = useState<Slots>({
    availableSlots: [],
    maxSlots: [],
  });

  const replenishSlot = (index: number) => {
    setSlots((prevSlots) => {
      const newSlots = {
        ...prevSlots,
        availableSlots: [...prevSlots.availableSlots],
      };
      newSlots.availableSlots[index] = Math.max(
        0,
        newSlots.availableSlots[index] - 1
      );

      return newSlots;
    });
  };

  const useSlot = (index: number) => {
    setSlots((prevSlots) => {
      const newSlots = {
        ...prevSlots,
        availableSlots: [...prevSlots.availableSlots],
      };
      newSlots.availableSlots[index] = Math.min(
        newSlots.maxSlots[index],
        newSlots.availableSlots[index] + 1
      );
      return newSlots;
    });
  };

  const loadSlots = (spellSlots: number[]) => {
    if (slots.availableSlots.length > 0 && slots.maxSlots.length > 0) {
      return;
    }
    if (!spellSlots || spellSlots.length === 0) {
      console.warn("No spell slots provided.");
      return;
    }
    // Init max and available
    setSlots({
      maxSlots: spellSlots,
      availableSlots: Array(spellSlots.length).fill(0),
    });
  };

  return (
    <SpellContext.Provider value={{ slots, loadSlots, useSlot, replenishSlot }}>
      {children}
    </SpellContext.Provider>
  );
};

export const useSpells = () => {
  const context = useContext(SpellContext);
  if (!context) {
    throw new Error("useLog must be used within a LogProvider");
  }
  return context;
};
