export class Vehiculo{

    constructor(id,modelo,anoFab,velMax){
        if(typeof id !== "number" || id<1 || typeof modelo !== "string" || modelo =="" || typeof anoFab !== "number" || anoFab < 1885 || typeof velMax !== "number" || velMax<1){
            throw new Error("Alguno de los parametros es erroneo");
        }

        this.id = id;
        this.modelo = modelo;
        this.anoFab = anoFab;
        this.velMax = velMax;
    }

    toString(){

        return `ID: ${this.id}, Modelo: ${this.modelo}, Año Fabricación: ${this.anoFab}, Vel. Máx. ${this.velMax}`;

    }

}