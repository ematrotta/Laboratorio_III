function CrearCamposPorTipo(tipoSeleccionado,contenedor,arrObjs){
    EliminarCamposPorTipo(contenedor);
    const objetoTipo = arrObjs.find((o)=>o.constructor.name === tipoSeleccionado)
    if(objetoTipo !== undefined){
        const propiedades = Object.getOwnPropertyNames(objetoTipo);
        const propiedadesFiltradas = propiedades.filter((e) => { return e !== "id" && e !== "modelo" && e !== "anoFab" && e !== "velMax"});
        propiedadesFiltradas.forEach((p)=>{
            const nuevaLabel = document.createElement("label");
            const nuevoCampoDeTexto = document.createElement("input");
            nuevaLabel.id = `lbl-${p}`;
            nuevaLabel.textContent = `${p.charAt(0).toUpperCase()}${p.slice(1)}: `;
            nuevoCampoDeTexto.type = "text";
            nuevoCampoDeTexto.id = `txt-${p}`;
            nuevaLabel.setAttribute("for",nuevoCampoDeTexto.id);
            contenedor.appendChild(nuevaLabel);
            contenedor.appendChild(nuevoCampoDeTexto);
        })
    }

}

function EliminarCamposPorTipo(contenedor){
    while(contenedor.hasChildNodes()){
        contenedor.removeChild(contenedor.firstChild);
    }

}

function CargarInfoPorTipo(obj,contenedor,arrObjs,selectTipo){
    const tipoObjeto = obj.constructor.name;
    const propiedadesObjeto = Object.getOwnPropertyNames(obj);
    EliminarCamposPorTipo(contenedor);
    CrearCamposPorTipo(tipoObjeto,contenedor,arrObjs);
    selectTipo.value = tipoObjeto;
    selectTipo.disabled = true;
    propiedadesObjeto.forEach((p)=>{
        const elemento = document.getElementById(`txt-${p}`);
        elemento.value = obj[p];
    })
}

function InicializarContenedor(contenedor){
    const elementoDelContenedor = Array.from(contenedor.children);
    if(elementoDelContenedor.length>0){
        elementoDelContenedor.forEach((e)=>{
            if(e.tagName === "INPUT" && e.id.includes("txt-")){
                e.value = "";
            }
            
            if(e.tagName === "SELECT"){
                e.value = "todos"
                e.selected = true;
                e.disabled = false;
            }
        });
    }
}

function ObtenerDatosDeCampos(contenedor){
    const elementoDelContenedor = Array.from(contenedor.children);
    const objetoDatos = {};
    if(elementoDelContenedor.length>0){
        elementoDelContenedor.forEach((e)=>{
            if(e.tagName === "INPUT" && e.id.includes("txt-")){
                const dato = e.id.split("-")[1];
                objetoDatos[dato] = e.value;
            }
        });
    }
    return objetoDatos;
}


