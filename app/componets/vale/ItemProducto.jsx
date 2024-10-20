import { Box, Td, Tr } from "@chakra-ui/react";
import InputField from "../inputs/InputField";
import useCustomInput from "@/app/hooks/useCustomInput";
import { useAuth } from "@/app/libs/AuthProvider";
import { useEffect } from "react";

export default function ItemProducto({
  item,
  index,
  inputs,
  onSubmit,
  empleado,
  ordenproduccion,
}) {
  const { isOperario } = useAuth();
  let inputRefCantidad = inputs[index];
  const cantidad = useCustomInput(
    item.cantidad,
    "cantidad",
    inputRefCantidad,
    inputs[index + 1],
    false
  );

  useEffect(() => {
    if (inputRefCantidad != null && index === 0) {
      inputRefCantidad.current.focus();
    }
  }, [inputRefCantidad, index]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      item.cantidad = cantidad.value;

      const canMoveToNextInput = index < inputs.length - 1;
      const isLastInput = index === inputs.length - 1;

      if (canMoveToNextInput) {
        cantidad.handleKeyDown(e);
      } else if (isLastInput) {
        onSubmit();
      }
    }
  };

  return (
    <Tr>
      <Td fontSize={isOperario ? "3xl" : "xs"}>
        {item.producto ? item.producto : item.certificado}
      </Td>
      <Td fontSize={isOperario ? "3xl" : "xs"} lineHeight={"30px"}>
        {item.descripcion}
      </Td>
      <Td fontSize={isOperario ? "3xl" : "xs"}>
        <Box flex={1} maxW={"400px"}>
          <InputField
            id="cantidad"
            type="number"
            placeholder="Cant"
            onChange={cantidad.handleChange}
            onKeyDown={handleKeyDown}
            message={cantidad.message}
            inputRef={inputRefCantidad}
            height="130px"
          />
        </Box>
      </Td>
    </Tr>
  );
}
