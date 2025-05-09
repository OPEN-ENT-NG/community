import {
  Avatar,
  Checkbox,
  Flex,
  IconButton,
  Image,
  Table,
  useBreakpoint,
} from "@edifice.io/react";
import { IconClose } from "@edifice.io/react/icons";
import ArrowHelp from "../../assets/images/arrow-help.svg";

export const InvitationTable = () => {
  const { lg } = useBreakpoint();

  const membersList = [
    {
      id: 1,
      name: "Jean Dupont",
      role: "Administrateur",
    },
  ];
  return (
    <>
      <div
        id="invitation-table"
        className="position-relative"
        style={{
          flex: "0 1 auto",
          height: lg ? "100%" : "",
        }}
      >
        <Table maxHeight={lg ? "100%" : "430px"}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th></Table.Th>
              <Table.Th>Membre ({membersList.length + 1})</Table.Th>
              <Table.Th>Rôle</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <Checkbox onChange={() => {}} />
              </Table.Td>
              <Table.Td>
                <div className="d-flex gap-8 align-items-center">
                  <Avatar alt="alternative text" size="xs" variant="circle" />
                  <div>Moi - </div>
                  <div style={{ color: "#46bfaf" }}>Enseignant</div>
                </div>
              </Table.Td>
              <Table.Td>
                <div className="d-flex gap-8 align-items-center">
                  <div>Administrateur</div>
                </div>
              </Table.Td>
              <Table.Td>
                <IconButton
                  variant="ghost"
                  color="tertiary"
                  icon={<IconClose />}
                />
              </Table.Td>
            </Table.Tr>
            {membersList.map((member, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Checkbox onChange={() => {}} />
                </Table.Td>
                <Table.Td>
                  <div className="d-flex gap-8 align-items-center">
                    <Avatar alt="alternative text" size="xs" variant="circle" />
                    <div>{member.name} - </div>
                    <div style={{ color: "#46bfaf" }}>Enseignant</div>
                  </div>
                </Table.Td>
                <Table.Td>
                  <div className="d-flex gap-8 align-items-center">
                    <div>{member.role}</div>
                  </div>
                </Table.Td>
                <Table.Td>
                  <IconButton
                    variant="ghost"
                    color="tertiary"
                    icon={<IconClose />}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Flex
          direction="column"
          justify="center"
          className="bg-gray-200 flex-grow-1 placeholder-table"
        >
          {membersList.length === 0 && (
            <Flex
              align="center"
              justify="center"
              style={{ paddingTop: "60px" }}
            >
              <Image src={ArrowHelp} alt="" className="pe-12" />
              <p className="text-center small" style={{ width: "323px" }}>
                Pour ajouter des membres dans votre communauté, utilisez la{" "}
                <span className="underline-custom text-blue text-bold">
                  barre de recherche
                </span>{" "}
                ci-contre !
              </p>
            </Flex>
          )}
        </Flex>
      </div>
    </>
  );
};

export default InvitationTable;
