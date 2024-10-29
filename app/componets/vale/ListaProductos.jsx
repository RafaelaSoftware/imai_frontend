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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import ButtonCustom from "../buttons/ButtonCustom";
import { createRef, useEffect, useRef, useState } from "react";
import moment from "moment";
import ItemProducto from "./ItemProducto";
import { v4 as uuidv4 } from "uuid";

export const ListaProductos = ({
  isOpen,
  onClose,
  onSubmit,
  productos,
  empleado,
  ordenproduccion,
  producto,
  reset,
}) => {
  const [list, setList] = useState([]);

  const inputs = productos.map(() => createRef());

  const handleSubmit = async () => {
    const result = list.map((item) => {
      return {
        empleado,
        ordenproduccion,
        producto: item.certificado ? item.certificado : item.producto,
        cantidad: item.cantidad,
      };
    });
    await onSubmit(result);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const products = productos.sort((a, b) =>
        moment(b.fecha).diff(moment(a.fecha))
      );
      setList(products);
    }
    return () => {
      setList([]);
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={"6xl"}
      scrollBehavior={"inside"}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={"3xl"}>Lista de productos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {list.length > 0 && (
            <Box>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th fontSize={"xs"} whiteSpace={"nowrap"}>
                      Productos a consumir
                    </Th>
                    <Th fontSize={"xs"}>Descripción</Th>
                    <Th fontSize={"xs"}>Cantidad</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {list.map((item, index) => (
                    <ItemProducto
                      key={uuidv4()}
                      item={item}
                      index={index}
                      inputs={inputs}
                      onSubmit={handleSubmit}
                      empleado={empleado}
                      ordenproduccion={ordenproduccion}
                      setList={setList}
                      reset={reset}
                    />
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button size={"lg"} borderRadius={"full"} mr={3} onClick={onClose}>
            Cerrar
          </Button>
          <ButtonCustom maxWidth={"max-content"} onClick={() => handleSubmit()}>
            Guardar
          </ButtonCustom>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
