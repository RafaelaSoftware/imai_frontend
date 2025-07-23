import { Box, Input, Text } from "@chakra-ui/react";

export default function InputField({
  id,
  type,
  placeholder,
  onChange,
  onKeyDown,
  message,
  inputRef,
  height = "auto",
}) {
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
      />

      <Text
        maxWidth="100%"
        whiteSpace={"nowrap"}
        overflow="hidden"
        textOverflow={"ellipsis"}
        fontSize={"2xl"}
        fontWeight="bold"
      >
        {message}
      </Text>
    </Box>
  );
}
