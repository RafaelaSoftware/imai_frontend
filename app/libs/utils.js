import { LOGIN } from "../enums/AuthModalTypes";

const isLoginModalType = (type) => {
  return type === LOGIN;
};

const isValidData = async (table, data) => {
  if (data === "999") {
    return {
      isValid: false,
      description: `Resultado no encontrado para ${table} ${data}`,
    };
  } else {
    return {
      isValid: true,
      description: `Descripcion de ${table} ${data}`,

      //only for empleado
      inicio: "08:00",
      tareas: ["1111", "2222", "3333"],
    };
  }
};

export { isLoginModalType, isValidData };
