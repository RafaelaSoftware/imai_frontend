"use client";

import { Avatar, SkeletonCircle } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/libs/AuthProvider";

export default function AvatarNavbar() {
  const { user, loading } = useAuth();
  const [name, setName] = useState("ANONIMO");

  useEffect(() => {
    if (user) {
      setName(user.first_name + " " + user.last_name);
    }
  }, [user]);

  if (loading) return <SkeletonCircle size="10" />;

  return (
    <>
      {!user ? (
        <SkeletonCircle size={"md"} />
      ) : (
        <Avatar size={"md"} name={name} />
      )}
    </>
  );
}
