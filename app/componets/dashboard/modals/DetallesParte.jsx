import { useAuth } from "@/app/libs/AuthProvider";
import { formatDate } from "@/app/libs/utils";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Input,
  ButtonGroup,
  IconButton,
  Flex,
  Editable,
  EditablePreview,
  EditableInput,
  useEditableControls,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCheck, FaPen, FaTimes } from "react-icons/fa";

export default function DetallesParte({
  isOpen,
  onClose,
  empleado,
  setRefresh,
}) {
  const { directus, updateItem } = useAuth();

  const [parteEnCurso, setParteEnCurso] = useState(null);
  const [partesHoy, setPartesHoy] = useState(empleado.partes || []);

  const [hastaFecha, setHastaFecha] = useState("");

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton icon={<FaCheck />} {...getSubmitButtonProps()} />
        <IconButton icon={<FaTimes />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton size="sm" icon={<FaPen />} {...getEditButtonProps()} />
      </Flex>
    );
  }

  const handleSubmit = async () => {
    try {
      await insertarFecha(hastaFecha);
      setRefresh((prevState) => !prevState);
    } catch (e) {
      console.error(e);
    }
  };

  const insertarFecha = async (fecha) => {
    try {
      if (!fecha) return;
      // await directus.request(
      //   updateItem("parte", empleado.parte.id , {
      //     fin: fecha,
      //   })
      // );

      setHastaFecha(formatDate(fecha));
    } catch (e) {
      console.error(e);
    }
  };
  const handleDateChange = (date) => {
    setHastaFecha(new Date(date).toISOString());
  };

  useEffect(() => {
    if (partesHoy.length > 0) {
      const enCurso = partesHoy.find((parte) => parte.fin === null) || null;
      setParteEnCurso(enCurso);
      console.log(enCurso);
      setPartesHoy(partesHoy.filter((partes) => partes.fin != null));
    }
  }, [partesHoy]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Parte Activo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            <Box as="span" fontWeight={"bold"}>
              Empleado:
            </Box>{" "}
            {empleado.empleado_descripcion}
          </Text>

          <Box>
            <Heading>En curso:</Heading>

            <Box>
              <Text>
                <Box as="span" fontWeight={"bold"}>
                  Orden Producción:
                </Box>{" "}
                {/* {parteEnCurso.ordenProduccion_descripcion} */}
              </Text>
              <Text>
                <Box as="span" fontWeight={"bold"}>
                  Tarea:
                </Box>{" "}
                {/* {parteEnCurso.tarea} - {parteEnCurso.tarea_descripcion} */}
              </Text>

              <Text>
                <Box as="span" fontWeight={"bold"}>
                  Desde:
                </Box>{" "}
                {formatDate(parteEnCurso.inicio)}
              </Text>
              <Text display={"flex"} alignItems={"center"} gap={2}>
                <Box as="span" fontWeight={"bold"}>
                  Hasta:
                </Box>{" "}
                <Editable
                  submitOnBlur={false}
                  textAlign="center"
                  defaultValue={formatDate(hastaFecha) || "dd/mm/yyyy --:--"}
                  fontSize={"md"}
                  isPreviewFocusable={false}
                  onSubmit={handleSubmit}
                >
                  <Flex width={"100%"} alignItems={"center"}>
                    <EditablePreview
                      pr={4}
                      py={0}
                      height={"40px"}
                      // width={"224px"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    />
                    <Input
                      as={EditableInput}
                      type="datetime-local"
                      onChange={(e) => handleDateChange(e.target.value)}
                      width="max-content"
                    />
                    <EditableControls />
                  </Flex>
                </Editable>
              </Text>
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
