import { Radio, Flex } from "@edifice.io/react";
import clsx from 'clsx';

type RadioCardProps = {
  label: string;
  value: string;
  selectedValue: string;
  description?: string;
  onChange: (value: string) => void;
  model?: string;
  className?: string;
};

/**
 * Usage :
  const [selected, setSelected] = useState("");
  
  <RadioCard
    className="mb-16"
    label="Pour une classe"
    value="classe"
    description="Recréez votre classe pour diffuser facilement des documents et ressources aux élèves, leur communiquer des informations essentielles, etc."
    selectedValue={selected}
    onChange={setSelected}
  />
  <RadioCard
    label="Option 2"
    value="option2"
    description="lorem ipsum"
    selectedValue={selected}
    onChange={setSelected}
  />
 */
export default function RadioCard({
  label,
  value,
  selectedValue,
  onChange,
  description,
  model="",
  className
}: RadioCardProps) {
  const isSelected = selectedValue === value;
  const classes = clsx(
    "border py-24 border-2 rounded",
    isSelected && "border-info",
    !isSelected && "border-light",
    className,
  );
  return (
    <label
      role="button"
      className={classes}
    >
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
      {description && <p className="px-24 text-gray-700 pe-32">{description}</p>}
    </label>
  );
}
