import { Persona } from "./Persona.js";

export class Profesional extends Persona{
    constructor(id,nombre,apellido,edad,titulo,facultad,añoGraduacion){
        super(id,nombre,apellido,edad);
        if(typeof titulo !== "string" || titulo == "" || typeof facultad !== "string" || facultad == "" || typeof añoGraduacion !== "number" || añoGraduacion <= 1950 ){
            throw new Error("Alguno de los datos es erroneo");
        }
        this.titulo = titulo;
        this.facultad = facultad;
        this.añoGraduacion = añoGraduacion;
    }

    toString(){
        return `Id: ${this.id}, Nombre: ${this.nombre}, Apellido ${this.apellido}, Edad: ${this.edad}, Titulo: ${this.titulo}, Facultad: ${this.facultad}, Año de graduación: ${this.añoGraduacion}`;
    }

}