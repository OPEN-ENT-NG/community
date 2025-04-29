import { useEffect, useState } from "react";
import { WIZARD_STORAGE_KEY } from "~/config/constants";

export interface WizardData {
  type: string;
  //Ajouter les champs nécessaires à save dans le localStorage
}

export interface useWizardProps {
  wizardData: WizardData;
  updateWizardData: (updates: Partial<WizardData>) => void;
  resetWizardData: () => void;
}

const defaultData: WizardData = {
  type: "classe",
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
    updateWizardData,
    resetWizardData,
  };
};

export default useWizard;
