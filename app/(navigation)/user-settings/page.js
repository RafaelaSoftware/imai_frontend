// Assuming you have a user object with properties 'name' and 'lastName'
"use client";

import { Avatar, SkeletonCircle, Text, Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useAuth } from "@/app/libs/AuthProvider";

export default function UsserSettingsPage() {
  const [name, setName] = useState("ANONIMO");
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.first_name + " " + user.last_name);
    }
  }, [user]);

  if (loading) return <SkeletonCircle size="10" />;

  return (
    <Box mt={10}>
      <Flex alignItems="center" justifyContent="center" flexDirection="column">
        <Avatar size={"md"} name={name} />
        <Text fontSize="lg" fontWeight="bold" color="gray.600" ml="4">
          {name}
        </Text>
      </Flex>
    </Box>
  );
}
