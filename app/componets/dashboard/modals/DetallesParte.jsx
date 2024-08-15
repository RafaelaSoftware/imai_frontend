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
  Text,
  Box,
} from "@chakra-ui/react";

export default function DetallesParte({ isOpen, onClose, empleado }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Parte Activo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            <Box as="span" fontWeight={"bold"}>
              Empleado:
            </Box>{" "}
            {empleado.empleado_descripcion}
          </Text>
          <Text>
            <Box as="span" fontWeight={"bold"}>
              Orden Producción:
            </Box>{" "}
            {empleado.parte.ordenProduccion_descripcion}
          </Text>
          <Text>
            <Box as="span" fontWeight={"bold"}>
              Desde:
            </Box>{" "}
            {formatDate(empleado.parte.inicio)}
          </Text>
          <Text>
            <Box as="span" fontWeight={"bold"}>
              Tarea:
            </Box>{" "}
            {empleado.parte.tarea} - {empleado.parte.tarea_descripcion}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
