import { useEffect, useState } from "react";
import { WIZARD_STORAGE_KEY } from "~/config/constants";
import { WizardData } from "~/models/community";

export interface useWizardProps {
  wizardData: WizardData;
  updateWizardData: (updates: Partial<WizardData>) => void;
  resetWizardData: () => void;
}

const defaultData: WizardData = {
  communityType: {
    type: "classe",
  },
  communityParams: {
    title: "",
    note: "",
    startYear: "",
    endYear: "",
  },
};

const useWizard = () => {
  const [wizardData, setWizardData] = useState<WizardData>(() => {
    const saved = localStorage.getItem(WIZARD_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(wizardData));
  }, [wizardData]);

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const resetWizardData = () => {
    localStorage.removeItem(WIZARD_STORAGE_KEY);
    setWizardData(defaultData);
  };

  return {
    wizardData,
    setWizardData,
    updateWizardData,
    resetWizardData,
  };
};

export default useWizard;
