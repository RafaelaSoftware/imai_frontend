import { LOGIN } from "../enums/AuthModalTypes";

const isLoginModalType = (type) => {
  return type === LOGIN;
};

const isValidData = async (table, data) => {
  // fetch data from api
  const URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${URL}/${table}/${data}`).then((res) =>
    res.json()
  );

  if (table === "empleado") {
    const responseEmp = await fetch(`${URL}/tareasPorEmpleado/${data}`).then(
      (res) => res.json()
    );
    // ADD extra data in "TAREAS" from resopnseEmp items
    if (responseEmp.length > 0) {
      response[0].tareas = responseEmp.map((item) => item.codigo);
    }
  }

  if (response.length === 0) {
    return {
      isValid: false,
      description: `${data.toUpperCase()} no es un valor correcto para ${table.toUpperCase()}`,
    };
  } else {
    if (table === "empleado") {
      if (response[0].tareas) {
        return {
          isValid: true,
          description: response[0].descripcion,
          inicioTurno: response[0].inicio,
          tareas: response[0].tareas,
        };
      } else {
        return {
          isValid: true,
          description: response[0].descripcion,
          inicioTurno: response[0].inicio,
          tareas: [],
        };
      }
    } else {
      return {
        isValid: true,
        description: response[0].descripcion,
      };
    }
  }
};

const changeBackgroundColor = (type) => {
  const color = type === "success" ? "lightgreen" : "lightcoral";

  const originalBackgroundColor = document.body.style.backgroundColor;
  document.body.style.backgroundColor = color;
  setTimeout(() => {
    document.body.style.backgroundColor = originalBackgroundColor;
  }, 250);
};

export { isLoginModalType, isValidData, changeBackgroundColor };
