
function CrearChecks(arrPropiedades){
    const divChecks = document.getElementById("filtrosDeColumnas");
    arrPropiedades.forEach(p => {
        const nuevoCheck = document.createElement("input");
        const nuevaLabel = document.createElement("label");
        const propiedadMayuscula = p.charAt(0).toUpperCase() + p.slice(1);
        nuevoCheck.type = "checkbox";
        nuevoCheck.id = `chk-${p}`;
        nuevaLabel.id = `lbl${propiedadMayuscula}`;
        nuevaLabel.textContent = propiedadMayuscula;
        nuevaLabel.setAttribute("for",nuevoCheck.id);
        nuevoCheck.checked = true;
        nuevoCheck.addEventListener("change",(e)=>{
            const eventoOcultarColumnas = new CustomEvent("ocultarColumnas",{detail:p})
            document.dispatchEvent(eventoOcultarColumnas);
        })
        nuevoCheck.className = "checkColumn";
        divChecks.appendChild(nuevoCheck); 
        divChecks.appendChild(nuevaLabel); 
    });
}

function CargarOpcionesSelector(arrObjs,selector){
    const arrTiposTotal = arrObjs.map((o)=>o.constructor.name);
    const arrTiposReducido = [... new Set(arrTiposTotal)];
    arrTiposReducido.forEach((t)=>{
        const nuevaOpcion = document.createElement("option");
        nuevaOpcion.value = t;
        nuevaOpcion.textContent = t;
        selector.appendChild(nuevaOpcion);
    })
    return arrTiposReducido;
}


