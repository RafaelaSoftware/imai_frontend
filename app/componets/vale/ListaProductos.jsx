import {
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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import ButtonCustom from "../buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import useCustomInput from "@/app/hooks/useCustomInput";
import { createRef, useEffect, useRef, useState } from "react";
import InputField from "../inputs/InputField";
import moment from "moment";

const ItemProducto = ({
  item,
  index,
  inputs,
  onSubmit,
  empleado,
  ordenproduccion,
}) => {
  const { isOperario } = useAuth();
  let inputRefCantidad = inputs[index];
  const cantidad = useCustomInput(
    item.cantidad,
    "cantidad",
    inputRefCantidad,
    inputs[index + 1],
    false
  );

  useEffect(() => {
    if (inputRefCantidad != null && index === 0) {
      inputRefCantidad.current.focus();
    }
  }, [inputRefCantidad, index]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const canMoveToNextInput = index < inputs.length - 1;
      const isLastInput = index === inputs.length - 1;

      if (canMoveToNextInput) {
        cantidad.handleKeyDown(e);
      } else if (isLastInput) {
        item.cantidad = cantidad.value;

        onSubmit({
          empleado,
          ordenproduccion,
          producto: item.certificado ? item.certificado : item.producto,
          catidad: cantidad.value,
        });
      }
    }
  };

  return (
    <Tr>
      <Td fontSize={isOperario ? "3xl" : "xs"}>
        {item.producto ? item.producto : item.certificado}
      </Td>
      <Td fontSize={isOperario ? "3xl" : "xs"} lineHeight={"30px"}>
        {item.descripcion}
      </Td>
      <Td fontSize={isOperario ? "3xl" : "xs"}>
        <Box flex={1} maxW={"400px"}>
          <InputField
            id="cantidad"
            type="number"
            placeholder="Cant"
            onChange={cantidad.handleChange}
            onKeyDown={handleKeyDown}
            message={cantidad.message}
            inputRef={inputRefCantidad}
            height="130px"
          />
        </Box>
      </Td>
    </Tr>
  );
};

export const ListaProductos = ({
  isOpen,
  onClose,
  onSubmit,
  productos,
  empleado,
  ordenproduccion,
  producto,
}) => {
  const { isOperario } = useAuth();
  const [list, setList] = useState([]);

  const inputs = productos.map(() => createRef());

  useEffect(() => {
    if (isOpen) {
      const products = productos.sort((a, b) =>
        moment(b.fecha).diff(moment(a.fecha))
      );
      setList(products);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={"6xl"}
      scrollBehavior={"inside"}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Lista de productos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {list.length > 0 && (
            <Box>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th
                      fontSize={isOperario ? "3xl" : "xs"}
                      whiteSpace={"nowrap"}
                    >
                      Productos a consumir
                    </Th>
                    <Th fontSize={isOperario ? "3xl" : "xs"}>Descripción</Th>
                    <Th fontSize={isOperario ? "3xl" : "xs"}>Cantidad</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {list.map((item, index) => (
                    <ItemProducto
                      key={index}
                      item={item}
                      index={index}
                      inputs={inputs}
                      onSubmit={onSubmit}
                      empleado={empleado}
                      ordenproduccion={ordenproduccion}
                    />
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cerrar
          </Button>
          <ButtonCustom maxWidth={"max-content"}>Guardar</ButtonCustom>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
