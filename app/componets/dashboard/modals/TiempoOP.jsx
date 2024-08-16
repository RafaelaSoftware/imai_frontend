import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Box,
  Input,
  useDisclosure,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from "@chakra-ui/react";
import ButtonCustom from "../../buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

export default function TiempoOP({ isOpen, onClose }) {
  const { directus, readItems } = useAuth();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [ordenes, setOrdenes] = useState([]);

  const fetchOrdenes = async () => {
    try {
      const result = await directus.request(
        readItems("parte", {
          filter: {
            _and: [
              { ordenProduccion: { _eq: search } },
              //    {fin: { _null: false } },
            ],
          },
        })
      );
      const resultFiltered = handleFilter(result);
      return resultFiltered;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  const handleFilter = (result) => {
    const grouped = result.reduce((acc, item) => {
      if (!acc[item.tarea]) {
        acc[item.tarea] = {
          tarea: `${item.tarea}-${item.tarea_descripcion}`,
          tiempoAcumulado: 0,
        };
      }
      const fin = item.fin
        ? item.fin
        : new Date().setHours(new Date().getHours() + 3);
      const duracion = (new Date(fin) - new Date(item.inicio)) / 3600000;
      acc[item.tarea].tiempoAcumulado += duracion;
      return acc;
    }, {});

    return Object.values(grouped).map((item) => ({
      ...item,
      tiempoAcumulado: item.tiempoAcumulado.toFixed(2),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await fetchOrdenes();
    setOrdenes(result || []);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      let result = await fetchOrdenes();
      setOrdenes(result || []);
    };
    fetchData();
  }, [debouncedSearch]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Listado Orden Producción</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex alignItems={"center"} justifyContent={"flex-end"}>
            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
              }}
            >
              <Flex width={"full"} justifyContent={"center"} gap={4}>
                <Box width={"50%"}>
                  <Input
                    id={"search"}
                    name={"search"}
                    type={"text"}
                    placeholder={"Buscar Orden de Producción"}
                    value={search}
                    onChange={handleChange}
                    variant="filled"
                    borderRadius="30"
                    size="lg"
                    bgColor="white"
                    color="#C0C0C0"
                    borderColor="#C0C0C0"
                    _focus={{
                      borderColor: "own",
                    }}
                  />
                </Box>
                <ButtonCustom width={"max-content"} type={"submit"}>
                  Buscar
                </ButtonCustom>
              </Flex>
            </form>
          </Flex>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Tarea</Th>
                <Th>Tiempo acumulado</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ordenes.map((item) => (
                <Tr key={item.tarea}>
                  <Td>{item.tarea}</Td>
                  <Td>{item.tiempoAcumulado} hs</Td>
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
