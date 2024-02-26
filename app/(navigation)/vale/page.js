// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Spacer, Flex } from "@chakra-ui/react";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useRef, useEffect, useState, use } from "react";
import useCustomToast from "@/app/hooks/useCustomToast";
import useCustomInput from "@/app/hooks/useCustomInput";
import InputField from "@/app/componets/inputs/InputField";

export default function ValePage() {
  const { directus, createItem, user, readItems } = useAuth();
  const { showToast } = useCustomToast();
  const inputRefEmpleado = useRef(null);
  const inputRefOrdenProduccion = useRef(null);
  const inputRefProducto = useRef(null);
  const inputRefCantidad = useRef(null);

  const [items, setItems] = useState([]);

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
    if (values.empleado === "" || values.ordenproduccion === "") {
      showToast("Error", "Todos los campos son obligatorios", "error");
      return;
    }
    if (!empleado.isValid || !ordenproduccion.isValid) {
      showToast("Error", "Hay campos con errores de validación", "error");
      return;
    }
    if (items.length === 0) {
      showToast("Error", "Debe agregar al menos un item", "error");
      return;
    }

    // check if empleado has fichada iniciada
    const result = await directus.request(
      readItems("fichada", {
        filter: {
          empleado: { _eq: values.empleado },
        },
        limit: 1,
        sort: ["-ingreso"],
      })
    );

    console.log("result", result);

    const puedeCrearVale =
      (result.length > 0 && result[0].egreso === null) ||
      user?.role?.permite_crear_vale_sin_fichada;

    console.log("puedeCrearVale", puedeCrearVale);
    console.log("user", user);

    if (!puedeCrearVale) {
      showToast(
        "Error",
        "Permiso denegado. NO puede crear vale sin fichada regitrada.",
        "error"
      );
      return;
    }

    try {
      const id = crypto.randomUUID();
      items.forEach(async (item) => {
        const result = await directus.request(
          createItem("vale", {
            transaccion: id,
            empleado: values.empleado,
            ordenProduccion: values.ordenproduccion,
            producto: item.producto,
            cantidad: item.cantidad,
          })
        );
      });
      showToast("Notificación", "Vale creado con éxito", "success");

      inputRefEmpleado.current.focus();
      empleado.resetValues();
      ordenproduccion.resetValues();
      producto.resetValues();
      cantidad.resetValues();

      setItems([]);
    } catch (error) {
      showToast("Error", "No se pudo crear el vale", "error");
    }
  };

  useEffect(() => {
    inputRefEmpleado.current.focus();
  }, []);

  useEffect(() => {
    if (producto.isValid && cantidad.isValid) {
      const item = {
        producto: producto.value,
        cantidad: cantidad.value,
      };

      setItems([...items, item]);
      producto.resetValues();
      cantidad.resetValues();
    }
  }, [cantidad.isValid]);

  return (
    <Box>
      <Center>
        <Text fontSize="lg" fontWeight="bold">
          VALE DE CONSUMO
        </Text>
      </Center>

      <Flex gap={4} direction="column" alignItems="left">
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

        <Flex gap={4} direction="row" alignItems={"top"}>
          <Box flex={2}>
            <InputField
              id="producto"
              type="text"
              placeholder="Producto"
              onChange={producto.handleChange}
              onKeyDown={producto.handleKeyDown}
              message={producto.message}
              inputRef={inputRefProducto}
            />
          </Box>

          <Box flex={1}>
            <InputField
              id="cantidad"
              type="number"
              placeholder="Cantidad"
              onChange={cantidad.handleChange}
              onKeyDown={cantidad.handleKeyDown}
              message={cantidad.message}
              inputRef={inputRefCantidad}
            />
          </Box>
        </Flex>

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
