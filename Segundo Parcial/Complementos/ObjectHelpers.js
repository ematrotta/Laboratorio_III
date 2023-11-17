import { Futbolista } from "../Entidades/Futbolista.js";
import { Profesional } from "../Entidades/Profesional.js";
import { Persona } from "../Entidades/Persona.js";

export function ConvertirEnObjetos(jsonArr){
    const objArr = jsonArr.map((obj)=>{
        if(obj.hasOwnProperty("equipo") && obj.hasOwnProperty("posicion") && obj.hasOwnProperty("cantidadGoles"))
        {
            return new Futbolista(obj.id,obj.nombre,obj.apellido,obj.edad,obj.equipo,obj.posicion,obj.cantidadGoles);
        }else if(obj.hasOwnProperty("titulo") && obj.hasOwnProperty("facultad") && obj.hasOwnProperty("añoGraduacion")){
            return new Profesional(obj.id,obj.nombre,obj.apellido,obj.edad,obj.titulo,obj.facultad,obj.añoGraduacion);
        }else{
            return new Persona(obj.id,obj.nombre,obj.apellido,obj.edad);
        }
    });

    return objArr;
}

export function ObtenerArrayPropiedadesPorTipo(tipo){
    let propiedadesObjeto;
    switch(tipo){
        case "futbolista":
            propiedadesObjeto = Object.getOwnPropertyNames((new Futbolista(1,"f","f",15,"f","f",0)));
            break;
        case "profesional":
            propiedadesObjeto = Object.getOwnPropertyNames((new Profesional(1,"p","p",15,"p","p",1951)));
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
        case "futbolista":
            arrCamposValidados["equipo"]= objetoTemporal.equipo !== undefined && objetoTemporal.equipo !== '';
            arrCamposValidados["posicion"]= objetoTemporal.posicion !== undefined && objetoTemporal.posicion !== '';
            arrCamposValidados["cantidadGoles"]= !isNaN(objetoTemporal.cantidadGoles) && objetoTemporal.cantidadGoles >-1;
            break;
        case "profesional":
            arrCamposValidados["titulo"]= objetoTemporal.titulo !== undefined && objetoTemporal.titulo !== '';
            arrCamposValidados["facultad"]= objetoTemporal.facultad !== undefined && objetoTemporal.facultad !== '';
            arrCamposValidados["añoGraduacion"]= !isNaN(objetoTemporal.añoGraduacion) && objetoTemporal.añoGraduacion >1950;
            break;
    }

    // Si hay algun false dentro del array, arrojará falso
    return !Object.values(arrCamposValidados).some(value => value === false);


}