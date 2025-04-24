import { Button, Flex, Grid, Image } from "@edifice.io/react";
import imageClasse from "../../assets/images/community-classe.png";
import imageTheme from "../../assets/images/community-theme.png";
import { IconRafterLeft, IconRafterRight } from "@edifice.io/react/icons";
import useStepNavigation from "~/hooks/useStepNavigations";
import Stepper from "~/components/Stepper";
import { useEffect, useState } from "react";
import { useWizardContext } from "./WizardContext";

export const WizardLayout = ({
  children,
  steps,
}: {
  children: React.ReactElement;
  steps: string[];
}) => {
  const { currentStep, nextStep, backStep } = useStepNavigation(steps);
  const { wizardData } = useWizardContext();
  const [imageCommunity, setImageCommunity] = useState(imageClasse);

  useEffect(() => {
    setImageCommunity(() =>
      wizardData.type === "classe" ? imageClasse : imageTheme,
    );
  }, [wizardData.type]);

  return (
    <Grid className="flex-grow-1 my-64">
      <Grid.Col sm="7" md="7" lg="7" xl="7" className="px-32">
        <Flex direction="column" className="h-100">
          <Stepper steps={steps} current={currentStep} className="mb-48" />
          {children}
          <Flex justify="between" className="mt-auto">
            <Button
              variant="ghost"
              color="tertiary"
              leftIcon={<IconRafterLeft />}
              disabled={currentStep <= 0}
              onClick={backStep}
            >
              Retour
            </Button>
            <Button
              rightIcon={<IconRafterRight />}
              disabled={currentStep >= steps.length - 1}
              onClick={nextStep}
            >
              Suivant
            </Button>
          </Flex>
        </Flex>
      </Grid.Col>
      <Grid.Col sm="5" md="5" lg="5" xl="5" className="rounded-5">
        {/* Changer l'image lorsqu'on aura l'image d'illu /> */}
        <Image style={{ height: "100%" }} alt="type" src={imageCommunity} />
      </Grid.Col>
    </Grid>
  );
};
