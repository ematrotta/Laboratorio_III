import { $,EliminarElementos, ObtenerElementoPorId,LetraCapital} from "../Complementos/ComplementedScripts.js";

export function InicializarFrmABM(){
    const formularioABM = ObtenerElementoPorId("frmABM");
    if(!formularioABM.classList.contains("none-visible")){
        formularioABM.classList.add("none-visible");
    }
    const propiedadesVehiculosDivision = ObtenerElementoPorId("camposVehiculo").children;
    const contenedorAtributosEspeciales = ObtenerElementoPorId("camposSegunTipo").children;


    for(let i = 0;i<propiedadesVehiculosDivision.length;i++){
        let campoVehiculo = propiedadesVehiculosDivision[i];
        switch(campoVehiculo.tagName){
            case "INPUT":
                campoVehiculo.value = "";
                break;
            case "SELECT":
                campoVehiculo.value = "todos";
                break;
        }
        campoVehiculo.classList.add(`field-vehicle`);
    }
    for(let i = 0;i<contenedorAtributosEspeciales.length;i++){
        let campoVehiculo = contenedorAtributosEspeciales[i];
        if(campoVehiculo.tagName === "INPUT"){
            campoVehiculo.value = "";
        }
        campoVehiculo.classList.add(`field-typeOfVehicle`);
        if(!campoVehiculo.classList.contains(`field-typeOfVehicle`)){
            campoVehiculo.classList.add(`field-typeOfVehicle`);
        }
        if(!campoVehiculo.classList.contains(`none-visible`)){
            campoVehiculo.classList.add(`none-visible`);
        }

    }
    return contenedorAtributosEspeciales;
}


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