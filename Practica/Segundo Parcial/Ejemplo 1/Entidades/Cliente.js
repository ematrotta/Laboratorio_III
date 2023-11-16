import { Persona } from "./Persona.js";

export class Cliente extends Persona{
    constructor(id,nombre,apellido,edad,compras,telefono){
        super(id,nombre,apellido,edad);
        if(typeof compras !== "number" || compras<0 || typeof telefono !== "string" ){
            throw new Error("Alguno de los datos es erroneo");
        }
    }

    toString(){
        return `Id: ${this.id}, Nombre: ${this.nombre}, Apellido ${this.apellido}, Edad: ${this.edad}, Compras: ${this.compras}, Teléfono: ${this.telefono}`;
    }

}