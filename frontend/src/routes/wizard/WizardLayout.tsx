import { Button, Flex, Grid, useBreakpoint } from "@edifice.io/react";
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
  const { lg } = useBreakpoint();

  return (
    <Grid className="my-64 px-lg-48 px-sm-12">
      <Grid.Col sm="4" md="8" lg="5" xl="7">
        <Flex
          direction="column"
          className="h-100"
          style={{ paddingRight: lg ? "40px" : "0" }}
        >
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
      {lg && (
        <Grid.Col
          sm="0"
          md="0"
          lg="3"
          xl="5"
          className="overflow-hidden rounded-5"
        >
          {sideElement}
        </Grid.Col>
      )}
    </Grid>
  );
};
