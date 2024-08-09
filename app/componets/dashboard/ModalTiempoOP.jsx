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
  } from '@chakra-ui/react';
import ButtonCustom from '../buttons/ButtonCustom';
import { useAuth } from '@/app/libs/AuthProvider';
import { useState } from 'react';

export default function ModalTiempoOP({isOpen, onClose}) {
    const {directus, readItems} = useAuth();

    const [search, setSearch] = useState("");
    const [ordenes, setOrdenes] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await fetchOrdenes();
        setOrdenes(result || []);
    }

    const handleChange = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    }

    const fetchOrdenes = async () => {
        try{
            const result = await directus.request(
                readItems("parte", {
                    filter: {
                        ordenProduccion: {_eq: search}
                    }
                })
            )

            return result;
        }catch(error){
            console.log(error)
            return [];
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Listado Orden Producción</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex alignItems={"center"} justifyContent={"flex-end"}>
                <form onSubmit={handleSubmit} style={{
                    width: "100%",
                }}>
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
                        <ButtonCustom
                            width={"max-content"}
                            type={"submit"}
                        >
                            Buscar
                        </ButtonCustom>
                    </Flex>
                </form>
            </Flex>


            <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Orden Produccion</Th>
                            <Th>Tarea</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            ordenes.map((item) => (
                                <Tr key={item.id}>
                                    <Td>xx</Td>
                                    <Td>xx</Td>
                                    <Td>xx</Td>
                                </Tr>
                            ))
                        }
                    </Tbody>
                </Table>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}
