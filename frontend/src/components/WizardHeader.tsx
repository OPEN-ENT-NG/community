import { Heading } from "@edifice.io/react";

export default function WizardHeader({
  title,
  subTitle,
}: {
  title: string;
  subTitle?: string;
}) {
  return (
    <div className="mb-24">
      <Heading>{title}</Heading>
      {subTitle && <p className="text-gray-700">{subTitle}</p>}
    </div>
  );
}
