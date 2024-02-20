// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Input, FormControl, Flex } from "@chakra-ui/react";
import InputCustom from "@/app/componets/inputs/InputCustom";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useEffect, useRef } from "react";
import useCustomToast from "@/app/hooks/useCustomToast";
import { isValidData } from "@/app/libs/utils";

export default function FichadaPage() {
  const { directus, createItem } = useAuth();
  const { showToast } = useCustomToast();

  const inputRefEmpleado = useRef(null);
  const inputRefEmpleadoDescripcion = useRef(null);

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const result = await directus.request(
        createItem("fichada", {
          empleado: values.empleado,
        })
      );
      showToast("Notificación", "Fichada creada con éxito", "success");
    } catch (error) {
      showToast("Error", "No se pudo crear la fichada", "error");
    }

    inputRefEmpleado.current.focus();
    inputRefEmpleado.current.value = "";
  };

  const handleEnter = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      if (event.target === inputRefEmpleado.current) {
        const result = await isValidData(
          "empleado",
          inputRefEmpleado.current.value
        );
        if (result.isValid) {
          inputRefEmpleadoDescripcion.current.innerText = result.description;
          handleSubmit({
            empleado: inputRefEmpleado.current.value,
          });
        } else {
          inputRefEmpleado.current.value = "";
          inputRefEmpleadoDescripcion.current.innerText = "";
          showToast("Error", result.description, "error");
        }
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
        <Text ref={inputRefEmpleadoDescripcion}></Text>

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
