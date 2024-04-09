// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Text, Box, Center, Input, FormControl, Flex } from "@chakra-ui/react";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useRef, useEffect } from "react";
import useCustomToast from "@/app/hooks/useCustomToast";
import useCustomInput from "@/app/hooks/useCustomInput";
import InputField from "@/app/componets/inputs/InputField";
import { useRouter } from "next/navigation";

export default function PartePage() {
  const { directus, createItem, readItems, user, updateItem } = useAuth();
  const { showToast } = useCustomToast();
  const router = useRouter();

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

    const esTareaPermitida = empleado.tareas.includes(tarea.value);
    if (!esTareaPermitida) {
      showToast(
        "Error",
        "Permiso denegado. Tarea no permitida para el empleado",
        "error"
      );
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

    const puedeCrearParte = result.length > 0 && result[0].egreso === null;
    if (!puedeCrearParte) {
      showToast(
        "Error",
        "Permiso denegado. NO puede crear parte sin fichada regitrada.",
        "error"
      );
      return;
    }

    const ahora = new Date();
    const tieneTurnoVigente =
      ahora.getHours() >= empleado.inicioTurno.split(":")[0] ||
      user?.role?.permite_crear_parte_sin_turno;

    if (!tieneTurnoVigente) {
      showToast(
        "Error",
        "Permiso denegado. NO puede crear parte sin turno vigente.",
        "error"
      );
      return;
    }

    const partesAbiertos = await directus.request(
      readItems("parte", {
        filter: {
          empleado: { _eq: values.empleado },
        },
        limit: 1,
      })
    );

    if (partesAbiertos.length > 0 && partesAbiertos[0].fin === null) {
      const parte = partesAbiertos[0];
      await directus.request(
        updateItem("parte", parte.id, {
          fin: ahora.toISOString(),
        })
      );
    }

    try {
      const result = await directus.request(
        createItem("parte", {
          empleado: values.empleado,
          ordenProduccion: values.ordenproduccion,
          tarea: values.tarea,
          inicio: ahora.toISOString(),
        })
      );
      showToast("Notificación", "Parte creado con éxito", "success");

      inputRefEmpleado.current.focus();
      empleado.resetValues();
      ordenproduccion.resetValues();
      tarea.resetValues();
    } catch (error) {
      showToast("Error", "No se pudo crear el parte", "error");
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    }

    inputRefEmpleado.current.focus();
  }, []);

  return (
    <Box>
      <Center>
        <Text fontSize="lg" fontWeight="bold">
          PARTE DE PRODUCCION
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
