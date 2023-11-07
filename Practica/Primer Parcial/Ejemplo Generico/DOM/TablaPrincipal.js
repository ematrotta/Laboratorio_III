import{$,EliminarElementos,LetraCapital} from "../Complementos/ComplementedScripts.js";

export function ActualizarTablaPricipal(tabla,arrPropiedades,arrObjetos){
    EliminarElementos(tabla);
    const nuevoEncabezado = CrearEncabezados(arrPropiedades);
    const nuevoCuerpo = CrearCuerpo(arrObjetos,nuevoEncabezado);
    tabla.appendChild(nuevoEncabezado);
    tabla.appendChild(nuevoCuerpo);
}


function CrearEncabezados(arrPropiedades){
    const nuevoEncabezado = $("thead");
    const nuevaFila = $("tr");
    arrPropiedades.forEach(propiedad => {
        const nuevaColumna = $("th");
        nuevaColumna.id = `column-${propiedad}`;
        nuevaColumna.classList.add(`column-${propiedad}`);
        nuevaColumna.innerText = LetraCapital(propiedad);
        nuevaColumna.addEventListener("click",(e)=>{
            e.preventDefault();
            const nuevoEvento = new CustomEvent('OrdenarTabla',{detail:propiedad});
            document.dispatchEvent(nuevoEvento);
        })
        nuevaFila.classList.add("tableRow-Heder");
        nuevaFila.appendChild(nuevaColumna);
    });
    nuevoEncabezado.appendChild(nuevaFila);

    return nuevaFila;
}

function CrearCuerpo(arrObjetos,filaEncabezado){
    const nuevoCuerpo = $("tbody");
    const columnas = Array.from(filaEncabezado.children);
    arrObjetos.forEach((obj)=>{
        const nuevaFila = $("tr");
        nuevaFila.id = obj.id;
        columnas.forEach((columna)=>{
            const nuevaCelda = $("td");
            const propiedadColumna = columna.id.split("-")[1];
            nuevaCelda.id = `${obj.id}-${propiedadColumna}`;
            nuevaCelda.classList.add(`column-${propiedadColumna}`);
            nuevaCelda.innerText = obj[propiedadColumna] !== undefined ? obj[propiedadColumna]:"";
            nuevaCelda.addEventListener("dblclick",(e)=>{
                e.preventDefault();
                const nuevoEvento = new CustomEvent('AbrirFormularioABM',{detail:obj.id});
                document.dispatchEvent(nuevoEvento);
            });
            nuevaFila.appendChild(nuevaCelda);   
        });
        nuevoCuerpo.appendChild(nuevaFila);  
    })
    return nuevoCuerpo;
}

