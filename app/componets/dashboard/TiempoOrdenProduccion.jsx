"use client";
import {  Button, Flex, useDisclosure } from "@chakra-ui/react";
import ModalTiempoOP from "./ModalTiempoOP";

export default function TiempoOrdenProduccion(){    
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Flex justifyContent={"flex-end"}>
            <Button onClick={()=>{onOpen()}} mb={6}>
                Ver Orden Producción
            </Button>

            <ModalTiempoOP isOpen={isOpen} onClose={onClose}/>
        </Flex>
    )
}