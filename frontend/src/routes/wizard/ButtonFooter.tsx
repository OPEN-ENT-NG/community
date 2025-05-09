import { Button, Flex } from "@edifice.io/react";
import { WIZARD_STEPS } from "~/config/constants";
import { IconRafterLeft, IconRafterRight } from "@edifice.io/react/icons";
import useStepNavigation from "~/hooks/useStepNavigations";

export const ButtonFooter = ({
  isSubmitStep = false,
  isValidForm = false,
}: {
  isSubmitStep?: boolean;
  isValidForm?: boolean;
}) => {
  const { currentStep, nextStep, backStep } = useStepNavigation();

  return (
    <Flex justify="between" className="mt-auto">
      <Button
        variant="ghost"
        color="tertiary"
        leftIcon={<IconRafterLeft />}
        disabled={currentStep <= 0}
        onClick={backStep}
      >
        Précédent
      </Button>
      {isSubmitStep ? (
        <Button
          type="submit"
          form="formCommunity"
          rightIcon={<IconRafterRight />}
          disabled={currentStep >= WIZARD_STEPS.length - 1 || !isValidForm}
        >
          Suivant
        </Button>
      ) : (
        <Button
          rightIcon={<IconRafterRight />}
          disabled={currentStep >= WIZARD_STEPS.length - 1}
          onClick={nextStep}
        >
          Suivant
        </Button>
      )}
    </Flex>
  );
};

export default ButtonFooter;
