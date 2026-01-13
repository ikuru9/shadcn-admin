import React, { useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import { type Pet } from "../data/schema";

type PetDialogType = "add" | "edit" | "delete";

interface PetContextType {
  open: PetDialogType | null;
  setOpen: (str: PetDialogType | null) => void;
  currentRow: Pet | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Pet | null>>;
}

const PetContext = React.createContext<PetContextType | null>(null);

export function PetsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<PetDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Pet | null>(null);

  return <PetContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</PetContext>;
}

// oxlint-disable-next-line react-refresh/only-export-components
export const usePets = () => {
  const petContext = React.useContext(PetContext);

  if (!petContext) {
    throw new Error("usePet has to be used within <PetContext>");
  }

  return petContext;
};
