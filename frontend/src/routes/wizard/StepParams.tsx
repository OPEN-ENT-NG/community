import {
  Flex,
  FormControl,
  Input,
  Label,
  Select,
  TextArea,
} from "@edifice.io/react";
import { Form } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
  MAX_COMMUNITY_NAME_LENGTH,
  MAX_COMMUNITY_NOTE_LENGTH,
} from "~/config/constants";
import { IconCalendarLight } from "@edifice.io/react/icons";
import { CommunityParams } from "~/models/community";
import useWizard from "~/hooks/useWizard";
import useStepNavigation from "~/hooks/useStepNavigations";
import { flushSync } from "react-dom";
import ButtonFooter from "./ButtonFooter";
import useDataListYears from "~/hooks/useDataListYears";

export const StepParams = () => {
  const { wizardData, updateWizardData } = useWizard();
  const { nextStep } = useStepNavigation();

  const { watch, register, control, setValue, handleSubmit } =
    useForm<CommunityParams>({
      defaultValues: wizardData.communityParams,
    });

  const { startYears, endYears, startYear, endYear } = useDataListYears({
    watch,
    setValue,
  });

  const onSubmit = (data: any) => {
    flushSync(() => {
      updateWizardData({ communityParams: data });
    });
    nextStep();
  };

  return (
    <>
      <Form id="formCommunity" role="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="inputForm" className="mb-24" isRequired>
          <Label>Nom de la communauté</Label>
          <Input
            type="text"
            {...register("title", {
              required: true,
              maxLength: MAX_COMMUNITY_NAME_LENGTH,
              pattern: {
                value: /[^ ]/,
                message: "invalid title",
              },
            })}
            size="md"
            maxLength={MAX_COMMUNITY_NAME_LENGTH}
            placeholder={"Nom de la communauté"}
            autoFocus={true}
          ></Input>
          <p className="small text-gray-700 p-2 text-end">
            {`${watch("title", "").length || 0} / ${MAX_COMMUNITY_NAME_LENGTH}`}
          </p>
        </FormControl>
        <Flex gap="16">
          <div className="col">
            <FormControl id="dateForm" className="mb-24" isRequired>
              <Label>Année scolaire | Début</Label>

              <Controller
                name="startYear"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    icon={<IconCalendarLight />}
                    block
                    size="md"
                    value={value}
                    onValueChange={(v) => {
                      onChange(v);
                    }}
                    options={startYears}
                    placeholderOption={startYear}
                  />
                )}
              />
            </FormControl>
          </div>
          <div className="col">
            <FormControl id="dateForm" className="mb-24" isRequired>
              <Label>Année scolaire | Fin</Label>
              <Controller
                name="endYear"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    icon={<IconCalendarLight />}
                    block
                    size="md"
                    value={value}
                    onValueChange={(v) => onChange(v)}
                    options={endYears}
                    placeholderOption={endYear}
                  />
                )}
              />
            </FormControl>
          </div>
        </Flex>
        <FormControl id="noteForm" className="mb-24" isRequired>
          <Label>Note d'accueil</Label>
          <TextArea
            placeholder="Note d'acceuil de la communauté"
            size="md"
            maxLength={MAX_COMMUNITY_NOTE_LENGTH}
            {...register("note", {
              required: true,
              maxLength: MAX_COMMUNITY_NAME_LENGTH,
            })}
          />
          <Flex justify="between">
            <p className="small text-gray-700 p-2 text-end">
              Ce message accompagnera votre invitation à rejoindre la communauté
            </p>
            <p className="small text-gray-700 p-2 text-end">
              {`${watch("note", "").length || 0} / ${MAX_COMMUNITY_NOTE_LENGTH}`}
            </p>
          </Flex>
        </FormControl>
      </Form>
      <ButtonFooter isSubmitStep />
    </>
  );
};

export default StepParams;
