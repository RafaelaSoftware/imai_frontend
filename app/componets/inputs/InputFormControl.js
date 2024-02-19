import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Field } from "formik";

export default function InputFormControl({
  label,
  placeholder,
  id,
  type = "text",
  isInvalidErrors,
  errorMessage,
}) {
  return (
    <FormControl isInvalid={isInvalidErrors}>
      <FormLabel htmlFor={id} fontSize="small" m="0" ml="4">
        {label}
      </FormLabel>
      <Field
        as={Input}
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        variant="filled"
        borderRadius="30"
        size="lg"
        bgColor="white"
        color="#C0C0C0"
        borderColor="#C0C0C0"
      />
      <FormErrorMessage fontSize="small" my="0">
        {errorMessage}
      </FormErrorMessage>
    </FormControl>
  );
}
