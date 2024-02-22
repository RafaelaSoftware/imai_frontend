// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Input, FormControl, Flex } from "@chakra-ui/react";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { use, useEffect, useRef } from "react";
import useCustomToast from "@/app/hooks/useCustomToast";
import { isValidData } from "@/app/libs/utils";
import useCustomInput from "@/app/hooks/useCustomInput";
import InputField from "@/app/componets/inputs/InputField";

export default function FichadaPage() {
  const { directus, createItem } = useAuth();
  const { showToast } = useCustomToast();

  const inputRefEmpleado = useRef(null);
  const empleado = useCustomInput("", "empleado", inputRefEmpleado, null, true);

  const handleSubmit = async (values) => {
    if (values.empleado === "") {
      showToast("Error", "Todos los campos son obligatorios", "error");
      return;
    }
    if (!empleado.isValid) {
      showToast("Error", "Hay campos con errores de validación", "error");
      return;
    }

    try {
      const result = await directus.request(
        createItem("fichada", {
          empleado: values.empleado,
        })
      );
      showToast("Notificación", "Fichada creada con éxito", "success");

      inputRefEmpleado.current.focus();
      empleado.resetValues();
    } catch (error) {
      showToast("Error", "No se pudo crear la fichada", "error");
    }
  };

  useEffect(() => {
    inputRefEmpleado.current.focus();
  }, []);

  useEffect(() => {
    if (empleado.isValid) {
      handleSubmit({
        empleado: empleado.value,
      });
    }
  }, [empleado.isValid, empleado.value]);

  return (
    <Box>
      <Center>
        <Text fontSize="lg" fontWeight="bold">
          FICHADA
        </Text>
      </Center>

      <Flex gap={4} direction="column" alignItems="left">
        <InputField
          id="empleado"
          name="empleado"
          type="text"
          placeholder="Empleado"
          onChange={empleado.handleChange}
          onKeyDown={empleado.handleKeyDown}
          message={empleado.message}
          inputRef={inputRefEmpleado}
        />

        <ButtonCustom
          onClick={() => {
            handleSubmit({
              empleado: empleado.value,
            });
          }}
        >
          Confirmar
        </ButtonCustom>
      </Flex>
    </Box>
  );
}
