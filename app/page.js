"use client";
import { Skeleton, Box } from "@chakra-ui/react";
import { useAuth } from "@/app/libs/AuthProvider";
import ButtonCustom from "./componets/buttons/ButtonCustom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Text } from "@chakra-ui/react";

export default function Home() {
  const { loading, user } = useAuth();
  const router = useRouter();

  const handleOption = (option) => {
    router.push(`/${option}`);
  };

  if (loading) return <Skeleton height="100vh" />;

  if (!user) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="50vh"
        gap={8}
      >
        <Image
          src={"/images/logo.svg"}
          alt="Logitipo"
          width="200"
          height="100"
        />
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

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="50vh"
      flexDirection="column"
      gap={8}
    >
      <ButtonCustom
        onClick={() => {
          handleOption("fichada");
        }}
      >
        FICHADA
      </ButtonCustom>
      <ButtonCustom
        onClick={() => {
          handleOption("parte");
        }}
      >
        PARTE
      </ButtonCustom>
      <ButtonCustom
        onClick={() => {
          handleOption("vale");
        }}
      >
        VALE
      </ButtonCustom>
    </Box>
  );
}
