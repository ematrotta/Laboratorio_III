import { $,ObtenerElementoPorId,LetraCapital,AsignarClase,OcultarCampos} from "../Complementos/ComplementedScripts.js";


/**
 * Setea en "todos" el select contenido dentro del formulario ABM, hace visible el mismo, 
 * coloca en vacío todos los campos de texto, asigna una clase si es que no la posee a los datos generales
 * y otra a los datos especificos del objeto
 * @returns {Array} con los campos contenidos dentro de la división de tipo especial
 */
export function InicializarFrmABM(){
    const formularioABM = ObtenerElementoPorId("sectionFrmABM");
    const selectABM = ObtenerElementoPorId("selecionarTipofrmABM");
    selectABM.value = "todos";
    selectABM.selected = true;
    selectABM.disabled = false;

    if(!formularioABM.classList.contains("none-visible")){
        formularioABM.classList.add("none-visible");
    }
    const propiedadesVehiculosDivision = Array.from(ObtenerElementoPorId("camposVehiculo").children);
    const contenedorAtributosEspeciales = Array.from(ObtenerElementoPorId("camposSegunTipo").children);
    const campos = propiedadesVehiculosDivision.concat(contenedorAtributosEspeciales);

    campos.forEach((cmp)=>{
        if(cmp.tagName === "INPUT"){
            cmp.value = "";
        }
    })

    AsignarClase(propiedadesVehiculosDivision,"field-vehicle");
    AsignarClase(contenedorAtributosEspeciales,"field-typeOfVehicle");
    OcultarCampos(contenedorAtributosEspeciales,true);

    return contenedorAtributosEspeciales;
}


/**
 * Crea opciones para el select del formulario ABM
 * @param {Array} arrTipos array de las opciones para el formulario ABM
 */
export function CrearOpcionesSelectABM(arrTipos){
    const selectPrincipal = ObtenerElementoPorId("selecionarTipofrmABM");
    selectPrincipal.addEventListener("change",(e)=>{
        e.preventDefault();
        const nuevoEvento = new CustomEvent("SeleccionarTipoABM",{detail:selectPrincipal.value});
        document.dispatchEvent(nuevoEvento);
    })
    arrTipos.forEach((tipo)=>{
        const nuevaOpcion = $("option");
        nuevaOpcion.value = tipo;
        nuevaOpcion.innerText = LetraCapital(tipo);
        selectPrincipal.appendChild(nuevaOpcion);
    })
}