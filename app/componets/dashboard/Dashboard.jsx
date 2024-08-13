import TablaEmpleados from "./TablaEmpleados";
import TiempoOrdenProduccion from "./TiempoOrdenProduccion";

export default function Dashboard(){
    return (
        <>
        <TiempoOrdenProduccion />
        <TablaEmpleados />
        </>
     )
}