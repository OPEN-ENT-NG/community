import { Routes, Route } from "react-router-dom";
import { WizardLayout } from "./WizardLayout";
import { StepType } from "./StepType";
import StepParams from "./StepParams";
import StepCover from "./StepCover";
import { WizardContext } from "./WizardContext";
import { useMemo } from "react";
import useWizard from "~/hooks/useWizard";
import SideImage from "./SideImage";

const wizardSteps = [
  "step-type",
  "step-params",
  "step-cover",
  "step-invitations",
];

function CreateWizard() {
  const { wizardData, updateWizardData, resetWizardData } = useWizard();
  const value = useMemo(
    () => ({
      wizardData,
      updateWizardData,
      resetWizardData,
    }),
    [wizardData, updateWizardData, resetWizardData],
  );

  return (
    <WizardContext.Provider value={value}>
      <Routes>
        <Route
          path="step-type"
          element={
            <WizardLayout steps={wizardSteps} sideElement={<SideImage />}>
              <StepType />
            </WizardLayout>
          }
        />
        <Route
          path="step-params"
          element={
            <WizardLayout steps={wizardSteps} sideElement={<SideImage />}>
              <StepParams />
            </WizardLayout>
          }
        />
        <Route
          path="step-cover"
          element={
            <WizardLayout steps={wizardSteps} sideElement={<SideImage />}>
              <StepCover />
            </WizardLayout>
          }
        />
        <Route path="step-invitations" element={<p>members</p>} />
      </Routes>
    </WizardContext.Provider>
  );
}

export default CreateWizard;
