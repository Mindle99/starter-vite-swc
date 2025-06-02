import React, { createContext, useContext, useState, ReactNode } from "react";
import { MaskingPreferences } from "./PrivacySettings";

const defaultPreferences: MaskingPreferences = {
  firstName: "partial",
  lastName: "partial",
  phone: "full",
  email: "partial",
  address: "full",
};

interface PrivacyContextType {
  preferences: MaskingPreferences;
  setPreferences: (prefs: MaskingPreferences) => void;
  updatePreference: (field: string, value: "none" | "partial" | "full") => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<MaskingPreferences>(defaultPreferences);

  const updatePreference = (field: string, value: "none" | "partial" | "full") => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PrivacyContext.Provider value={{ preferences, setPreferences, updatePreference }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const ctx = useContext(PrivacyContext);
  if (!ctx) throw new Error("usePrivacy must be used within a PrivacyProvider");
  return ctx;
}; 