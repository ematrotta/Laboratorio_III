import { Cliente } from "../Entidades/Cliente.js";
import { Empleado } from "../Entidades/Empleado.js";
import { Persona } from "../Entidades/Persona.js";

export function ConvertirEnObjetos(jsonArr){
    const objArr = jsonArr.map((obj)=>{
        if(obj.hasOwnProperty("ventas") && obj.hasOwnProperty("sueldo"))
        {
            return new Empleado(obj.id,obj.nombre,obj.apellido,obj.edad,obj.sueldo,obj.ventas);
        }else if(obj.hasOwnProperty("compras") && obj.hasOwnProperty("telefono")){
            return new Cliente(obj.id,obj.nombre,obj.apellido,obj.edad,obj.compras,obj.telefono);
        }else{
            return new Persona(obj.id,obj.nombre,obj.apellido,obj.edad);
        }
    });

    return objArr;
}

export function ObtenerArrayPropiedadesPorTipo(tipo){
    let propiedadesObjeto;
    switch(tipo){
        case "empleado":
            propiedadesObjeto = Object.getOwnPropertyNames((new Empleado(1,"e","e",15,1,1)));
            break;
        case "cliente":
            propiedadesObjeto = Object.getOwnPropertyNames((new Cliente(1,"c","c",15,1,"c")));
            break;
    }
    return propiedadesObjeto;
}


export function ValidarCamposInput(objetoTemporal,tipoObjeto){

    let arrCamposValidados = [];

    arrCamposValidados["nombre"]= objetoTemporal.nombre !== undefined && objetoTemporal.nombre !== '';
    arrCamposValidados["apellido"]= objetoTemporal.apellido !== undefined && objetoTemporal.apellido !== '';
    arrCamposValidados["edad"]= !isNaN(objetoTemporal.edad) && objetoTemporal.edad >15;

    switch(tipoObjeto){
        case "empleado":
            arrCamposValidados["sueldo"]= !isNaN(objetoTemporal.sueldo) && objetoTemporal.sueldo >0;
            arrCamposValidados["ventas"]= !isNaN(objetoTemporal.ventas) && objetoTemporal.ventas >0;
            break;
        case "cliente":
            arrCamposValidados["compras"]= !isNaN(objetoTemporal.compras) && objetoTemporal.compras >0;
            arrCamposValidados["telefono"]= objetoTemporal.telefono !== undefined && objetoTemporal.telefono !== '';
            break;
    }

    // Si hay algun false dentro del array, arrojará falso
    return !Object.values(arrCamposValidados).some(value => value === false);


}