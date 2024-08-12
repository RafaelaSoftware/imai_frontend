import { Box, Image, Text } from "@chakra-ui/react";

export default function PleaseLogin() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="50vh"
      gap={8}
    >
      <Image src={"/images/logo.svg"} alt="Logitipo" width="200" height="100" />
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color="gray.500"
        textAlign="center"
      >
        PIGO v2
      </Text>
      <Text>Inicie sesión para poder operar</Text>
    </Box>
  );
}
