// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Spacer, Flex } from "@chakra-ui/react";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useRef, useEffect, useState, use } from "react";
import useCustomToast from "@/app/hooks/useCustomToast";
import useCustomInput from "@/app/hooks/useCustomInput";
import InputField from "@/app/componets/inputs/InputField";
import { useRouter } from "next/navigation";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

import { v4 as uuidv4 } from "uuid";

export default function ValePage() {
  const { directus, createItem, user, readItems } = useAuth();
  const { showToast } = useCustomToast();
  const router = useRouter();

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
      changeBackgroundColor("error");
      return;
    }
    if (!empleado.isValid || !ordenproduccion.isValid) {
      showToast("Error", "Hay campos con errores de validación", "error");
      changeBackgroundColor("error");
      return;
    }
    if (items.length === 0) {
      showToast("Error", "Debe agregar al menos un item", "error");
      changeBackgroundColor("error");
      return;
    }

    const result = await directus.request(
      readItems("fichada", {
        filter: {
          empleado: { _eq: values.empleado },
        },
        limit: 1,
        sort: ["-ingreso"],
      })
    );

    const puedeCrearVale =
      (result.length > 0 && result[0].egreso === null) ||
      user?.role?.permite_crear_vale_sin_fichada;
    if (!puedeCrearVale) {
      showToast(
        "Error",
        "Permiso denegado. NO puede crear vale sin fichada regitrada.",
        "error"
      );
      changeBackgroundColor("error");
      return;
    }

    try {
      //const id = crypto.randomUUID();
      const id = uuidv4();

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
      changeBackgroundColor("success");

      inputRefEmpleado.current.focus();
      empleado.resetValues();
      ordenproduccion.resetValues();
      producto.resetValues();
      cantidad.resetValues();

      setItems([]);
    } catch (error) {
      console.log(error);
      showToast("Error", "No se pudo crear el vale", "error");
      changeBackgroundColor("error");
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    }

    inputRefEmpleado.current.focus();
  }, []);

  useEffect(() => {
    if (producto.isValid && cantidad.isValid) {
      const item = {
        producto: producto.value,
        descripcion: producto.message,
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

        {items.length > 0 && (
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              Productos a consumir
            </Text>
            <Flex gap={4} direction="column" alignItems="left">
              {items.length > 0 && (
                <Box>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Cantidad</Th>
                        <Th>Código</Th>
                        <Th>Descripción</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {items.map((item, index) => (
                        <Tr key={index}>
                          <Td>{item.cantidad}</Td>
                          <Td>{item.producto}</Td>
                          <Td>{item.descripcion}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
