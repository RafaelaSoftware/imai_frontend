import { LOGIN } from "../enums/AuthModalTypes";

const isLoginModalType = (type) => {
  return type === LOGIN;
};

const isValidData = async (table, data) => {
  // fetch endpoint /table with parametres data
  // if result is empty, return false
  // else return true
  console.log(`isValidaData: ${table} ${data}`);

  return {
    isValid: true,
    description: `Descripcion de ${table} ${data}`,
  };   
};

export { isLoginModalType, isValidData };
