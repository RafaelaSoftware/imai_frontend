"use client";
import { Formik } from "formik";
import { Button, VStack, ModalBody } from "@chakra-ui/react";
import InputFormControl from "@/app/componets/inputs/InputFormControl";
import PasswordControl from "@/app/componets/inputs/PasswordControl";
import ButtonCustom from "@/app/componets/buttons/ButtonCustom";

export default function Login({ onClose, handleSignIn }) {
  return (
    <>
      <ModalBody position="relative">
        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false,
          }}
          validate={(values) => {
            let errors = {};

            return errors;
          }}
          onSubmit={(values, { resetForm }) => {
            handleSignIn(values);
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <InputFormControl
                  label={"Correo electrónico"}
                  placeholder={"Correo electrónico"}
                  id="email"
                  type="email"
                  isInvalidErrors={!!errors.email && touched.email}
                  errorMessage={errors.email}
                />
                <PasswordControl
                  isInvalidErrors={!!errors.password && touched.password}
                  errorMessage={errors.password}
                />

                <ButtonCustom type="submit">Iniciar sesión</ButtonCustom>
              </VStack>
            </form>
          )}
        </Formik>
      </ModalBody>
    </>
  );
}
