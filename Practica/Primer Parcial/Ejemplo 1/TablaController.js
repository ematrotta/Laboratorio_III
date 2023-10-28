function AgregarCabecera(tabla,arrayColumnas){
    thead = document.createElement('thead');
    thead.setAttribute('id',`theadFrmPrincipal`);
    tr = document.createElement('tr');
    arrayColumnas.forEach(nombreColumna => {
        let nuevaCelda = document.createElement('th');
        nuevaCelda.textContent = nombreColumna;
        nuevaCelda.setAttribute('id',`th${nombreColumna}`);
        tr.appendChild(nuevaCelda);
    });

    thead.appendChild(tr);
    tabla.appendChild(thead);

    
    return thead;
}

function AgregarDatos(tabla,thead,data){
    const cuerpo = document.createElement("tbody");
    const cabecera = thead.childNodes[0];
    const celdasCabecera = cabecera.childNodes;

    data.forEach(obj => {
        const fila = document.createElement("tr");
        celdasCabecera.forEach(c => {
            const contenidoCabecera = c.textContent;
            const celda = document.createElement("td");
            if (contenidoCabecera === "Id") {
                fila.setAttribute("id", obj["_"+contenidoCabecera.toLowerCase()]);
                
            }
            celda.id = contenidoCabecera;
            celda.textContent = obj["_"+contenidoCabecera.toLowerCase()];
            fila.appendChild(celda);
        });

        cuerpo.appendChild(fila);
    });
    tabla.appendChild(cuerpo);

    return cuerpo;
}


function VaciarTabla(tabla,tBody){
    while(tBody.firstChild)
    {
        tBody.removeChild(tBody.firstChild);

    }
}

function RefrescarTabla(tabla,cabecera,body,data){
    VaciarTabla(tabla,body);
    AgregarDatos(tabla,cabecera,data);
}