import { Flex } from "@edifice.io/react";
import clsx from 'clsx';

function Step({
  active = false,
}: {
  active?: boolean;
}) {
  const style = {
    width: active ? '40px' : '20px',
    height: '8px',
    transition: 'width 0.3s ease, background-color 0.3s ease',
  };
  const classes = clsx(
    "rounded transition-all duration-300",
    active && "bg-secondary",
    !active && "bg-secondary-300"
  );
  return <div
    className={classes}
    style={style}
  ></div>
}

export default function Stepper({ steps, current = steps[0] }: { steps: string[], current: string | undefined}) {
  return (
    <div className="p-8">
      <Flex gap="8">
        {steps.map(label => (
          <Step
            key={label}
            active={label === current}
          />
        ))}
      </Flex>
    </div>
  );
}