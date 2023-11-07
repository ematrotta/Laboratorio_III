import { Vehiculo } from "./Vehiculo.js";
export class Terrestre extends Vehiculo{
    
    constructor(id,modelo,anoFab,velMax,cantPue,cantRue){
        if(typeof cantPue !== "number" || cantPue<0 || typeof cantRue !== "number" || cantRue<1){
            throw new Error("Alguno de los parametros es erroneo");
        }
        super(id,modelo,anoFab,velMax);
        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }

}