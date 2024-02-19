"use client";
import { Skeleton, Text } from "@chakra-ui/react";
import { useAuth } from "@/app/libs/AuthProvider";

export default function Home() {
  const { loading, user } = useAuth();

  if (loading) return <Skeleton height="100vh" />;
  return <Text mt={10}>Template for a Next.js app with Chakra UI and Directus</Text>;
}
