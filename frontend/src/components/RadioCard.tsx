import { Radio, Flex } from "@edifice.io/react";
import clsx from 'clsx';

type RadioCardProps = {
  label: string;
  onChange: (value: string) => void;
  selectedValue: string;
  value: string;
  className?: string;
  description?: string;
  model?: string;
};

export default function RadioCard({
  label,
  onChange,
  selectedValue,
  value,
  className,
  description,
  model = "",
}: RadioCardProps) {
  const isSelected = selectedValue === value;
  const classes = clsx(
    "border py-24 border-2 rounded-3",
    isSelected && "border-info",
    !isSelected && "border-light",
    className,
  );
  return (
    <label role="button" className={classes}>
      <Flex justify="between" className="px-24">
        <h4 className="mb-8">{label}</h4>
        <Radio
          model={model}
          name="group"
          value={value}
          checked={isSelected}
          onChange={() => onChange(value)}
        />
      </Flex>
      {description && (
        <p className="px-24 text-gray-700 pe-32">{description}</p>
      )}
    </label>
  );
}
