"use client";
import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import ModalTiempoOP from "./ModalTiempoOP";
import ButtonCustom from "../buttons/ButtonCustom";

export default function TiempoOrdenProduccion() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Flex justifyContent={"flex-end"}>
            <ButtonCustom
                width={"max-content"}
                onClick={() => { onOpen() }} mb={6}
                size={"md"}
            >
                Ver Orden Producción
            </ButtonCustom>

            <ModalTiempoOP isOpen={isOpen} onClose={onClose} />
        </Flex>
    )
}