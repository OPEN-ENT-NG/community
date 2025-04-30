import { Heading } from "@edifice.io/react";

export default function WizardHeader({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) {
  return (
    <>
      <Heading>{title}</Heading>
      <p className="text-gray-700 mb-48">{subTitle}</p>
    </>
  );
}
