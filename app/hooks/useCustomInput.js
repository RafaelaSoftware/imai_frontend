import { useState, useEffect, useRef } from "react";
import { changeBackgroundColor, isValidData } from "@/app/libs/utils";
import useCustomToast from "@/app/hooks/useCustomToast";

const useCustomInput = (
  initialValue,
  type,
  inputRef,
  targetRef,
  showMessage,
  setNextValue,
) => {
  const [value, setValue] = useState(initialValue);
  const [message, setMessage] = useState("");
  const [isValid, setValid] = useState(false);
  const [inicioTurno, setInicioTurno] = useState("");
  const [tareas, setTareas] = useState([]);
  const [detallesProducto, setDetallesProducto] = useState(null);
  const { showToast } = useCustomToast();

  useEffect(() => {
    setValue(initialValue);
    if (inputRef.current) {
      inputRef.current.value = initialValue;
    };
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
        if (targetRef) {
          targetRef.current.focus();
        }
      }

      if (type !== "cantidad" && value !== "") {
        const result = await isValidData(type, value);
        setValid(result.isValid);

        if (result.isValid) {
          if (showMessage) {
            setMessage(result.description);
          }

          if (targetRef) {
            if (result.tarea && result.tarea_descripcion) {
              //Si en PARTE, se selecciona una Orden Produccion, se autocompleta el siguiente campo del formulario (tarea) con el valor del resulado de la API.

              targetRef.current.focus();
              targetRef.current.value = result.tarea;

              if (setNextValue) setNextValue(result.tarea);


              const keyDownEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
              });

              const seconds = 1000;
              setTimeout(() => targetRef.current.dispatchEvent(keyDownEvent), seconds);

            } else {
              // Si en PARTE, no tiene la repuesta de la API con la tarea y la tarea_descripcion, se sigue el flujo normal.
              targetRef.current.focus();
            }
          }

          if (type === "empleado") {
            setInicioTurno(result.inicioTurno);
            setTareas(result.tareas);
          } else {
            setInicioTurno("");
            setTareas([]);
          }

          if (type === "producto") {
            setDetallesProducto(result);
          } else {
            setDetallesProducto(null);
          }

        } else {
          resetValues();
          showToast("Error", result.description, "error");
          changeBackgroundColor("error");
        }
      }
    }
  };

  return {
    value,
    setValue,
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
    detallesProducto,
  };
};

export default useCustomInput;
