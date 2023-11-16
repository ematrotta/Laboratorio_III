export function EliminarElementos(contenedor){
    while(contenedor.hasChildNodes()){
        contenedor.removeChild(contenedor.firstChild);
    }
}

export function CrearElemento(tagName){
    return document.createElement(tagName);
}

export function $(idElemento){
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

export function ObtenerDatosDeCampos(arrCamposInput){
    const objetoTemporal = {};
    arrCamposInput.forEach((cp) => {
        let clave = cp.id.split("-")[1];
        let valor = cp.value;
        if (!isNaN(parseFloat(valor))) {
            valor = parseFloat(valor);
        }
        objetoTemporal[clave] = valor;
    });

    return objetoTemporal;
}