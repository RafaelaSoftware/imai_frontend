"use client";
import { Skeleton, Box } from "@chakra-ui/react";
import { useAuth } from "@/app/libs/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Text } from "@chakra-ui/react";
import Dashboard from "./componets/dashboard/Dashboard";
import Options from "./componets/Options";
import PleaseLogin from "./componets/PleaseLogin";

export default function Home() {
  const { loading, user } = useAuth();
  const router = useRouter();

  if (loading) return <Skeleton height="100vh" />;

  if (!user) {
    return <PleaseLogin />;
  }

  if (user && user.role.name !== "Operarios") {
    console.log(user.role.name);
    return <Dashboard />;
  }

  return <Options router={router} />;
}
