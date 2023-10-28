class Empleado extends Persona{

    constructor(id = 0,nombre = "",apellido = "",edad=15, sueldo = 0.00, ventas = 0.00){
        if (typeof sueldo !== 'number' || typeof ventas !== 'number' || sueldo <= 0 || ventas <= 0) {
            throw new Error('Los tipos de datos de los parámetros son incorrectos');
        }
        super(id,nombre,apellido,edad);
        this._sueldo = sueldo;
        this._ventas = ventas;
    }

    toString() {
        return `Id: ${this._id}, Nombre: ${this._nombre}, Apellido: ${this._apellido}, Edad: ${this._edad}, Sueldo: ${this._sueldo}, Ventas: ${this._ventas}`;
    }

    toJSON(){
        return {
            id: this._id,
            nombre: this._nombre,
            apellido: this._apellido,
            edad:this._edad,
            sueldo:this._sueldo,
            ventas:this._ventas
        };
    }



}