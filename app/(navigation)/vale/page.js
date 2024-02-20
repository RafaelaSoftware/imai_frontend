// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Input, FormControl, Flex } from "@chakra-ui/react";
import InputCustom from "@/app/componets/inputs/InputCustom";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useRef, useEffect } from "react";
import useCustomToast from "@/app/hooks/useCustomToast";

export default function ValePage() {
  const { directus, createItem } = useAuth();
  const { showToast } = useCustomToast();

  const inputRefEmpleado = useRef(null);
  const inputRefOrdenProduccion = useRef(null);
  const inputRefProducto = useRef(null);
  const inputRefCantidad = useRef(null);

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const result = await directus.request(
        createItem("vale", {
          empleado: values.empleado,
          ordenProduccion: values.ordenproduccion,
          producto: values.producto,
          cantidad: values.cantidad,
        })
      );
      showToast("Notificación", "Vale creado con éxito", "success");
    } catch (error) {
      showToast("Error", "No se pudo crear el vale", "error");
    }
    
    inputRefEmpleado.current.focus();
    inputRefEmpleado.current.value = "";
    inputRefOrdenProduccion.current.value = "";
    inputRefProducto.current.value = "";
    inputRefCantidad.current.value = "";
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      if (event.target === inputRefEmpleado.current) {
        inputRefOrdenProduccion.current.focus();
      } else if (event.target === inputRefOrdenProduccion.current) {
        inputRefProducto.current.focus();
      } else if (event.target === inputRefProducto.current) {
        inputRefCantidad.current.focus();
      } else if (event.target === inputRefCantidad.current) {
        handleSubmit({
          empleado: inputRefEmpleado.current.value,
          ordenproduccion: inputRefOrdenProduccion.current.value,
          producto: inputRefProducto.current.value,
          cantidad: inputRefCantidad.current.value,
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
          VALE
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
          id="producto"
          name="producto"
          type="text"
          placeholder="Producto"
          ref={inputRefProducto}
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
          id="cantidad"
          name="cantidad"
          type="text"
          placeholder="Cantidad"
          ref={inputRefCantidad}
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
              producto: inputRefProducto.current.value,
              cantidad: inputRefCantidad.current.value,
            });
          }}
        >
          Confirmar
        </ButtonCustom>
      </Flex>
    </Box>
  );
}
