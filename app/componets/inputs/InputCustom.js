import { Input } from "@chakra-ui/react";

export default function InputCustom({
  id,
  type = "text",
  placeholder,
  ref,
  handleKeyDown 
}) {
  return (
    <Input
      as={Input}
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      ref={ref}
      variant="filled"
      borderRadius="30"
      size="lg"
      bgColor="white"
      color="#C0C0C0"
      borderColor="#C0C0C0"
      onKeyDown={handleKeyDown}
    />
  );
}
