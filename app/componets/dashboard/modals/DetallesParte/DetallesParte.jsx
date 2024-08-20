import { formatDate } from "@/app/libs/utils";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ParteEnCurso from "./ParteEnCurso";

export default function DetallesParte({
  isOpen,
  onClose,
  empleado,
  setRefresh,
}) {
  const [parteEnCurso, setParteEnCurso] = useState(null);
  const [partesHoy, setPartesHoy] = useState([]);

  useEffect(() => {
    const enCurso = empleado.partes.find((parte) => parte.fin === null) || null;
    setParteEnCurso(enCurso);
    const partesHoyFilter = empleado.partes.filter(
      (partes) => partes.fin != null
    );
    setPartesHoy(partesHoyFilter);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={"3xl"}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size={"md"}>Parte Activo</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading size={"md"}>
            Empleado:{" "}
            <Box as="span" fontWeight={"normal"}>
              {empleado.empleado_descripcion}
            </Box>
          </Heading>

          {parteEnCurso && (
            <ParteEnCurso
              parteEnCurso={parteEnCurso}
              setParteEnCurso={setParteEnCurso}
              setRefresh={setRefresh}
            />
          )}

          {partesHoy.length > 0 && (
            <Box mt={4}>
              <Heading size={"md"}>Historial hoy:</Heading>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Orden Producción</Th>
                    <Th>Tarea</Th>
                    <Th>Inicio</Th>
                    <Th>Fin</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {partesHoy
                    .sort((a, b) => new Date(b.inicio) - new Date(a.inicio))
                    .map((parte) => (
                      <Tr key={parte.id}>
                        <Td>{parte.ordenProduccion_descripcion}</Td>
                        <Td>
                          {parte.tarea} - {parte.tarea_descripcion}
                        </Td>
                        <Td>{formatDate(parte.inicio)}</Td>
                        <Td>{formatDate(parte.fin)}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
