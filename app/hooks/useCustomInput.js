import { useState, useEffect, useRef } from "react";
import { isValidData } from "@/app/libs/utils";
import useCustomToast from "@/app/hooks/useCustomToast";

const useCustomInput = (
  initialValue,
  type,
  inputRef,
  targetRef,
  showMessage
) => {
  const [value, setValue] = useState(initialValue);
  const [message, setMessage] = useState("");
  const [isValid, setValid] = useState(false);
  const [inicioTurno, setInicioTurno] = useState("");
  const [tareas, setTareas] = useState([]);
  const { showToast } = useCustomToast();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    setValue(e.target.value);
    setValid(false);
  };

  const handleChangeMessage = (message) => {
    setMessage(message);
  };

  const resetValues = () => {
    setValue("");
    setMessage("");
    setValid(false);
    inputRef.current.value = "";
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      if (type === "cantidad") {
        if (value === "") {
          showToast("Error", "El campo cantidad es obligatorio", "error");
          setValid(false);
          return;
        }
        setValid(true);
      }

      if (value !== "") {
        const result = await isValidData(type, value);
        setValid(result.isValid);

        if (result.isValid) {
          if (showMessage) {
            setMessage(result.description);
          }
          if (targetRef) {
            targetRef.current.focus();
          }

          if (type === "empleado") {
            setInicioTurno(result.inicioTurno);
            setTareas(result.tareas);
          } else {
            setInicioTurno("");
            setTareas([]);
          }
        } else {
          resetValues();
          showToast("Error", result.description, "error");
        }
      }
    }
  };

  return {
    value,
    message,
    inputRef,
    targetRef,
    handleChange,
    handleChangeMessage,
    handleKeyDown,
    resetValues,
    isValid,
    inicioTurno,
    tareas,
  };
};

export default useCustomInput;
