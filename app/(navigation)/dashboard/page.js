import ButtonCustom from "@/app/componets/buttons/ButtonCustom";
import InputField from "@/app/componets/inputs/InputField";
import { Box, Flex, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export default function DashboradPage(){
    return (
        <>
        <Flex alignItems={"center"} justifyContent={"flex-end"}>
            <Flex width={"full"} justifyContent={"center"} gap={4}>
                <Box  width={"50%"}>
                    <InputField id={"search"} type={"text"} placeholder={"Buscar empleado"}/>
                </Box>
                <ButtonCustom width={"max-content"}>Buscar</ButtonCustom>
            </Flex>
        </Flex>


        <Box mt={4}>
        <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Empleado</Th>
                        <Th>Inicio</Th>
                        <Th>Fin</Th>
                        <Th>Tarea</Th>
                        <Th>Estado</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                    <Tr>
                          <Td>XXX</Td>
                          <Td>XXX</Td>
                          <Td>XXX</Td>
                          <Td>XXX</Td>
                          <Td>XXX</Td>
                        </Tr>
                    </Tbody>
                  </Table>
        </Box>
    </>
    )
}