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

export function OcultarCampos(arrCampos,bool){
    arrCampos.forEach((cmp)=>{
        if(bool === true){
            if(!cmp.classList.contains("none-visible")){
                cmp.classList.add("none-visible");
            }
        }else{
            if(cmp.classList.contains("none-visible")){
                cmp.classList.remove("none-visible");
            }
        }

    })
}

export function AsignarClase(arrCampos,nombreClase){

    arrCampos.forEach((cmp)=>{
        if(!cmp.classList.contains(nombreClase)){
            cmp.classList.add(nombreClase);
        }
    })
}