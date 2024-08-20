import useCustomToast from "@/app/hooks/useCustomToast";
import { useAuth } from "@/app/libs/AuthProvider";
import { formatDate } from "@/app/libs/utils";
import {
  Badge,
  Box,
  ButtonGroup,
  Editable,
  EditableInput,
  Flex,
  IconButton,
  Input,
  Text,
  useEditableControls,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaCheck, FaPen } from "react-icons/fa6";

export default function ParteEnCurso({
  parteEnCurso,
  setParteEnCurso,
  setRefresh,
}) {
  const { showToast } = useCustomToast();
  const { directus, updateItem } = useAuth();

  const [hastaFecha, setHastaFecha] = useState("");
  const [isEditing, setEditing] = useState(false);

  const handleSubmit = async (date) => {
    try {
      await insertarFecha(new Date(date).toISOString());
      setHastaFecha(date);
      setParteEnCurso(null);
      setEditing(false);
      setRefresh((prevState) => !prevState);

      showToast(
        "Parte actualizado",
        "Fecha de fin actualizada correctamente",
        "success"
      );
    } catch (e) {
      console.error(e);
    }
  };

  const insertarFecha = async (fecha) => {
    try {
      if (!fecha) return;
      await directus.request(
        updateItem("parte", parteEnCurso.id, {
          fin: fecha,
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

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

  return (
    <Box mt={4}>
      <Box background={"#f1f1f1"} px={4} py={2} borderRadius={4}>
        <Flex justifyContent={"space-between"}>
          <Text>
            <Box as="span" fontWeight={"bold"}>
              Orden Producción:
            </Box>{" "}
            {parteEnCurso.ordenProduccion_descripcion}
          </Text>

          <Badge fontSize={"1rem"} colorScheme={"green"}>
            En Curso
          </Badge>
        </Flex>
        <Text>
          <Box as="span" fontWeight={"bold"}>
            Tarea:
          </Box>{" "}
          {parteEnCurso.tarea} - {parteEnCurso.tarea_descripcion}
        </Text>

        <Flex justifyContent={"space-between"} alignItems={"center"}>
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
              defaultValue={
                formatDate(new Date(hastaFecha)) || "dd/mm/yyyy --:--"
              }
              fontSize={"md"}
              isPreviewFocusable={false}
              onSubmit={handleSubmit}
              onChange={(date) => setHastaFecha(date)}
              onEdit={() => setEditing(true)}
              onCancel={() => {
                setEditing(false);
                setHastaFecha("");
              }}
            >
              <Flex width={"100%"} alignItems={"center"}>
                {!isEditing && (
                  <Box>{formatDate(hastaFecha) || "dd/mm/yyyy --:--"}</Box>
                )}
                <Input
                  as={EditableInput}
                  type="datetime-local"
                  width="max-content"
                />
                <EditableControls />
              </Flex>
            </Editable>
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
