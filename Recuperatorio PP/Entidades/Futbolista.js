import { Persona } from "./Persona.js";

export class Futbolista extends Persona{
    constructor(id,nombre,apellido,edad,equipo,posicion,cantidadGoles){
        super(id,nombre,apellido,edad);
        if(typeof equipo !== "string" || equipo == "" || typeof posicion !== "string" || posicion == "" || typeof cantidadGoles !== "number" || cantidadGoles<0 ){
            throw new Error("Alguno de los datos es erroneo");
        }
        this.equipo = equipo;
        this.posicion = posicion;
        this.cantidadGoles = cantidadGoles;
    }

    toString(){
        return `Id: ${this.id}, Nombre: ${this.nombre}, Apellido ${this.apellido}, Edad: ${this.edad}, Equipo: ${this.equipo}, Posición: ${this.posicion}, Cantidad de Goles: ${this.cantidadGoles}`;
    }

}