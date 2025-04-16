import { createContext, useContext } from "react";
import { useWizardProps } from "~/hooks/useWizard";

type OmittedProps = Omit<useWizardProps, "triggerRef" | "menuRef">;
export interface WizardContextProps extends OmittedProps {
  block?: boolean;
}

export const WizardContext = createContext<WizardContextProps | null>(null!);

export const useWizardContext = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error(`Cannot be rendered outside the Wizard Layout`);
  }
  return context;
};
