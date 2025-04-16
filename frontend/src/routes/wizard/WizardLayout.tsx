import { Button, Flex, Grid, Image } from "@edifice.io/react";
import imageLayout from "../../assets/images/imageLayout.png";
import { IconRafterLeft, IconRafterRight } from "@edifice.io/react/icons";
import useStepNavigation from "~/hooks/useStepNavigations";

export const WizardLayout = ({
  children,
  steps,
}: {
  children: any;
  steps: string[];
}) => {
  const { currentStep, nextStep, backStep } = useStepNavigation(steps);

  return (
    <Grid className="flex-grow-1 my-64">
      <Grid.Col sm="7" md="7" lg="7" xl="7">
        <div className="d-flex h-100 flex-column">
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
        </div>
      </Grid.Col>
      <Grid.Col sm="5" md="5" lg="5" xl="5" className="rounded-5">
        {/* Changer l'image lorsqu'on aura l'image d'illu /> */}
        <Image style={{ height: "100%" }} alt="imageLayout" src={imageLayout} />
      </Grid.Col>
    </Grid>
  );
};
