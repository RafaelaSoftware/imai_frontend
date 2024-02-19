"use client";

import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

import { LOGIN } from "@/app/enums/AuthModalTypes";
import { useAuth } from "@/app/libs/AuthProvider";
import ButtonLogout from "./ButtonLogout";
import Link from "next/link";
import AvatarNavbar from "../ui/AvatarNavbar";

export default function ButtonLogIn({ openPopUp }) {
  const { user } = useAuth();
  const handleOpenPopUp = () => {
    if (!user) openPopUp(LOGIN);
  };

  return (
    <Menu>
      <MenuButton onClick={handleOpenPopUp}>
        {!user ? <Avatar size="md" bg="black" /> : <AvatarNavbar />}
      </MenuButton>

      {user && (
        <MenuList>
          <Link href="/user-settings">
            <MenuItem>Configuración de usuario</MenuItem>
          </Link>
          <ButtonLogout />
        </MenuList>
      )}
    </Menu>
  );
}
