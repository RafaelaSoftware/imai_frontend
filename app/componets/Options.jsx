"use client";
import { Box } from "@chakra-ui/react";
import ButtonCustom from "./buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";

export default function Options({ router }) {
  const { user } = useAuth();

  const handleOption = (option) => {
    router.push(`/${option}`);
  };

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
