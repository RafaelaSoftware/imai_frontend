"use client";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/react";
import { Field } from "formik";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function PasswordControl(props) {
  const { id, name, label, placeholder, isInvalidErrors, errorMessage } = props;

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <FormControl isInvalid={isInvalidErrors}>
      <FormLabel htmlFor="password" fontSize="small" m="0" ml="4">
        {label ? label : `Contraseña*`}
      </FormLabel>
      <InputGroup size="lg">
        <Field
          as={Input}
          id={id ? id : "password"}
          name={name ? name : "password"}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder ? placeholder : `Contraseña`}
          variant="filled"
          borderRadius="30"
          size="lg"
          bgColor="white"
          color="grayPrimary"
          borderColor="#C0C0C0"
        />
        <InputRightElement width="4.5rem">
          <Tooltip
            label={`${showPassword ? `Mostrar` : `Ocultar`}`}
            fontSize="small"
            hasArrow
            placement="bottom-end"
          >
            <Button
              variant="ghost"
              colorScheme="blackAlpha"
              px="0"
              color="gray"
              fontSize="large"
              onClick={handleShowPassword}
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </Button>
          </Tooltip>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage my="0">{errorMessage}</FormErrorMessage>
    </FormControl>
  );
}
