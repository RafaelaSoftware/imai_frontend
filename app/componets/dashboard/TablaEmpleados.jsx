"use client";
import {
  Badge,
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import ButtonCustom from "../buttons/ButtonCustom";
import { useState } from "react";

import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import SearchEmpleados from "./SearchEmpleados";
import DetallesParte from "./modals/DetallesParte";
import { formatDate } from "@/app/libs/utils";

export default function TablaEmpleados() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [empleados, setEmpleados] = useState([]);

  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

  const handleSelectedEmpleado = (empleado) => () => {
    setSelectedEmpleado(empleado);
    onOpen();
  };

  return (
    <>
      <SearchEmpleados setEmpleados={setEmpleados} />

      <Box mt={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Empleado</Th>
              <Th>Ingreso</Th>
              <Th>Estado</Th>
              <Th>Acción</Th>
            </Tr>
          </Thead>
          <Tbody>
            {empleados.map((item) => (
              <Tr key={item.id}>
                <Td>{item.empleado_descripcion}</Td>
                <Td>{formatDate(item.ingreso)}</Td>
                <Td>
                  {item.ingreso && (
                    <Badge colorScheme={item.parte ? "green" : "gray"}>
                      {item.parte ? "En curso" : "Disponible"}
                    </Badge>
                  )}
                </Td>

                <Td>
                  <ButtonCustom
                    width={"max-content"}
                    borderRadius={"4"}
                    size={"xs"}
                    onClick={handleSelectedEmpleado(item)}
                    isDisabled={!item.parte}
                  >
                    <FaArrowUpRightFromSquare />
                  </ButtonCustom>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {selectedEmpleado && (
        <DetallesParte
          isOpen={isOpen}
          onClose={onClose}
          empleado={selectedEmpleado}
        />
      )}
    </>
  );
}
