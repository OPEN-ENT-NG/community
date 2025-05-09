import ButtonFooter from "./ButtonFooter";
import WizardHeader from "~/components/WizardHeader";
import { useWizardContext } from "./WizardContext";

export const StepCover = () => {
  const { wizardData } = useWizardContext();
  return (
    <>
      <WizardHeader
        title={wizardData.communityParams.title}
        subTitle="Choisir une bannière"
      />
      <ButtonFooter />
    </>
  );
};

export default StepCover;
