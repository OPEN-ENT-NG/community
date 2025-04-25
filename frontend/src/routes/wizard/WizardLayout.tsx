import { Button, Flex, Grid } from "@edifice.io/react";
import { IconRafterLeft, IconRafterRight } from "@edifice.io/react/icons";
import useStepNavigation from "~/hooks/useStepNavigations";
import Stepper from "~/components/Stepper";

export const WizardLayout = ({
  children,
  steps,
  sideElement,
}: {
  children: React.ReactElement;
  steps: string[];
  sideElement: React.ReactElement;
}) => {
  const { currentStep, nextStep, backStep } = useStepNavigation(steps);

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
        {sideElement}
      </Grid.Col>
    </Grid>
  );
};
