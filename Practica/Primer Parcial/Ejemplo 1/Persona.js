class Persona{

    constructor(id = 0,nombre = "",apellido = "",edad=15){
        if (typeof id !== 'number' || typeof nombre !== 'string' || typeof apellido !== 'string' || typeof edad !== 'number' || edad < 15) {
            throw new Error('Los tipos de datos de los parámetros son incorrectos');
        }


        this._id = id;
        this._nombre = nombre;
        this._apellido = apellido;
        this._edad = edad;
    }

    toString() {
        return `Id: ${this._id}, Nombre: ${this._nombre}, Apellido: ${this._apellido}, Edad: ${this._edad}`;
    }

    toJSON(){
        return {
            id: this._id,
            nombre: this._nombre,
            apellido: this._apellido,
            edad:this._edad
        };
    }



}