import { Routes, Route } from "react-router-dom";
import { WizardLayout } from "./WizardLayout";
import { StepType } from "./StepType";
import { StepForm } from "./StepForm";
import { StepCustom } from "./StepCustom";
import { WizardContext } from "./WizardContext";
import { useMemo } from "react";
import useWizard from "~/hooks/useWizard";

const wizardSteps = ["type", "form", "custom", "members"];

function CreateWizard() {
  const { wizardData, updateWizardData, resetWizardData } = useWizard();
  const value = useMemo(
    () => ({
      wizardData,
      updateWizardData,
      resetWizardData,
    }),
    [wizardData, updateWizardData, resetWizardData]
  );

  return (
    <WizardContext.Provider value={value}>
      <Routes>
        <Route
          path="type"
          element={
            <WizardLayout steps={wizardSteps}>
              <StepType />
            </WizardLayout>
          }
        />
        <Route
          path="form"
          element={
            <WizardLayout steps={wizardSteps}>
              <StepForm />
            </WizardLayout>
          }
        />
        <Route
          path="custom"
          element={
            <WizardLayout steps={wizardSteps}>
              <StepCustom />
            </WizardLayout>
          }
        />
        <Route path="members" element={<p>members</p>} />
      </Routes>
    </WizardContext.Provider>
  );
}

export default CreateWizard;
