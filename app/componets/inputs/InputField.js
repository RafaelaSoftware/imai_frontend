import { Input, Text } from "@chakra-ui/react";

export default function InputField({
  id,
  type,
  placeholder,
  onChange,
  onKeyDown,
  message,
  inputRef,
}) {
  return (
    <>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        ref={inputRef}
        variant="filled"
        borderRadius="30"
        size="lg"
        bgColor="white"
        color="#C0C0C0"
        borderColor="#C0C0C0"
        _focus={{
          borderColor: "own",
        }}
      />
      <Text>{message}</Text>
    </>
  );
}
