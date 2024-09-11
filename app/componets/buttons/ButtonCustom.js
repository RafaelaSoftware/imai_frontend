import { useAuth } from "@/app/libs/AuthProvider";
import { Button } from "@chakra-ui/react";

export default function ButtonCustom({ children, ...props }) {
  const { isOperario } = useAuth();

  return (
    <Button
      variant="solid"
      size={"lg"}
      fontSize={isOperario && "5xl"}
      padding={isOperario && 10}
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
