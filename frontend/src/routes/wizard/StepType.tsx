import { Heading, useBreakpoint } from "@edifice.io/react";
import RadioCard from "~/components/RadioCard";
import { useWizardContext } from "./WizardContext";
import SideImage from "./SideImage";
import ButtonFooter from "./ButtonFooter";

export const StepType = () => {
  const { wizardData, updateWizardData } = useWizardContext();
  const setSelectedType = (type: string) => {
    updateWizardData({ communityType: { type } });
  };
  const { lg } = useBreakpoint();

  return (
    <>
      <Heading>Nouvelle communauté</Heading>
      <p className="text-gray-700 mb-48">
        Quel type de communauté souhaitez-vous créer ?
      </p>
      {!lg && <SideImage />}
      <RadioCard
        className="mb-24"
        label="Pour une classe"
        value="classe"
        description="Recréez votre classe pour diffuser facilement des documents et ressources aux élèves, leur communiquer des informations essentielles, etc."
        selectedValue={wizardData.communityType.type}
        onChange={setSelectedType}
      />
      <RadioCard
        className="mb-24"
        label="Pour une thématique"
        value="theme"
        description="Créez une communauté pour le club de lecture, les éco-délégués, les équipes éducatives, l'association sportive, etc."
        selectedValue={wizardData.communityType.type}
        onChange={setSelectedType}
      />
      <ButtonFooter />
    </>
  );
};
