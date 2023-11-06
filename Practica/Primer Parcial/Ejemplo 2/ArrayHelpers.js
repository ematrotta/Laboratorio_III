


function ObtenerArrayAtributos(arrObjetos){
    let props = arrObjetos
    .map(x => Object.getOwnPropertyNames(x))
    .flat();
    // Elimina los duplicados
    props = [...new Set(props)];
    return props;
}



function OrdenarObjetos(arrObj,tipoOrdenamiento){
    arrayObjetosOrdenado = arrObj.sort((a,b)=>{

        if (a === undefined && b === undefined) return 0; // son iguales
        if (a === undefined) return -1; // a va al principio
        if (b === undefined) return 1;

        if(a[tipoOrdenamiento] > b[tipoOrdenamiento]){
            return 1;
        }
        if(a[tipoOrdenamiento] == b[tipoOrdenamiento]){
            return 0;
        }
        if(a[tipoOrdenamiento] < b[tipoOrdenamiento]){
            return -1;
        }
    }) 
    return arrayObjetosOrdenado;
}

