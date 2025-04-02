import { FC, useState, useContext, createContext, ReactNode } from "react";

type Charges = {
  usedCharges: number;
  maxCharges: number;
};

type FeatContextType = {
  Feat: Record<string, Charges>;
  useCharge: (feat: string, amount: number) => void;
  replenishCharge: (feat: string, amount: number) => void;
  addFeat: (name: string, maxUses: number) => void;
};

const FeatContext = createContext<FeatContextType | undefined>(undefined);

interface FeatProviderProps {
  children: ReactNode;
}

export const FeatProvider: FC<FeatProviderProps> = ({ children }) => {
  const [Feat, setFeat] = useState<Record<string, Charges>>({});

  const replenishCharge = (feat: string, amount: number) => {
    setFeat((prevFeat) => {
      const newFeat = { ...prevFeat };
      if (newFeat[feat]) {
        newFeat[feat].usedCharges = Math.max(
          0,
          newFeat[feat].usedCharges - amount
        );
      } else {
        console.warn(`Feat "${feat}" not found.`);
      }
      return newFeat;
    });
  };

  const useCharge = (feat: string, amount: number) => {
    setFeat((prevFeat) => {
      const newFeat = { ...prevFeat };
      if (newFeat[feat]) {
        newFeat[feat].usedCharges = Math.min(
          newFeat[feat].maxCharges,
          newFeat[feat].usedCharges + amount
        );
      } else {
        console.warn(`Feat "${feat}" not found.`);
      }
      return newFeat;
    });
  };

  const addFeat = (name: string, maxUses: number) => {
    setFeat((prevFeat) => {
      if (prevFeat[name]) {
        console.warn(`Feat "${name}" already exists.`);
        return prevFeat;
      }
      return {
        ...prevFeat,
        [name]: {
          usedCharges: 0,
          maxCharges: maxUses,
        },
      };
    });
  };

  return (
    <FeatContext.Provider value={{ Feat, useCharge, replenishCharge, addFeat }}>
      {children}
    </FeatContext.Provider>
  );
};

export const useFeat = () => {
  const context = useContext(FeatContext);
  if (!context) {
    throw new Error("useFeat must be used within a FeatProvider");
  }
  return context;
};
