import {
  Alert,
  Combobox,
  Flex,
  Tooltip,
  useBreakpoint,
} from "@edifice.io/react";
import { IconInfoCircle } from "@edifice.io/react/icons";
import InvitationTable from "./InvitationTable";

export const StepInvitations = () => {
  const { lg } = useBreakpoint();
  return (
    <>
      <div className="mb-24">
        <Alert type="info" className="mb-24">
          <p>
            Ajouter un groupe revient à envoyer des invitations individuelles à
            chaque membre du groupe.
          </p>{" "}
          <p>
            <span style={{ fontWeight: "bold" }}>Droits</span> : les
            "administrateurs" peuvent collaborer et administrer la communauté et
            ses membres ; les "membres" sont lecteurs uniquement.
          </p>
        </Alert>
        <Flex className="mb-12" align="center" wrap="nowrap" gap="8">
          <div className="h4">Rechercher et ajouter des utilisateurs</div>{" "}
          <Tooltip
            message={
              "Vos favoris de partage s’affichent en priorité dans votre liste lorsque vous recherchez un groupe ou une personne, vous pouvez les retrouver dans l’annuaire."
            }
            placement="top"
          >
            <IconInfoCircle className="c-pointer" height="18" />
          </Tooltip>
        </Flex>
        <Combobox
          placeholder={"Rechercher nom d’utilisateur, groupes, favoris, ..."}
          onSearchInputChange={function Ki() {}}
          onSearchResultsChange={function Ki() {}}
          isLoading={false}
          noResult={false}
          options={[
            {
              label: "Second Item",
              value: "Second Item",
            },
          ]}
          searchMinLength={1}
          value=""
        />
      </div>
      {!lg && <InvitationTable />}
    </>
  );
};

export default StepInvitations;
