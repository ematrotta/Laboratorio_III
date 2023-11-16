class Heroe extends Persona{

    constructor(id = 0,nombre = "",apellido = "",edad=15, alterEgo = "", ciudad = "", publicado = 1940){
        if (typeof alterEgo !== 'string' || typeof ciudad !== 'string' || publicado < 1940) {
            throw new Error('Los tipos de datos de los parámetros son incorrectos');
        }
        super(id,nombre,apellido,edad);
        this.alterego = alterEgo;
        this.ciudad = ciudad;
        this.publicado = publicado;
    }



}