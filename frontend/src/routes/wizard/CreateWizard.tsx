import { Routes, Route } from "react-router-dom";
import { WizardLayout } from "./WizardLayout";
import { StepType } from "./StepType";
import StepParams from "./StepParams";
import StepCover from "./StepCover";
import { WizardContext } from "./WizardContext";
import { useMemo } from "react";
import useWizard from "~/hooks/useWizard";
import SideImage from "./SideImage";
import { WIZARD_STEPS } from "~/config/constants";

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
          path={WIZARD_STEPS[0]}
          element={
            <WizardLayout sideElement={<SideImage />}>
              <StepType />
            </WizardLayout>
          }
        />
        <Route
          path={WIZARD_STEPS[1]}
          element={
            <WizardLayout sideElement={<SideImage />}>
              <StepParams />
            </WizardLayout>
          }
        />
        <Route
          path={WIZARD_STEPS[2]}
          element={
            <WizardLayout sideElement={<SideImage />}>
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
