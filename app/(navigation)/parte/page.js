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
import { changeBackgroundColor } from "@/app/libs/utils";

export default function PartePage() {
  const { directus, createItem, readItems, user, updateItem } = useAuth();
  const { showToast } = useCustomToast();
  const router = useRouter();
  const inputRefEmpleado = useRef(null);
  const inputRefOrdenProduccion = useRef(null);
  const inputRefTarea = useRef(null);
  const inputRefConfirmacion = useRef(null);

  const empleado = useCustomInput(
    "",
    "empleado",
    inputRefEmpleado,
    inputRefOrdenProduccion,
    true
  );
  const tarea = useCustomInput("", "tarea", inputRefTarea, inputRefConfirmacion, true);
  const ordenproduccion = useCustomInput(
    "",
    "ordenproduccion",
    inputRefOrdenProduccion,
    inputRefTarea,
    true,
    tarea.setValue
  );
  const confirmacion = useCustomInput("", "confirmacion", inputRefConfirmacion, null, true);

  const resetValuesRefs = () => {
    inputRefEmpleado.current.focus();
    empleado.resetValues();
    ordenproduccion.resetValues();
    tarea.resetValues();
    confirmacion.resetValues();
  };

  const handleSubmit = async (values) => {
    if (
      values.empleado === "" ||
      values.ordenproduccion === "" ||
      values.tarea === "" ||
      values.confirmacion === ""
    ) {
      showToast("Error", "Todos los campos son obligatorios", "error");
      changeBackgroundColor("error");
      return;
    }

    if (values.confirmacion === "NO") {
      resetValuesRefs();
      showToast("Notificación", "Parte reiniciado", "info");
      return;
    }

    if (!empleado.isValid || !ordenproduccion.isValid || !tarea.isValid) {
      showToast("Error", "Hay campos con errores de validación", "error");
      changeBackgroundColor("error");
      confirmacion.resetValues();
      return;
    }

    const esTareaPermitida = empleado.tareas.includes(tarea.value.trim());
    if (!esTareaPermitida) {
      showToast(
        "Error",
        "Permiso denegado. Tarea no permitida para el empleado",
        "error"
      );
      changeBackgroundColor("error");
      confirmacion.resetValues();
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
      changeBackgroundColor("error");
      confirmacion.resetValues();
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
      changeBackgroundColor("error");
      confirmacion.resetValues();
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
          empleado_descripcion: empleado.message,
          ordenProduccion: values.ordenproduccion,
          ordenProduccion_descripcion: ordenproduccion.message,
          tarea: values.tarea.trim(),
          tarea_descripcion: tarea.message,
          inicio: ahora.toISOString(),
        })
      );
      showToast("Notificación", "Parte creado con éxito", "success");
      changeBackgroundColor("success");

      resetValuesRefs();
    } catch (error) {
      console.log(error);
      showToast("Error", "No se pudo crear el parte", "error");
      changeBackgroundColor("error");
      
      confirmacion.resetValues();
    }
  };
  const handleConfirmacion = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit({
        empleado: empleado.value,
        ordenproduccion: ordenproduccion.value,
        tarea: tarea.value,
        confirmacion: confirmacion.value,
      });
    }
  }

  const handleCheckIfNOKey = (e, input) => {
    if (e.key === "Enter") {
      // si el valor del campo es NO reiniciar
      // si es dioferente seguir con el handle habitual
      // no solo se usa en confirmacion, sino en todos los inputs

      if (e.target.value === "NO") {
        resetValuesRefs();
        showToast("Notificación", "Parte reiniciado", "info");
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      input.handleKeyDown(e);
    }
  }

  const handleOpAutomatica = async (e) => {
    ordenproduccion.handleKeyDown(e);
  }

  useEffect(() => {
    if (!user) {
      router.push("/");
    }

    inputRefEmpleado.current.focus();
  }, []);

  return (
    <Box>
      <Center>
        <Text fontSize={"lg"} fontWeight="bold">
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
          onKeyDown={(e) => handleCheckIfNOKey(e, empleado)}          
          message={empleado.message}
          inputRef={inputRefEmpleado}
        />
        <InputField
          id="ordenproduccion"
          name="ordenproduccion"
          type="text"
          placeholder="Orden Produccion"
          onChange={ordenproduccion.handleChange}
          onKeyDown={(e)=> handleCheckIfNOKey(e, ordenproduccion)}
          message={ordenproduccion.message}
          inputRef={inputRefOrdenProduccion}
        />
        <InputField
          id="tarea"
          name="tarea"
          type="text"
          placeholder="Tarea"
          onChange={tarea.handleChange}
          onKeyDown={(e) => handleCheckIfNOKey(e, tarea)}
          message={tarea.message}
          inputRef={inputRefTarea}
        />
        <InputField
          id="confirmacion"
          name="confirmacion"
          type="text"
          placeholder="Confirmación"
          onChange={confirmacion.handleChange}
          onKeyDown={handleConfirmacion}
          message={confirmacion.message}
          inputRef={inputRefConfirmacion}
        />

        <ButtonCustom
          onClick={() => {
            handleSubmit({
              empleado: empleado.value,
              ordenproduccion: ordenproduccion.value,
              tarea: tarea.value,
              confirmacion: confirmacion.value,
            });
          }}
          mt={2}
        >
          Confirmar
        </ButtonCustom>
      </Flex>
    </Box>
  );
}
