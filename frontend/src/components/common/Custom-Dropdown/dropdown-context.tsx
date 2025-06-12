"use client";

import React from "react";

type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDropdown: () => void;
  closeDropdown: () => void;
};

const DropdownContext = React.createContext<DropdownContextType | undefined>(
  undefined
);

export const DropdownProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeDropdown = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DropdownContext.Provider
      value={{ isOpen, setIsOpen, toggleDropdown, closeDropdown }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

export function useDropdown() {
  const context = React.useContext(DropdownContext);

  if (context === undefined) {
    throw new Error("useDropdown must be used within a DropdownProvider");
  }

  return context;
}
