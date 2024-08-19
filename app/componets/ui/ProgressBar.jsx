import { Box, Progress, Text } from "@chakra-ui/react";

const ProgressBar = ({ horasEstimadas, horasEjecutadas }) => {
  const porcentaje = (horasEjecutadas / horasEstimadas) * 100;
  return (
    <Box w="100%">
      <Box position={"relative"}>
        <Text
          position={"absolute"}
          top={0}
          left={"50%"}
          transform={"translateX(-50%)"}
          zIndex={1000}
          mb={2}
          fontWeight={"bold"}
          fontSize={"sm"}
          color={"white"}
        >
          {Math.round(porcentaje)}%
        </Text>
        <Progress
          value={porcentaje}
          colorScheme="blue"
          color={"red"}
          background={"#c1c1c1"}
          size="lg"
          hasStripe
          sx={{
            "& > div": {
              backgroundColor: "own", // Cambia el color de la parte llena de la barra
            },
          }}
        />
      </Box>
      <Text mt={2} textAlign={"center"}>
        {horasEjecutadas} de {horasEstimadas} horas
      </Text>
    </Box>
  );
};

export default ProgressBar;
