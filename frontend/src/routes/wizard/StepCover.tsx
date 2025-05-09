import ButtonFooter from "./ButtonFooter";
import { useWizardContext } from "./WizardContext";
import { Flex, Radio, useBreakpoint, useMediaLibrary } from "@edifice.io/react";
import { BACKGROUND_COLORS } from "~/config/constants";
import { ImagePicker, MediaLibrary } from "@edifice.io/react/multimedia";
import clsx from "clsx";
import SideSkeleton from "./SideSkeleton";

const RadioCardCover = ({
  children,
  label,
  value,
}: {
  children: JSX.Element;
  label: string;
  value: "color" | "image";
}) => {
  const { wizardData } = useWizardContext();
  const colorBoxlassName = clsx(
    "border border-2 rounded p-24 mb-24",
    wizardData.communityCover[value] && "border-primary",
  );
  const checked = wizardData.communityCover[value] ? true : false;
  return (
    <Flex gap="24" direction="column" className={colorBoxlassName}>
      <Flex justify="between">
        <span className="h4">{label}</span>
        <Radio model="cover" value={value} defaultChecked={checked} />
      </Flex>
      {children}
    </Flex>
  );
};

export const StepCover = () => {
  const { wizardData, updateWizardData } = useWizardContext();
  const selectColor = (color: string) => {
    updateWizardData({ communityCover: { color } });
  };
  const { lg } = useBreakpoint();

  const {
    ref: mediaLibraryRef,
    libraryMedia,
    ...MediaLibraryHandlers
  } = useMediaLibrary();

  return (
    <>
      {!lg && <SideSkeleton />}

      <RadioCardCover value="color" label="Choisir un thème">
        <Flex gap="8">
          {BACKGROUND_COLORS.map((color, index) => {
            const className = clsx(
              "rounded cursor-pointer h-100",
              wizardData.communityCover.color === color &&
                "border border-3 border-primary",
            );

            return (
              <div
                key={index}
                role="button"
                onClick={() => selectColor(color)}
                style={{
                  height: 46,
                  flex: 1,
                }}
              >
                <div
                  className={className}
                  style={{
                    background: `linear-gradient(${color})`,
                  }}
                ></div>
              </div>
            );
          })}
        </Flex>
      </RadioCardCover>

      <RadioCardCover value="image" label="Importer une image">
        <ImagePicker
          appCode="blog"
          addButtonLabel="Add image"
          libraryMedia={libraryMedia}
          mediaLibraryRef={mediaLibraryRef}
          deleteButtonLabel="Delete image"
          onDeleteImage={() => {}}
          onUploadImage={() => {}}
        />
      </RadioCardCover>

      <MediaLibrary
        {...MediaLibraryHandlers}
        appCode="blog"
        visibility="protected"
        ref={mediaLibraryRef}
      />

      <ButtonFooter />
    </>
  );
};

export default StepCover;
