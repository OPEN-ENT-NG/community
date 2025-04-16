// src/hooks/useStepNavigation.js
import { useNavigate, useLocation } from "react-router-dom";

export default function useStepNavigation(steps: string[]) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const currentStep = steps.findIndex((step) => currentPath.includes(step));

  const nextStep = () => {
    const nextIndex = currentStep + 1;
    if (nextIndex < steps.length) {
      navigate(`/create/${steps[nextIndex]}`);
    }
  };

  const backStep = () => {
    const prevIndex = currentStep - 1;
    if (prevIndex >= 0) {
      navigate(`/create/${steps[prevIndex]}`);
    }
  };

  return {
    currentStep,
    nextStep,
    backStep,
  };
}
