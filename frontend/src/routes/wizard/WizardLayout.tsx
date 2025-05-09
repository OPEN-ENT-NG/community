import { Button, Flex, Grid, useBreakpoint } from "@edifice.io/react";
import useStepNavigation from "~/hooks/useStepNavigations";
import Stepper from "~/components/Stepper";
import WizardHeader from "~/components/WizardHeader";
import { useWizardContext } from "./WizardContext";
import { IconRafterLeft, IconSend } from "@edifice.io/react/icons";

export const WizardLayout = ({
  children,
  sideElement,
  lastStep = false,
}: {
  children: React.ReactElement;
  sideElement: React.ReactElement;
  lastStep?: boolean;
}) => {
  const { currentStep, backStep } = useStepNavigation();
  const { lg, md } = useBreakpoint();
  const { wizardData } = useWizardContext();

  const wizardTitles = [
    {
      title: "Nouvelle communauté",
      subTitle: "Quel type de communauté souhaitez-vous créer ?",
    },
    {
      title: "Nouvelle communauté",
      subTitle: "Paramètres de la communauté",
    },
    {
      title: wizardData.communityParams.title,
      subTitle: "Choisir une bannière",
    },
    {
      title: "Ajouter des membres",
    },
  ];

  return (
    <>
      <Grid className={`flex-grow-1 py-64 gap-64 px-48 ${lg && "wizard-side"}`}>
        <Grid.Col
          sm="4"
          md="8"
          lg={lastStep ? "4" : "5"}
          xl={lastStep ? "5" : "7"}
          className={`${lg && "ms-64"}`}
        >
          <Flex direction="column" className="h-100">
            <Stepper current={currentStep} className="mb-48" />
            <WizardHeader
              title={wizardTitles[currentStep].title}
              subTitle={wizardTitles[currentStep].subTitle}
            />
            {children}
          </Flex>
        </Grid.Col>
        {lg && (
          <Grid.Col
            sm="0"
            md="0"
            lg={lastStep ? "4" : "3"}
            xl={lastStep ? "7" : "5"}
            className="overflow-hidden rounded-5"
          >
            {sideElement}
          </Grid.Col>
        )}
      </Grid>
      {currentStep === 3 && (
        <Flex justify="between" className="mt-auto px-48 pb-64">
          <Button
            variant="ghost"
            color="tertiary"
            leftIcon={<IconRafterLeft />}
            disabled={currentStep <= 0}
            onClick={backStep}
          >
            Précédent
          </Button>
          <Flex className="gap-16" direction={!md ? "column" : "row"}>
            <Button
              variant="outline"
              color="primary"
              disabled={currentStep <= 0}
              onClick={() => {}}
            >
              {lg
                ? "Ignorer cette étape et créer la communauté"
                : "Ignorer cette étape et créer"}
            </Button>
            <Button
              variant="filled"
              color="primary"
              leftIcon={<IconSend />}
              disabled={currentStep <= 0}
              onClick={() => {}}
            >
              {lg
                ? "Ajouter les membres et créer la communauté"
                : "Ajouter les membres et créer"}
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
};
