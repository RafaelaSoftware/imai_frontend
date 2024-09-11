import { useAuth } from "@/app/libs/AuthProvider";
import { Box, Input, Text } from "@chakra-ui/react";

export default function InputField({
  id,
  type,
  placeholder,
  onChange,
  onKeyDown,
  message,
  inputRef,
  height = "auto"
}) {
  const { isOperario } = useAuth();
  return (
    <Box height={height}>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        ref={inputRef}
        variant="filled"
        borderRadius="full"
        size="lg"
        bgColor="white"
        color="#C0C0C0"
        borderColor="#C0C0C0"
        _focus={{
          borderColor: "own",
        }}
        fontSize={isOperario && "5xl"}
        padding={isOperario && 10}
      />

      <Text fontSize={isOperario && "5xl"} maxWidth={"1000px"} whiteSpace={"nowrap"} overflow="hidden" textOverflow={"ellipsis"}>{message}</Text>

    </Box>
  );
}
