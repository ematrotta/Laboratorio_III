class Persona{

    constructor(id = 0,nombre = "",apellido = "",edad=15){
        if (typeof id !== 'number' || typeof nombre !== 'string' || typeof apellido !== 'string' || typeof edad !== 'number') {
            throw new Error('Los tipos de datos de los parámetros son incorrectos');
        }

        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }



}