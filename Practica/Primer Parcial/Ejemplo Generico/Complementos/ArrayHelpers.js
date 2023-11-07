export function ObtenerArrayPropiedades(arrObjetos){
    let props = arrObjetos
    .map(x => Object.getOwnPropertyNames(x))
    .flat();
    // Elimina los duplicados
    props = [...new Set(props)];
    return props;
}

export function ObtenerArrayConstructores(arrObjetos){
    let constructores = arrObjetos
    .map(x => x.constructor.name.toLowerCase())
    .flat();
    // Elimina los duplicados
    constructores = [...new Set(constructores)];
    return constructores;
}

export function OrdenarObjetos(arrObj,propiedad){
    arrayObjetosOrdenado = arrObj.sort((a,b)=>{

        if (a === undefined && b === undefined) return 0; // son iguales
        if (a === undefined) return -1; // a va al principio
        if (b === undefined) return 1;

        if(a[propiedad] > b[propiedad]){
            return 1;
        }
        if(a[propiedad] == b[propiedad]){
            return 0;
        }
        if(a[propiedad] < b[propiedad]){
            return -1;
        }
    }) 
    return arrayObjetosOrdenado;
}

export function FiltrarObjetos(arrObj,propiedad,esTipo=true){
    let arrayObjetosFiltrado;

        if (esTipo) {
            arrayObjetosFiltrado = arrObj.filter((obj) => obj.constructor.name.toLowerCase() === propiedad.toLowerCase());
        } else {
            arrayObjetosFiltrado = arrObj.filter((obj) => obj[propiedad] !== undefined);
        }

    return arrayObjetosFiltrado;
}

export function CalcularPorPropiedad(arrObj,propiedad){

    return arrObj.reduce(((inicial,obj)=>inicial+obj[propiedad]),0);

}

