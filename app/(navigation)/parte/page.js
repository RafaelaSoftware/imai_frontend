// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import {
  Text,
  Box,
  VStack,
  Center
} from "@chakra-ui/react";

import { Formik } from "formik";
import InputFormControl from "@/app/componets/inputs/InputFormControl";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";

import { useAuth } from "@/app/libs/AuthProvider";

export default function PartePage() {
  const { directus } = useAuth();

  const handleSubmit = (values) => {
    console.log(values);
  };

  const handleValidate = (values) => {
    let errors = {};

    if (!values.empleado) {
      errors.empleado = "El campo es requerido";
    }

    if (!values.ordenproduccion) {
      errors.ordenproduccion = "El campo es requerido";
    }

    if (!values.tarea) {
      errors.tarea = "El campo es requerido";
    }

    return errors;
  };

  return (
    <Box>
      <Center>
      <Text fontSize="lg" fontWeight="bold" 
      >
        PARTE
      </Text>
      </Center>

      <Formik
        initialValues={{
          empleado: "",
          ordenproduccion: "",
          tarea: "",
        }}
        validate={handleValidate}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values);
        }}
      >
        {({ handleSubmit, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="flex-start">
              <InputFormControl
                label={"Empleado"}
                placeholder={"Empleado"}
                id="empleado"
                type="text"
                isInvalidErrors={!!errors.empleado && touched.empleado}
                errorMessage={errors.empleado}
              />
              <InputFormControl
                label={"Orden de Produccion"}
                placeholder={"Orden de Produccion"}
                id="ordenproduccion"
                type="text"
                isInvalidErrors={!!errors.ordenproduccion && touched.ordenproduccion}
                errorMessage={errors.ordenproduccion}
              />
              <InputFormControl
                label={"Tarea"}
                placeholder={"Tarea"}
                id="tarea"
                type="text"
                isInvalidErrors={!!errors.tarea && touched.tarea}
                errorMessage={errors.tarea}
              />

              <ButtonCustom type="submit">Confirmar</ButtonCustom>
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  );
}
