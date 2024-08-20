import { Box, Progress, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ProgressBar = ({ ordenes }) => {
  const [horasEjecutadas, setHorasEjecutadas] = useState(0);
  const [horasEstimadas, setHorasEstimadas] = useState(0);

  const [porcentaje, setPorcentaje] = useState(0);

  const fetchHorasEstimadas = async (ordenProduccion) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ordenproduccion/${ordenProduccion}`
      );
      const data = await response.json();
      return data[0].horas_estimadas;
    } catch (error) {
      return 0;
    }
  };

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const totalHoursOP = ordenes.reduce(
          (acc, item) => acc + parseFloat(item.tiempoAcumulado),
          0
        );

        let horasEstimadas = await fetchHorasEstimadas(
          ordenes[0].ordenProduccion
        );

        setHorasEjecutadas(totalHoursOP);
        setHorasEstimadas(horasEstimadas);
        const porcentaje = (totalHoursOP / horasEstimadas) * 100;
        setPorcentaje(porcentaje);
      } catch (error) {
        setHorasEjecutadas(0);
        setHorasEstimadas(0);
        setPorcentaje(0);
      }
    };
    fetchHours();
  }, [ordenes]);

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
          {isNaN(porcentaje) || !isFinite(porcentaje)
            ? "0%"
            : `${Math.round(porcentaje)}% `}
        </Text>
        <Progress
          value={porcentaje || 0}
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
