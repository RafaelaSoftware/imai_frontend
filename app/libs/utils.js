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
    };
  }
};

export { isLoginModalType, isValidData };
