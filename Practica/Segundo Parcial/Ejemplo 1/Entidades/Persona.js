export class Persona{

    constructor(id,nombre,apellido,edad){
        if(typeof id !== "number" || id<0 || typeof nombre !== "string" || typeof apellido !== "string" || typeof edad !== "number" ||
        edad<15){
            throw new Error("Alguno de los datos es erroneo");
        }
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }

    toString(){
        return `Id: ${this.id}, Nombre: ${this.nombre}, Apellido ${this.apellido}, Edad: ${this.edad}`;
    }

    toJson(){
        return JSON.stringify(this);
    }

}