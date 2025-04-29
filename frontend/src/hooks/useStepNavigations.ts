// src/hooks/useStepNavigation.js
import { useNavigate, useLocation } from "react-router-dom";
import { WIZARD_STEPS } from "~/config/constants";

export default function useStepNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const currentStep = WIZARD_STEPS.findIndex((step) =>
    currentPath.includes(step)
  );

  const nextStep = () => {
    const nextIndex = currentStep + 1;
    if (nextIndex < WIZARD_STEPS.length) {
      navigate(`/create/${WIZARD_STEPS[nextIndex]}`);
    }
  };

  const backStep = () => {
    const prevIndex = currentStep - 1;
    if (prevIndex >= 0) {
      navigate(`/create/${WIZARD_STEPS[prevIndex]}`);
    }
  };

  return {
    currentStep,
    nextStep,
    backStep,
  };
}
