"use client";
import { Skeleton, Box } from "@chakra-ui/react";
import { useAuth } from "@/app/libs/AuthProvider";
import ButtonCustom from "./componets/buttons/ButtonCustom";
import { useRouter } from "next/navigation";

export default function Home() {
  const { loading, user } = useAuth();
  const router = useRouter();

  const handleOption = (option) => {
    router.push(`/${option}`);
  };

  if (loading) return <Skeleton height="100vh" />;
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
