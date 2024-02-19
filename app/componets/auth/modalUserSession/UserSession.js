"use client";
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Image,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import useCustomToast from "@/app/hooks/useCustomToast";

import { isLoginModalType } from "@/app/libs/utils";
import { LOGIN } from "@/app/enums/AuthModalTypes";

import Login from "./ui/login/Login";

import { useAuth } from "@/app/libs/AuthProvider";
import { useRouter } from "next/navigation";

export default function UserSession({
  isOpen,
  onOpen,
  onClose,
  overlay,
  type,
}) {
  const { showToast } = useCustomToast();
  const { directus, getUser } = useAuth();
  const router = useRouter();

  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    if (isLoginModalType(type)) setActiveModal(LOGIN);
  }, [type]);

  const handleSignIn = async ({ email, password }) => {
    try {
      const result = await directus.login(email, password);
      showToast("Notificación", "Sesión iniciada", "success");

      await getUser();
      onClose();
    } catch (error) {
      showToast("Error", "Usuario o contraseña incorrectos", "error");
    }
  };

  const getActiveComponent = () => {
    switch (activeModal) {
      case LOGIN:
        return <Login onClose={onClose} handleSignIn={handleSignIn} />;
      default:
        return <Login onClose={onClose} handleSignIn={handleSignIn} />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {overlay}
      <ModalContent
        py="3"
        borderRadius="40"
        borderColor="blackPrimary"
        border="1px"
      >
        {isLoginModalType(activeModal) && (
          <ModalHeader position="relative" pb="0">
            <Center>
              <Image
                src={"/images/logo.svg"}
                width="100"
                height="50"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt="Logitipo"
              />
            </Center>
            <ModalCloseButton
              backgroundColor="#FFEB00"
              borderRadius="100%"
              right="32px"
              bgColor="own"
              color="white"
              _hover={{
                background: "grayPrimary",
                color: "grayLight",
              }}
            />
          </ModalHeader>
        )}
        {getActiveComponent()}
      </ModalContent>
    </Modal>
  );
}
