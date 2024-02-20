// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Input, FormControl, Flex } from "@chakra-ui/react";
import InputCustom from "@/app/componets/inputs/InputCustom";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";

import { useAuth } from "@/app/libs/AuthProvider";

import { useRef, useEffect } from "react";

export default function PartePage() {
  const { directus } = useAuth();

  const inputRefEmpleado = useRef(null);
  const inputRefOrdenProduccion = useRef(null);
  const inputRefTarea = useRef(null);

  const handleSubmit = (values) => {
    console.log(values);

    inputRefEmpleado.current.focus();

    inputRefEmpleado.current.value = "";
    inputRefOrdenProduccion.current.value = "";
    inputRefTarea.current.value = "";
  };

  useEffect(() => {
    inputRefEmpleado.current.focus();
  }, []);

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      if (event.target === inputRefEmpleado.current) {
        inputRefOrdenProduccion.current.focus();
      } else if (event.target === inputRefOrdenProduccion.current) {
        inputRefTarea.current.focus();
      } else if (event.target === inputRefTarea.current) {
        handleSubmit({
          empleado: inputRefEmpleado.current.value,
          ordenproduccion: inputRefOrdenProduccion.current.value,
          tarea: inputRefTarea.current.value,
        });
      }
    }
  };

  return (
    <Box>
      <Center>
        <Text fontSize="lg" fontWeight="bold">
          PARTE
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

        <Input
          as={Input}
          id="ordenproduccion"
          name="ordenproduccion"
          type="text"
          placeholder="Orden de Produccion"
          ref={inputRefOrdenProduccion}
          variant="filled"
          borderRadius="30"
          size="lg"
          bgColor="white"
          color="#C0C0C0"
          borderColor="#C0C0C0"
          onKeyDown={handleEnter}
        />

        <Input
          as={Input}
          id="tarea"
          name="tarea"
          type="text"
          placeholder="Tarea"
          ref={inputRefTarea}
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
              ordenproduccion: inputRefOrdenProduccion.current.value,
              tarea: inputRefTarea.current.value,
            });
          }}
        >
          Confirmar
        </ButtonCustom>
      </Flex>
    </Box>
  );
}
