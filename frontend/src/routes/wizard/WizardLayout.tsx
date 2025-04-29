import { Flex, Grid, useBreakpoint } from "@edifice.io/react";
import useStepNavigation from "~/hooks/useStepNavigations";
import Stepper from "~/components/Stepper";
import ButtonFooter from "./ButtonFooter";

export const WizardLayout = ({
  children,
  sideElement,
}: {
  children: React.ReactElement;
  sideElement: React.ReactElement;
}) => {
  const { currentStep } = useStepNavigation();
  const { lg } = useBreakpoint();

  return (
    <Grid className="flex-grow-1 py-64 gap-64 px-48">
      <Grid.Col sm="4" md="8" lg="5" xl="7" className="ms-64">
        <Flex
          direction="column"
          className="h-100"
          style={{ paddingRight: lg ? "40px" : "0" }}
        >
          <Stepper current={currentStep} className="mb-48" />
          {children}
        </Flex>
      </Grid.Col>
      {lg && (
        <Grid.Col
          sm="0"
          md="0"
          lg="3"
          xl="5"
          className="overflow-hidden rounded-5 ms-64"
        >
          {sideElement}
        </Grid.Col>
      )}
    </Grid>
  );
};
