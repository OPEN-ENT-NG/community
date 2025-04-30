import { Image, useBreakpoint } from "@edifice.io/react";
import { useEffect, useState } from "react";
import { useWizardContext } from "./WizardContext";
import imageClasse from "../../assets/images/community-classe.png";
import imageTheme from "../../assets/images/community-theme.png";

export const SideImage = () => {
  const { wizardData } = useWizardContext();
  const { lg } = useBreakpoint();
  const [imageCommunity, setImageCommunity] = useState(imageClasse);

  useEffect(() => {
    setImageCommunity(() =>
      wizardData.communityType.type === "classe" ? imageClasse : imageTheme
    );
  }, [wizardData.communityType.type]);

  const className = lg
    ? "w-100 h-100"
    : "position-relative overflow-hidden mb-24 rounded-3";
  const style = lg ? { minHeight: "700px" } : { height: "104px" };

  return (
    <div className={className} style={style}>
      <Image
        className="object-fit-cover w-100 h-100"
        alt="type"
        src={imageCommunity}
      />
    </div>
  );
};

export default SideImage;
