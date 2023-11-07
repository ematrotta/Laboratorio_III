export function EliminarElementos(contenedor){
    while(contenedor.hasChildNodes()){
        contenedor.removeChild(contenedor.firstChild);
    }
}

export function $(tag){
    return document.createElement(tag);
}

export function ObtenerElementoPorId(idElemento){
    return document.getElementById(idElemento);
}

export function LetraCapital(palabra){
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}

export function AsignarId(arrObj){
    const arrIds = [];
    arrObj.forEach((obj)=>{
        arrIds.push(parseInt(obj.id));
    })
    return Math.max(...arrIds)+1;
}