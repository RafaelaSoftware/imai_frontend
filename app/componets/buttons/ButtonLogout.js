"use client";

import React from "react";
import { MenuItem } from "@chakra-ui/react";
import { useAuth } from "@/app/libs/AuthProvider";
import { useRouter } from "next/navigation";

export default function ButtonLogout() {
  const { directus, getUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await directus.logout();

      await getUser();
    } catch (error) {
    }

    window.location.replace("/");
  };

  return <MenuItem onClick={handleSignOut}>Cerrar sesión</MenuItem>;
}
