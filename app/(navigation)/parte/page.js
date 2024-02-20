// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Input, FormControl, Flex } from "@chakra-ui/react";
import InputCustom from "@/app/componets/inputs/InputCustom";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useRef, useEffect } from "react";
import useCustomToast from "@/app/hooks/useCustomToast";
import { isValidData } from "@/app/libs/utils";

export default function PartePage() {
  const { directus, createItem } = useAuth();
  const { showToast } = useCustomToast();

  const inputRefEmpleado = useRef(null);
  const inputRefEmpleadoDescripcion = useRef(null);
  const inputRefOrdenProduccion = useRef(null);
  const inputRefOrdenProduccionDescripcion = useRef(null);
  const inputRefTarea = useRef(null);
  const inputRefTareaDescripcion = useRef(null);

  const handleSubmit = async (values) => {
    console.log(values);

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
    inputRefEmpleado.current.value = "";
    inputRefOrdenProduccion.current.value = "";
    inputRefTarea.current.value = "";

    inputRefEmpleadoDescripcion.current.innerText = "";
    inputRefOrdenProduccionDescripcion.current.innerText = "";
    inputRefTareaDescripcion.current.innerText = "";
  };

  useEffect(() => {
    inputRefEmpleado.current.focus();
  }, []);

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
          inputRefOrdenProduccion.current.focus();
        } else {
          inputRefEmpleado.current.value = "";
          inputRefEmpleadoDescripcion.current.innerText = "";
          showToast("Error", result.description, "error");
        }
      } else if (event.target === inputRefOrdenProduccion.current) {
        const result = await isValidData(
          "ordenproduccion",
          inputRefOrdenProduccion.current.value
        );
        if (result.isValid) {
          inputRefOrdenProduccionDescripcion.current.innerText =
            result.description;
          inputRefTarea.current.focus();
        } else {
          inputRefOrdenProduccion.current.value = "";
          inputRefOrdenProduccionDescripcion.current.innerText = "";
          showToast("Error", result.description, "error");
        }
      } else if (event.target === inputRefTarea.current) {
        const result = await isValidData("tarea", inputRefTarea.current.value);
        if (result.isValid) {
          inputRefTareaDescripcion.current.innerText = result.description;
          handleSubmit({
            empleado: inputRefEmpleado.current.value,
            ordenproduccion: inputRefOrdenProduccion.current.value,
            tarea: inputRefTarea.current.value,
          });
        } else {
          inputRefTarea.current.value = "";
          inputRefTareaDescripcion.current.innerText = "";
          showToast("Error", result.description, "error");
        }
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
        <Text ref={inputRefEmpleadoDescripcion}></Text>

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
        <Text ref={inputRefOrdenProduccionDescripcion}></Text>

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
        <Text ref={inputRefTareaDescripcion}></Text>

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
