"use client";
import { Box } from "@chakra-ui/react";
import ButtonCustom from "./buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useEffect } from "react";

export default function Options({ router }) {
  const { user } = useAuth();

  const roots = {
    vale: "vale",
    parte: "parte",
    fichada: "fichada",
    fichadaIngreso: "fichada?action=ingreso",
    fichadaEgreso: "fichada?action=egreso",
  };

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

    if (permite_crear_fichada) allowedFunctions.push(roots.fichada);
    if (permite_crear_parte || permite_crear_parte_sin_turno)
      allowedFunctions.push(roots.parte);
    if (permite_crear_vale || permite_crear_vale_sin_fichada)
      allowedFunctions.push(roots.vale);

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
            handleOption(roots.fichada);
          }}
        >
          FICHADA INGRESO / EGRESO
        </ButtonCustom>
      )}
      {user.role.permite_crear_fichada && (
        <ButtonCustom
          onClick={() => {
            handleOption(roots.fichadaIngreso);
          }}
        >
          FICHADA INGRESO
        </ButtonCustom>
      )}
      {user.role.permite_crear_fichada && (
        <ButtonCustom
          onClick={() => {
            handleOption(roots.fichadaEgreso);
          }}
        >
          FICHADA EGRESO
        </ButtonCustom>
      )}
      {user.role.permite_crear_parte && (
        <ButtonCustom
          onClick={() => {
            handleOption(roots.parte);
          }}
        >
          PARTE DE PRODUCCION
        </ButtonCustom>
      )}
      {user.role.permite_crear_vale && (
        <ButtonCustom
          onClick={() => {
            handleOption(roots.vale);
          }}
        >
          VALE DE SALIDA
        </ButtonCustom>
      )}
    </Box>
  );
}
