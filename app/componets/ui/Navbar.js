"use client";
import {
  Flex,
  Container,
  Box,
  Spacer,
  ButtonGroup,
  useDisclosure,
  ModalOverlay,
  Show,
  Hide,
} from "@chakra-ui/react";

import ButtonLogIn from "@/app/componets/buttons/ButtonLogIn";

import Link from "next/link";

import UserSession from "@/app/componets/auth/modalUserSession/UserSession";
import { useState, useEffect } from "react";
import moment from "moment-timezone";
import { LOGIN } from "@/app/enums/AuthModalTypes";

import Image from "next/image";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [typeModal, setTypeModal] = useState(LOGIN);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        moment().tz("America/Argentina/Buenos_Aires").format("HH:mm")
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const overlay = (
    <ModalOverlay backdropFilter="blur(4px)" backgroundColor="white.50" />
  );

  const openPopUp = (type) => {
    setTypeModal(type);
    onOpen();
  };

  const lineStyle = {
    position: "absolute",
    width: "100%",
    left: 0,
    right: 0,
    bottom: -1,
  };

  return (
    <Box backgroundColor="white" position="relative">

      <Container maxW="container.xl">
        <Flex minWidth="max-content" alignItems="center" gap="2" py="3" position="relative">
          <Box zIndex={2}>
            <Link href="/">
              <Hide>
                <Image
                  src={"/images/logo.svg"}
                  width="100"
                  height="50"
                  alt="Logitipo"
                />
              </Hide>
              <Show>
                <Image
                  src={"/images/logo.svg"}
                  width="100"
                  height="50"
                  alt="Logitipo"
                />
              </Show>
            </Link>
          </Box>
          <Spacer />

          {/* Hora actual centrada absolutamente */}
          <Box position="absolute" left={0} right={0} top="50%" transform="translateY(-50%)" textAlign="center" fontWeight="bold" fontSize="4xl" zIndex={1} pointerEvents="none">
            {currentTime}
          </Box>

          <Spacer />

          <ButtonGroup gap="2" zIndex={2}>
            <ButtonLogIn openPopUp={openPopUp} />
          </ButtonGroup>

          <UserSession
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            overlay={overlay}
            type={typeModal}
          />
        </Flex>
      </Container>

      <Flex sx={lineStyle} gap={4}>
        <Box width={"full"} height={2} bgColor="own" />
      </Flex>
    </Box>
  );
}
