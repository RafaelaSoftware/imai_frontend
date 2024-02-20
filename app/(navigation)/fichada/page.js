// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Input, FormControl, Flex } from "@chakra-ui/react";
import InputCustom from "@/app/componets/inputs/InputCustom";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";

import { useAuth } from "@/app/libs/AuthProvider";

import { useEffect, useRef } from "react";

export default function FichadaPage() {
  const { directus } = useAuth();

  const inputRefEmpleado = useRef(null);

  const handleSubmit = (values) => {
    console.log(values);

    inputRefEmpleado.current.focus();

    inputRefEmpleado.current.value = "";
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      if (event.target === inputRefEmpleado.current) {
        handleSubmit({
          empleado: inputRefEmpleado.current.value,
        });
      }
    }
  };

  useEffect(() => {
    inputRefEmpleado.current.focus();
  }, []);

  return (
    <Box>
      <Center>
        <Text fontSize="lg" fontWeight="bold">
          FICHADA
        </Text>
      </Center>

      <Flex gap={4} direction="column" alignItems="center">
        <Input
          as={Input}
          id="empleado"
          name="empleado"
          type="text"
          placeholder="Empleado"
          ref={inputRefEmpleado}
          variant="filled"
          borderRadius="30"
          size="lg"
          bgColor="white"
          color="#C0C0C0"
          borderColor="#C0C0C0"
          onKeyDown={handleEnter}
        />

        <ButtonCustom
          onClick={() => {
            handleSubmit({
              empleado: inputRefEmpleado.current.value,
            });
          }}
        >
          Confirmar
        </ButtonCustom>
      </Flex>
    </Box>
  );
}
