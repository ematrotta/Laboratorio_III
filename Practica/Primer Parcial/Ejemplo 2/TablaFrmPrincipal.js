function GenerarEncabezados(arrEncabezados,tabla){
    const encabezado = document.createElement("thead");
    const filaEncabezado = document.createElement("tr");
    arrEncabezados.forEach(e => {
        const encabezadoEnMayusculas = e.charAt(0).toUpperCase() + e.slice(1);
        let nuevoEncabezado = document.createElement("th");
        nuevoEncabezado.textContent = encabezadoEnMayusculas;
        nuevoEncabezado.id = `column-${e}`;
        nuevoEncabezado.addEventListener("click",()=>{
            const  eventOrdenarTabla = new CustomEvent('ordenarTabla',{detail: nuevoEncabezado.id.split("-")[1]});
            document.dispatchEvent(eventOrdenarTabla);
        })
        filaEncabezado.appendChild(nuevoEncabezado);
    });
    filaEncabezado.classList = "encabezado";
    encabezado.appendChild(filaEncabezado);
    tabla.appendChild(encabezado);
    return tabla;
}

function GenerarCuerpo(arrData,arrEncabezados,tabla){
    const body = document.createElement("tbody");
    arrData.forEach((obj)=>{
        const filaNueva = document.createElement("tr");
        arrEncabezados.forEach((e)=>{
            if(e === "id"){
                filaNueva.id = obj[e];
            }
            const nuevaCelda = document.createElement("td");
            nuevaCelda.id = `${filaNueva.id}-${e}`;
            nuevaCelda.textContent = obj[e];
            filaNueva.appendChild(nuevaCelda);
        });
        filaNueva.addEventListener("dblclick",()=>{
            const eventoCargarFormularioABM = new CustomEvent('cargarFormABM',{detail:filaNueva.id});
            document.dispatchEvent(eventoCargarFormularioABM);
        })
        body.appendChild(filaNueva);
        tabla.appendChild(body);

        return body;
    });
}

function EliminarContenido(tabla){
    while(tabla.hasChildNodes()){
        tabla.removeChild(tabla.firstChild);
    }
}


function ActualizarTabla(tabla,arrEncabezados,arrDatos){
    EliminarContenido(tabla);
    GenerarEncabezados(arrEncabezados,tabla);
    GenerarCuerpo(arrDatos,arrEncabezados,tabla);
}

