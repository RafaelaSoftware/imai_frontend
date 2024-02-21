// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Input, FormControl, Flex } from "@chakra-ui/react";
import InputCustom from "@/app/componets/inputs/InputCustom";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useRef, useEffect } from "react";
import useCustomToast from "@/app/hooks/useCustomToast";
import { isValidData } from "@/app/libs/utils";
import useCustomInput from "@/app/hooks/useCustomInput";
import InputField from "@/app/componets/inputs/InputField";

export default function ValePage() {
  const { directus, createItem } = useAuth();
  const { showToast } = useCustomToast();

  const inputRefEmpleado = useRef(null);
  const inputRefOrdenProduccion = useRef(null);
  const inputRefProducto = useRef(null);
  const inputRefCantidad = useRef(null);

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
    inputRefProducto,
    true
  );
  const producto = useCustomInput(
    "",
    "producto",
    inputRefProducto,
    inputRefCantidad,
    true
  );
  const cantidad = useCustomInput(
    "",
    "cantidad",
    inputRefCantidad,
    inputRefProducto,
    false
  );

  const handleSubmit = async (values) => {
    if (
      values.empleado === "" ||
      values.ordenproduccion === "" ||
      values.producto === "" ||
      values.cantidad === ""
    ) {
      showToast("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    if (!empleado.isValid || !ordenproduccion.isValid || !producto.isValid) {
      showToast("Error", "Hay campos con errores de validación", "error");
      return;
    }

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
    empleado.resetValues();
    ordenproduccion.resetValues();
    producto.resetValues();
    cantidad.resetValues();
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
        <InputField
          id="empleado"
          type="text"
          placeholder="Empleado"
          onChange={empleado.handleChange}
          onKeyDown={empleado.handleKeyDown}
          message={empleado.message}
          inputRef={inputRefEmpleado}
        />
        <InputField
          id="ordenproduccion"
          type="text"
          placeholder="Orden de Producción"
          onChange={ordenproduccion.handleChange}
          onKeyDown={ordenproduccion.handleKeyDown}
          message={ordenproduccion.message}
          inputRef={inputRefOrdenProduccion}
        />
        <InputField
          id="producto"
          type="text"
          placeholder="Producto"
          onChange={producto.handleChange}
          onKeyDown={producto.handleKeyDown}
          message={producto.message}
          inputRef={inputRefProducto}
        />
        <InputField
          id="cantidad"
          type="number"
          placeholder="Cantidad"
          onChange={cantidad.handleChange}
          onKeyDown={cantidad.handleKeyDown}
          message={cantidad.message}
          inputRef={inputRefCantidad}
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
