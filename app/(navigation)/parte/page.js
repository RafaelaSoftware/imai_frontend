// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Input, FormControl, Flex } from "@chakra-ui/react";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useRef, useEffect } from "react";
import useCustomToast from "@/app/hooks/useCustomToast";
import { isValidData } from "@/app/libs/utils";
import useCustomInput from "@/app/hooks/useCustomInput";
import InputField from "@/app/componets/inputs/InputField";

export default function PartePage() {
  const { directus, createItem } = useAuth();
  const { showToast } = useCustomToast();

  const inputRefEmpleado = useRef(null);
  const inputRefOrdenProduccion = useRef(null);
  const inputRefTarea = useRef(null);

  const empleado = useCustomInput(
    "",
    "empleado",
    inputRefEmpleado,
    inputRefOrdenProduccion,
    true
  );
  const ordenproduccion = useCustomInput(
    "",
    "ordenproduccion",
    inputRefOrdenProduccion,
    inputRefTarea,
    true
  );
  const tarea = useCustomInput("", "tarea", inputRefTarea, null, true);

  console.log(empleado, ordenproduccion, tarea);

  const handleSubmit = async (values) => {
    if (
      values.empleado === "" ||
      values.ordenproduccion === "" ||
      values.tarea === ""
    ) {
      showToast("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    if (!empleado.isValid || !ordenproduccion.isValid || !tarea.isValid) {
      showToast("Error", "Hay campos con errores de validación", "error");
      return;
    }

    try {
      const result = await directus.request(
        createItem("parte", {
          empleado: values.empleado,
          ordenProduccion: values.ordenproduccion,
          tarea: values.tarea,
        })
      );
      showToast("Notificación", "Parte creado con éxito", "success");
    } catch (error) {
      showToast("Error", "No se pudo crear el parte", "error");
    }

    inputRefEmpleado.current.focus();
    empleado.resetValues();
    ordenproduccion.resetValues();
    tarea.resetValues();
  };

  useEffect(() => {
    inputRefEmpleado.current.focus();
  }, []);

  return (
    <Box>
      <Center>
        <Text fontSize="lg" fontWeight="bold">
          PARTE
        </Text>
      </Center>

      <Flex gap={4} direction="column" alignItems="center">
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
        <InputField
          id="ordenproduccion"
          name="ordenproduccion"
          type="text"
          placeholder="Orden Produccion"
          onChange={ordenproduccion.handleChange}
          onKeyDown={ordenproduccion.handleKeyDown}
          message={ordenproduccion.message}
          inputRef={inputRefOrdenProduccion}
        />
        <InputField
          id="tarea"
          name="tarea"
          type="text"
          placeholder="Tarea"
          onChange={tarea.handleChange}
          onKeyDown={tarea.handleKeyDown}
          message={tarea.message}
          inputRef={inputRefTarea}
        />

        <ButtonCustom
          onClick={() => {
            handleSubmit({
              empleado: empleado.value,
              ordenproduccion: ordenproduccion.value,
              tarea: tarea.value,
            });
          }}
        >
          Confirmar
        </ButtonCustom>
      </Flex>
    </Box>
  );
}
