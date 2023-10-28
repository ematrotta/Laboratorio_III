class Cliente extends Persona{

    constructor(id = 0,nombre = "",apellido = "",edad=15, compras = 0.01, telefono = ""){
        if (typeof compras !== 'number' || typeof telefono !== 'string') {
            throw new Error('Los tipos de datos de los parámetros son incorrectos');
        }
        super(id,nombre,apellido,edad);
        this._compras = compras;
        this._telefono = telefono;
    }

    toString() {
        return `Id: ${this._id}, Nombre: ${this._nombre}, Apellido: ${this._apellido}, Edad: ${this._edad}, Compras: ${this._compras}, Telefono: ${this._telefono}`;
    }

    toJSON(){
        return {
            id: this._id,
            nombre: this._nombre,
            apellido: this._apellido,
            edad:this._edad,
            compras:this._compras,
            telefono:this._telefono
        };
    }



}