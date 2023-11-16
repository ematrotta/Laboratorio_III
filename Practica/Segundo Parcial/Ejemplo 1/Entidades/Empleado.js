import { Persona } from "./Persona.js";

export class Empleado extends Persona{
    constructor(id,nombre,apellido,edad,sueldo,ventas){
        super(id,nombre,apellido,edad);
        if(typeof sueldo !== "number" || sueldo<0 || typeof ventas !== "number" || ventas<0 ){
            throw new Error("Alguno de los datos es erroneo");
        }
        this.sueldo = sueldo;
        this.ventas = ventas;
    }

    toString(){
        return `Id: ${this.id}, Nombre: ${this.nombre}, Apellido ${this.apellido}, Edad: ${this.edad}, Sueldo: ${this.sueldo}, Ventas: ${this.ventas}`;
    }

}