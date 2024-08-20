import {
  Badge,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import moment from "moment";

export default function ResumenOP({ isOpen, onClose, op }) {
  const formatDate = (date) => {
    if (!date) return "";
    return moment(date)
      .tz("America/Argentina/Buenos_Aires")
      .subtract(3, "hours")
      .locale("es")
      .format("DD/MM hh:mm A");
  };
  4;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={"4xl"}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Resumen - {op.ordenProduccion_descripcion}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text>
              <Box as="span" fontWeight={"bold"}>
                Tarea:
              </Box>{" "}
              {op.tarea}
            </Text>
            <Text>
              <Box as="span" fontWeight={"bold"}>
                Orden de Produccion:
              </Box>
              {"  "}
              {op.ordenProduccion}
            </Text>
          </Box>
          <Table mt={4}>
            <Thead>
              <Tr>
                <Th>Empleado</Th>
                <Th>Inicio</Th>
                <Th>Fin</Th>
              </Tr>
            </Thead>

            <Tbody>
              {op.tareasIndividuales
                .sort((a, b) => new Date(b.inicio) - new Date(a.inicio))
                .map((tarea) => (
                  <Tr key={tarea.id}>
                    <Td>{tarea.empleado_descripcion}</Td>
                    <Td>{formatDate(tarea.inicio)}</Td>
                    <Td>
                      {!tarea.fin ? (
                        <Badge colorScheme={"green"}>En curso</Badge>
                      ) : (
                        formatDate(tarea.fin)
                      )}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
