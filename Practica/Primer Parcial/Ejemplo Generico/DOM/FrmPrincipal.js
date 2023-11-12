import { ObtenerArrayConstructores } from "../Complementos/ArrayHelpers.js";
import { $, LetraCapital,ObtenerElementoPorId } from "../Complementos/ComplementedScripts.js";
import { ActualizarTablaPricipal } from "./TablaPrincipal.js";


/**
 * Crea los elementos checks que muestran u ocultan columnas de la tabla prinicipal, 
 * Crea las opciones del selector principal a través de los constructores
 * @param {Array} propiedades Contiene las propiedades de todos los objetos, cualquiera sea su tipo
 * @param {Array} datos Contiene todos los objetos
 */
export function InicializarFormularioPrincipal(propiedades,datos){
    const contenedorChecks = ObtenerElementoPorId("filtrosDeColumnas");
    const tablaPrincipal = ObtenerElementoPorId("tablaPrincipal");
    CrearChecks(contenedorChecks,propiedades);
    CrearOpcionesSelectPrincipal(ObtenerArrayConstructores(datos));
    ActualizarTablaPricipal(tablaPrincipal,propiedades,datos);
}

/**
 * Crea los elementos checks y sus labels
 * @param {HTMLElement} contenedor Contenedor de los elementos checks y sus labels
 * @param {Array} arrPropiedades Propiedades de todos los objetos
 */
function CrearChecks(contenedor,arrPropiedades){

    arrPropiedades.forEach(propiedad => {
        const nuevoCheck = $("input");
        const nuevaLabel = $("label");
        nuevoCheck.type = "checkbox";
        nuevoCheck.checked = true;
        nuevoCheck.id = `chk-${propiedad}`;
        nuevaLabel.id = `lbl-${propiedad}`;
        nuevaLabel.innerText = LetraCapital(propiedad);
        // nuevaLabel.classList.add("horizontal-group");
        // nuevoCheck.classList.add("horizontal-group");
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

/**
 * 
 * @param {Array} arrTipos tipos de elementos que se quisieran mostrar en el select principal
 */
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