import { Vehiculo } from "./Vehiculo.js";
export class Aereo extends Vehiculo{


    constructor(id,modelo,anoFab,velMax,altMax,autonomia){
        if(typeof altMax !== "number" || altMax<1 || typeof autonomia !== "number" || autonomia<1){
            throw new Error("Alguno de los parametros es erroneo");
        }
        super(id,modelo,anoFab,velMax);
        this.altMax = altMax;
        this.autonomia = autonomia;
    }



}