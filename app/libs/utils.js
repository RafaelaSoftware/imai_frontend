import moment from "moment-timezone";
import { LOGIN } from "../enums/AuthModalTypes";

const isLoginModalType = (type) => {
  return type === LOGIN;
};

const isValidData = async (table, data) => {
  // fetch data from api
  const URL = process.env.NEXT_PUBLIC_API_URL;
  // encodeURIComponent the data to handle special character  
  // clear space and special characters
  data = data.replace(/ /g, "");
  data = encodeURIComponent(data);
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
      if (table === "producto") {
        return {
          isValid: true,
          codigo: response[0].codigo,
          description: response[0].descripcion,
          certificado: response[0].certificado,
          tiene_certificado: response[0].tiene_certificado,
        };
      }
      return {
        isValid: true,
        description: response[0].descripcion,
        tarea: response[0].tarea,
        tarea_descripcion: response[0].tarea_descripcion,
      };
    }
  }
};

const changeBackgroundColor = (type) => {
  const color = type === "success" ? "lightgreen" : "lightcoral";

  const originalBackgroundColor = "#fff"; 
  document.body.style.backgroundColor = color;
  setTimeout(() => {
    document.body.style.backgroundColor = originalBackgroundColor;
  }, 250);
};

const formatDate = (date) => {
  if (!date) return "";

  return moment(date)
    .tz("America/Argentina/Buenos_Aires")
    .subtract(3, "hours")
    .format("DD/MM/YYYY HH:mm:ss");
};

export { isLoginModalType, isValidData, changeBackgroundColor, formatDate };
