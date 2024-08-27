// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Input, FormControl, Flex } from "@chakra-ui/react";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useEffect, useRef } from "react";
import useCustomToast from "@/app/hooks/useCustomToast";
import useCustomInput from "@/app/hooks/useCustomInput";
import InputField from "@/app/componets/inputs/InputField";
import { useRouter } from "next/navigation";
import { changeBackgroundColor } from "@/app/libs/utils";
import moment from 'moment-timezone';

export default function FichadaPage() {
  const { directus, createItem, readItems, updateItem, user, isOperario } = useAuth();
  const { showToast } = useCustomToast();
  const router = useRouter();

  const inputRefEmpleado = useRef(null);
  const empleado = useCustomInput("", "empleado", inputRefEmpleado, null, true);

  const handleSubmit = async (values) => {
    if (values.empleado === "") {
      showToast("Error", "Todos los campos son obligatorios", "error");
      changeBackgroundColor("error");
      return;
    }
    if (!empleado.isValid) {
      showToast("Error", "Hay campos con errores de validación", "error");
      changeBackgroundColor("error");
      return;
    }

    try {
      let result;
      result = await directus.request(
        readItems("fichada", {
          filter: {
            empleado: { _eq: values.empleado },
          },
          limit: 1,
          sort: ["-ingreso"],
        })
      )
      // si el empleado ficho en los ultimos 60 segundos, no se puede volver a fichar
      if (result.length > 0) {
        const fichada = result[0];

        let ultimoNovedad = new moment.tz(fichada.egreso ? fichada.egreso : fichada.ingreso, "America/Argentina/Buenos_Aires")
        ultimoNovedad = ultimoNovedad.subtract(3, 'hours');
        const ahora = new moment.tz("America/Argentina/Buenos_Aires")
        const diferencia = ahora.diff(ultimoNovedad, 'seconds');
        if (diferencia < 60) {
          inputRefEmpleado.current.focus();
          empleado.resetValues();
          console.log("No se puede volver a fichar en menos de 60 segundos");
          return;
        }
      }
      

      const esIngreso = result.length === 0 || result[0].egreso !== null;

      if (esIngreso) {
        result = await directus.request(
          createItem("fichada", {
            empleado: values.empleado,
            empleado_descripcion: empleado.message, 
            ingreso: new Date().toISOString(),
          })
        );
        showToast("Notificación", "Fichada creada con éxito", "success");
        changeBackgroundColor("success");
      } else {
        // si hay un parte abierto, se cierra antes
        const partesAbiertos = await directus.request(
          readItems("parte", {
            filter: {
              empleado: { _eq: values.empleado },
            },
            sort: ["-inicio"],
            limit: 1,
          })
        );

        if (partesAbiertos.length > 0 && partesAbiertos[0].fin === null) {
          const parte = partesAbiertos[0];
          await directus.request(
            updateItem("parte", parte.id, {
              fin: new Date().toISOString(),
            })
          );
          showToast(
            "Notificación",
            "Parte abierto actualizado con éxito",
            "success"
          );
        }

        const fichada = result[0];
        result = await directus.request(
          updateItem("fichada", fichada.id, {
            egreso: new Date().toISOString(),
          })
        );
        showToast("Notificación", "Fichada actualizada con éxito", "success");
        changeBackgroundColor("success");
      }

      inputRefEmpleado.current.focus();
      empleado.resetValues();
    } catch (error) {
      console.log(error);
      showToast("Error", "No se pudo crear la fichada", "error");
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
    if (empleado.isValid) {
      handleSubmit({
        empleado: empleado.value,
      });
    }
  }, [empleado.isValid, empleado.value]);

  return (
    <Box>
      <Center>
        <Text fontSize={isOperario ? "3xl" : "lg"} fontWeight="bold">
          FICHADA
        </Text>
      </Center>

      <Flex gap={4} direction="column" alignItems="left">
        <InputField
          fontSize={isOperario && "3xl"}
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
