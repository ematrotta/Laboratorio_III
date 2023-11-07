import { ObtenerArrayConstructores } from "../Complementos/ArrayHelpers.js";
import { $, LetraCapital,ObtenerElementoPorId } from "../Complementos/ComplementedScripts.js";
import { ActualizarTablaPricipal } from "./TablaPrincipal.js";

export function InicializarFormularioPrincipal(propiedades,datos){
    const contenedorChecks = ObtenerElementoPorId("filtrosDeColumnas");
    const tablaPrincipal = ObtenerElementoPorId("tablaPrincipal");
    CrearChecks(contenedorChecks,propiedades);
    CrearOpcionesSelectPrincipal(ObtenerArrayConstructores(datos));
    ActualizarTablaPricipal(tablaPrincipal,propiedades,datos);
}

function CrearChecks(contenedor,arrPropiedades){

    arrPropiedades.forEach(propiedad => {
        const nuevoCheck = $("input");
        const nuevaLabel = $("label");
        nuevoCheck.type = "checkbox";
        nuevoCheck.checked = true;
        nuevoCheck.id = `chk-${propiedad}`;
        nuevaLabel.id = `lbl-${propiedad}`;
        nuevaLabel.innerText = LetraCapital(propiedad);
        nuevaLabel.setAttribute("for",nuevoCheck.id);
        nuevoCheck.addEventListener("change",(e)=>{
            e.preventDefault();
            const nuevoEvento = new CustomEvent("OcultarColumna",{detail:propiedad});
            document.dispatchEvent(nuevoEvento);
        })
        contenedor.appendChild(nuevoCheck);
        contenedor.appendChild(nuevaLabel);
    });

}

function CrearOpcionesSelectPrincipal(arrTipos){
    const selectPrincipal = ObtenerElementoPorId("selecionarTipofrmPrincipal");
    selectPrincipal.addEventListener("change",(e)=>{
        e.preventDefault();
        const nuevoEvento = new CustomEvent("FiltrarElementos",{detail:selectPrincipal.value});
        document.dispatchEvent(nuevoEvento);
    })
    arrTipos.forEach((tipo)=>{
        const nuevaOpcion = $("option");
        nuevaOpcion.value = tipo;
        nuevaOpcion.innerText = LetraCapital(tipo);
        selectPrincipal.appendChild(nuevaOpcion);
    })

}