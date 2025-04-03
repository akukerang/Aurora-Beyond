import { createContext, FC, ReactNode, useContext, useState } from "react";

type NoteType = {
  note: string;
  setNote: (value: string) => void;
};

const Note = createContext<NoteType | undefined>(undefined);

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: FC<NoteProviderProps> = ({ children }) => {
  const [note, setNote] = useState<string>("");

  return <Note.Provider value={{ note, setNote }}>{children}</Note.Provider>;
};

export const useNote = () => {
  const context = useContext(Note);
  if (!context) {
    throw new Error("useNote must be used within a NoteProvider");
  }
  return context;
};
