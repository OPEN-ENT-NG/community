import { Flex } from "@edifice.io/react";
import clsx from "clsx";
import { WIZARD_STEPS } from "~/config/constants";

function Step({ active = false }: { active?: boolean }) {
  const style = {
    width: active ? "40px" : "20px",
    height: "8px",
    transition: "width 0.3s ease, background-color 0.3s ease",
  };
  const classes = clsx(
    "rounded transition-all duration-300",
    active && "bg-secondary",
    !active && "bg-secondary-300",
  );
  return <div className={classes} style={style}></div>;
}

export default function Stepper({
  current = 0,
  className = "",
}: {
  current: number | undefined;
  className: string;
}) {
  return (
    <Flex gap="8" className={className}>
      {WIZARD_STEPS.map((label, index) => (
        <Step key={label} active={index === current} />
      ))}
    </Flex>
  );
}