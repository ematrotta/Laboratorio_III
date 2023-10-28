class Villano extends Persona{

    constructor(id = 0,nombre = "",apellido = "",edad=15, enemigo = "",robos = 1,asesinatos = 0){
        if (typeof enemigo !== 'string' || typeof robos !== 'number' || typeof asesinatos !== 'number') {
            throw new Error('Los tipos de datos de los parámetros son incorrectos');
        }
        super(id,nombre,apellido,edad);
        this.enemigo = enemigo;
        this.robos = robos;
        this.asesinatos = asesinatos;
    }



}