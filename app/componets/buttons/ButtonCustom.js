import { Button } from "@chakra-ui/react";

export default function ButtonCustom({ children, ...props }) {
  return (
    <Button
      variant="solid"
      size="lg"
      borderRadius="full"
      color="white"
      width="full"
      bgColor="own"
      fontWeight="normal"
      boxShadow="xl"
      _hover={{
        background: "grayPrimary",
        color: "grayLight",
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
