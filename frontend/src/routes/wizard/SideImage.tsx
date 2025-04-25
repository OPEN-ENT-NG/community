import { Image } from "@edifice.io/react";
import { useEffect, useState } from "react";
import { useWizardContext } from "./WizardContext";
import imageClasse from "../../assets/images/community-classe.png";
import imageTheme from "../../assets/images/community-theme.png";

export const SideImage = () => {
  const { wizardData } = useWizardContext();
  const [imageCommunity, setImageCommunity] = useState(imageClasse);

  useEffect(() => {
    setImageCommunity(() =>
      wizardData.type === "classe" ? imageClasse : imageTheme,
    );
  }, [wizardData.type]);

  return <>
    <Image style={{ height: "100%" }} alt="type" src={imageCommunity} />
  </>;
};

export default SideImage;
