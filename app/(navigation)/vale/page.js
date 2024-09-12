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
import { changeBackgroundColor } from "@/app/libs/utils";
import moment from "moment";

export default function ValePage() {
  const { directus, createItem, user, readItems, isOperario } = useAuth();
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
            empleado_descripcion: empleado.message,
            ordenProduccion: values.ordenproduccion,
            ordenProduccion_descripcion: ordenproduccion.message,
            producto: item.producto,
            producto_descripcion: item.descripcion,
            cantidad: item.cantidad,
            certificado: item.certificado,
          })
        );
      });
      showToast("Notificación", "Vale creado con éxito", "success");
      changeBackgroundColor("success");

      resetValuesRefs();

      setItems([]);
    } catch (error) {
      console.log(error);
      showToast("Error", "No se pudo crear el vale", "error");
      changeBackgroundColor("error");
    }
  };

  const resetValuesRefs = () => {
    inputRefEmpleado.current.focus();
    empleado.resetValues();
    ordenproduccion.resetValues();
    producto.resetValues();
    cantidad.resetValues();
  }

  const handleConfirmacion = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      if (e.target.value === "SI") {
        handleSubmit({
          empleado: inputRefEmpleado.current.value,
          ordenproduccion: inputRefOrdenProduccion.current.value,
          producto: inputRefProducto.current.value,
          cantidad: inputRefCantidad.current.value,
        });
      } else if (e.target.value === "NO") {
        resetValuesRefs();
        setItems([]);

        showToast("Vale anulado", "Se anulo y reinicio el VALE", "info");
      } else {
        producto.handleKeyDown(e);
      }
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
        producto: producto.detallesProducto.certificado ? null : producto.detallesProducto.codigo,
        descripcion: producto.message,
        cantidad: cantidad.value,
        certificado: producto.detallesProducto.certificado,
        fecha: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      setItems([...items, item]);
      producto.resetValues();
      cantidad.resetValues();
    }
  }, [cantidad.isValid]);

  return (
    <Box>
      <Flex gap={2} direction="column" alignItems="left">
        <Flex gap={4} direction="row" alignItems={"top"}>
          <Box maxW={"50%"}>
            <InputField
              id="empleado"
              type="text"
              placeholder="Empleado"
              onChange={empleado.handleChange}
              onKeyDown={empleado.handleKeyDown}
              message={empleado.message}
              inputRef={inputRefEmpleado}
              height="156px"
            />
          </Box>
          <Box maxW={"50%"}>
            <InputField
              id="ordenproduccion"
              type="text"
              placeholder="OP"
              onChange={ordenproduccion.handleChange}
              onKeyDown={ordenproduccion.handleKeyDown}
              message={ordenproduccion.message}
              inputRef={inputRefOrdenProduccion}
              height="156px"
            />
          </Box>
        </Flex>

        <Flex gap={4} direction="row" alignItems={"top"}>
          <Box flex={2} maxW={"820px"}>
            <InputField
              id="producto"
              type="text"
              placeholder="Producto"
              onChange={producto.handleChange}
              onKeyDown={handleConfirmacion}
              message={producto.message}
              inputRef={inputRefProducto}
              height="156px"
            />
          </Box>

          <Box flex={1} maxW={"400px"}>
            <InputField
              id="cantidad"
              type="number"
              placeholder="Cant"
              onChange={cantidad.handleChange}
              onKeyDown={cantidad.handleKeyDown}
              message={cantidad.message}
              inputRef={inputRefCantidad}
              height="156px"
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
          mt={2}
          visibility={"hidden"}
          position={"absolute"}
          top={"0"}
          length={"0"}
          zIndex={"-100"}
        >
          Confirmar
        </ButtonCustom>

        {items.length > 0 && (
          <Box>
            <Text fontWeight="bold" fontSize={isOperario ? "3xl" : "lg"}>
              Productos a consumir
            </Text>
            <Flex gap={4} direction="column" alignItems="left">
              {items.length > 0 && (
                <Box>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th fontSize={isOperario ? "3xl" : "xs"}>Cantidad</Th>
                        <Th fontSize={isOperario ? "3xl" : "xs"}>Código</Th>
                        <Th fontSize={isOperario ? "3xl" : "xs"}>Descripción</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {items.sort((a, b) => moment(b.fecha).diff(moment(a.fecha))).map((item, index) => (
                        <Tr key={index}>
                          <Td fontSize={isOperario ? "3xl" : "xs"}>{item.cantidad}</Td>
                          <Td fontSize={isOperario ? "3xl" : "xs"}>{item.producto ? item.producto : item.certificado}</Td>
                          <Td fontSize={isOperario ? "3xl" : "xs"}>{item.descripcion}</Td>
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
