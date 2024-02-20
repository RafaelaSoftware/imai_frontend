// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Input, FormControl, Flex } from "@chakra-ui/react";
import InputCustom from "@/app/componets/inputs/InputCustom";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useRef, useEffect } from "react";
import useCustomToast from "@/app/hooks/useCustomToast";
import { isValidData } from "@/app/libs/utils";

export default function ValePage() {
  const { directus, createItem } = useAuth();
  const { showToast } = useCustomToast();

  const inputRefEmpleado = useRef(null);
  const inputRefEmpleadoDescripcion = useRef(null);
  const inputRefOrdenProduccion = useRef(null);
  const inputRefOrdenProduccionDescripcion = useRef(null);
  const inputRefProducto = useRef(null);
  const inputRefProductoDescripcion = useRef(null);
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

    inputRefEmpleadoDescripcion.current.innerText = "";
    inputRefOrdenProduccionDescripcion.current.innerText = "";
    inputRefProductoDescripcion.current.innerText = "";
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
          inputRefProducto.current.focus();
        } else {
          inputRefOrdenProduccion.current.value = "";
          inputRefOrdenProduccionDescripcion.current.innerText = "";
          showToast("Error", result.description, "error");
        }
      } else if (event.target === inputRefProducto.current) {
        const result = await isValidData(
          "producto",
          inputRefProducto.current.value
        );
        if (result.isValid) {
          inputRefProductoDescripcion.current.innerText = result.description;
          inputRefCantidad.current.focus();
        } else {
          inputRefProducto.current.value = "";
          inputRefProductoDescripcion.current.innerText = "";
          showToast("Error", result.description, "error");
        }
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
        <Text ref={inputRefProductoDescripcion}></Text>

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
