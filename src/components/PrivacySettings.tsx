import React from "react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { usePrivacy } from "./PrivacyProvider";

const PII_FIELDS = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email" },
  { key: "address", label: "Street Address" },
];

const MASKING_OPTIONS = [
  { value: "none", label: "None (Show Full)" },
  { value: "partial", label: "Partial Mask" },
  { value: "full", label: "Full Mask" },
];

export type MaskingPreferences = {
  [key: string]: "none" | "partial" | "full";
};

const PrivacySettings = () => {
  const { preferences, updatePreference } = usePrivacy();

  return (
    <Card className="max-w-xl mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-4">Privacy Settings</h2>
      <div className="space-y-4">
        {PII_FIELDS.map((field) => (
          <div key={field.key} className="flex items-center justify-between gap-4">
            <Label className="text-base" htmlFor={field.key}>{field.label}</Label>
            <Select
              value={preferences[field.key]}
              onValueChange={(val) => updatePreference(field.key, val as "none" | "partial" | "full")}
            >
              <SelectTrigger id={field.key} className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MASKING_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PrivacySettings; 