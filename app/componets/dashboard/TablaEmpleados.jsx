"use client";
import { Badge, Box, Flex, Input, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import ButtonCustom from "../buttons/ButtonCustom";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useAuth } from "@/app/libs/AuthProvider";
import moment from 'moment-timezone'


export default function TablaEmpleados() {

    const { directus, readItems } = useAuth();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);


    const [empleados, setEmpleados] = useState([]);


    const handleChange = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    }
 
    const fetchEmpleados = async () => {
        try {
            const queryFilter = {
                _and: [
                    {
                        egreso: {
                            _null: true
                        }
                    }
                ]
            };

            if (search) {
                queryFilter._and.push(
                    {
                        _or: [
                            {
                                empleado: {
                                    _eq: search
                                }
                            },
                            {
                                empleado_descripcion: {
                                    _icontains: search
                                }
                            }
                        ]
                    },
                );
            }
            const result = await directus.request(
                readItems("fichada", {
                    filter: {
                        ...queryFilter
                    },
                    limit: -1,
                })
            )
            return result;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await fetchEmpleados();
        setEmpleados(result);
    }

    const formatDate = (date) => {
        if (!date) return "";
        return moment(date).tz("America/Argentina/Buenos_Aires").format("DD/MM/YYYY HH:mm:ss");
    }

    useEffect(() => {
        const fetchData = async () => {
            let results = [];
            const data = await fetchEmpleados();
            results = data || [];
            setEmpleados(results);
        }

        fetchData();
    }, [debouncedSearch])

    return (
        <>
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
                                placeholder={"Buscar Empleado"}
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

            <Box mt={4}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Empleado</Th>
                            <Th>Ingreso</Th>
                            <Th>Estado</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            empleados.map((item) => (
                                <Tr key={item.id}>
                                    <Td>{item.empleado_descripcion}</Td>
                                    <Td>{formatDate(item.ingreso)}</Td>
                                    <Td>{item.ingreso && <Badge colorScheme={"green"}>Activo</Badge>}</Td>
                                </Tr>
                            ))
                        }
                    </Tbody>
                </Table>
            </Box>
        </>
    )
}