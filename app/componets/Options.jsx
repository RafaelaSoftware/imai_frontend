"use client";
import { Box } from "@chakra-ui/react";
import ButtonCustom from "./buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useEffect } from "react";

export default function Options({ router }) {
  const { user } = useAuth();

  const handleOption = (option) => {
    router.push(`/${option}`);
  };

  useEffect(() => {
    const allowedFunctions = [];
    const {
      permite_crear_fichada,
      permite_crear_parte,
      permite_crear_parte_sin_turno,
      permite_crear_vale,
      permite_crear_vale_sin_fichada,
    } = user.role;

    if (permite_crear_fichada) allowedFunctions.push("fichada");
    if (permite_crear_parte || permite_crear_parte_sin_turno)
      allowedFunctions.push("parte");
    if (permite_crear_vale || permite_crear_vale_sin_fichada)
      allowedFunctions.push("vale");

    if (allowedFunctions.length === 1) {
      router.push(`/${allowedFunctions[0]}`);
    }
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="50vh"
      flexDirection="column"
      gap={8}
    >
      {user.role.permite_crear_fichada && (
        <ButtonCustom
          onClick={() => {
            handleOption("fichada");
          }}
        >
          FICHADA INGRESO / EGRESO
        </ButtonCustom>
      )}
      {user.role.permite_crear_parte && (
        <ButtonCustom
          onClick={() => {
            handleOption("parte");
          }}
        >
          PARTE DE PRODUCCION
        </ButtonCustom>
      )}
      {user.role.permite_crear_vale && (
        <ButtonCustom
          onClick={() => {
            handleOption("vale");
          }}
        >
          VALE DE SALIDA
        </ButtonCustom>
      )}
    </Box>
  );
}
