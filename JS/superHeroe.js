import { Personaje } from "./personaje.js";

export function SuperHeroe(id,nombre,alias,editorial,fuerza,arma){

    Personaje.call(this,id,nombre,arma);
    this.alias = alias;
    this.editorial = editorial;
    this.fuerza = fuerza;
}

// Para hacer una herencia debo armar una herencia prototipal para que el object de mascota, sea el de animal.
// Esto es muy importante
// Ahora el prototipo de Mascota es animal. Es la clave por la cual engancho la mascota con el objeto.

// En conclusión:
//  Call: pasa el this del padre al hijo.
//  setPrototypeof es el que hace el marge/union 
Object.setPrototypeOf(SuperHeroe.prototype,Personaje.prototype);