import { AsignarId, ObtenerElementoPorId } from "./Complementos/ComplementedScripts.js";
import {ActualizarTablaPricipal} from "./DOM/TablaPrincipal.js";
import {Terrestre} from "./Entidades/Terrestre.js";
import {Aereo} from "./Entidades/Aereo.js";
import {Vehiculo} from "./Entidades/Vehiculo.js";
import { InicializarFormularioPrincipal } from "./DOM/FrmPrincipal.js";
import { CalcularPorPropiedad, FiltrarObjetos, ObtenerArrayConstructores, ObtenerArrayPropiedades } from "./Complementos/ArrayHelpers.js";
import { CrearOpcionesSelectABM,InicializarFrmABM} from "./DOM/FrmABM.js";

// [
//     {"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},
//     {"id":51, "modelo":"Dodge Viper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},
//     {"id":67, "modelo":"Boeing CH-47 Chinook", "anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},
//     {"id":666, "modelo":"Aprilia RSV 1000 R", "anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},
//     {"id":872, "modelo":"Boeing 747-400", "anoFab":1989, "velMax":988, "altMax":13, "autonomia":13450},
//     {"id":742, "modelo":"Cessna CH-1 SkyhookR", "anoFab":1953, "velMax":174, "altMax":3, "autonomia":870}
// ]

Storage.prototype.getObjects = function(key){
    return (JSON.parse(this.getItem(key)));
}

Storage.prototype.setObjects = function(key,objects){
    return (this.setItem(key,JSON.stringify(objects)));
}

function ObtenerVehiculos(keyLocalStorage){
    const jsonArr = localStorage.getObjects(keyLocalStorage);
    const objArr = jsonArr.map((obj)=>{
        if(obj.hasOwnProperty("cantPue") && obj.hasOwnProperty("cantRue"))
        {
            return new Terrestre(obj.id,obj.modelo,obj.anoFab,obj.velMax,obj.cantPue,obj.cantRue);
        }else if(obj.hasOwnProperty("altMax") && obj.hasOwnProperty("autonomia")){
            return new Aereo(obj.id,obj.modelo,obj.anoFab,obj.velMax,obj.altMax,obj.autonomia);
        }else{
            return new Vehiculo(obj.id,obj.modelo,obj.anoFab,obj.velMax);
        }
    })

    return objArr;
}


document.addEventListener("DOMContentLoaded",function(){
    const keyLocalStorage = "vehiculos";
    const tablaPrincipal = ObtenerElementoPorId("tablaPrincipal");
    const frmABM = ObtenerElementoPorId("frmABM");
    const frmPrincipal = ObtenerElementoPorId("frmPrincipal");
    let propiedades = ObtenerArrayPropiedades(ObtenerVehiculos(keyLocalStorage));
    let objetosFiltrados = ObtenerVehiculos(keyLocalStorage);
    let botonCalcular = ObtenerElementoPorId("btnCalcularVelocidadMaxima");
    let botonAgregar = ObtenerElementoPorId("btnAgregar");
    let botonCancelarABM = ObtenerElementoPorId("btnCancelarRegistro");
    let botonEliminarABM = ObtenerElementoPorId("btnEliminarRegistro");
    let botonModificarABM = ObtenerElementoPorId("btnModificarRegistro");
    let botonAgregarABM = ObtenerElementoPorId("btnAgregarNuevo");

    InicializarFormularioPrincipal(propiedades,objetosFiltrados);
    InicializarFrmABM();
    CrearOpcionesSelectABM(ObtenerArrayConstructores(objetosFiltrados));

    document.addEventListener("OcultarColumna",(e)=>{
        const checks = ObtenerElementoPorId("filtrosDeColumnas").children;
        const propiedadesVisibles = [];
        for(let i=0;i<checks.length;i++){
            let elemento = checks[i];
            if(elemento.tagName === "INPUT" && elemento.checked === true){
                let propiedad = elemento.id.split("-")[1];
                propiedadesVisibles.push(propiedad);

            }
        }
        propiedades = propiedadesVisibles;
        ActualizarTablaPricipal(tablaPrincipal,propiedades,objetosFiltrados);
    });

    document.addEventListener("FiltrarElementos",(e)=>{
        const valorFiltrado = e.detail;
        const txtCalcular = ObtenerElementoPorId("txtPromedioVelocidadMaxima");
        if(valorFiltrado !== "todos"){
            objetosFiltrados = FiltrarObjetos(ObtenerVehiculos(keyLocalStorage),valorFiltrado,true);
        }
        else{
            objetosFiltrados = ObtenerVehiculos(keyLocalStorage);
        }
        ActualizarTablaPricipal(tablaPrincipal,propiedades,objetosFiltrados);
        txtCalcular.value = "";
    });

    botonCalcular.addEventListener("click",(e)=>{
        e.preventDefault();
        const resultado = CalcularPorPropiedad(objetosFiltrados,"velMax");
        const txtCalcular = ObtenerElementoPorId("txtPromedioVelocidadMaxima");
        txtCalcular.value = parseFloat(resultado/objetosFiltrados.length).toFixed(2);
    });

    document.addEventListener("SeleccionarTipoABM",(e)=>{
        const valorSeleccionado = e.detail;
        const camposVehiculoPorTipo = ObtenerElementoPorId("camposSegunTipo").children;

        const vehiculos = ObtenerVehiculos(keyLocalStorage);
        const tipoVehiculoSelecionado = vehiculos.find((vehiculo)=>vehiculo.constructor.name.toLowerCase() === valorSeleccionado);
        for(let i = 0;i<camposVehiculoPorTipo.length;i++){
            let propiedad = camposVehiculoPorTipo[i].id.split("-")[1];
            // Realizamos la siguiente validacion por si es que no existen objetos con ese constructor
            if(tipoVehiculoSelecionado !== undefined && tipoVehiculoSelecionado.hasOwnProperty(propiedad)){
                camposVehiculoPorTipo[i].classList.remove("none-visible");
            }
            else{
                if(!camposVehiculoPorTipo[i].classList.contains("none-visible")){
                    camposVehiculoPorTipo[i].classList.add("none-visible");
                }

            }
        }
    });

    document.addEventListener("AbrirFormularioABM",(e)=>{
        const idObjeto = e.detail;
        const objetos = ObtenerVehiculos(keyLocalStorage);
        const objeto = objetos.find((o)=>o.id == idObjeto);
        const nombreTipo = objeto.constructor.name.toLowerCase();
        const camposTipoVehiculo = Array.from(InicializarFrmABM()).filter((e)=>e.tagName === "INPUT" || e.tagName === "LABEL");
        const camposVehiculo = Array.from(ObtenerElementoPorId("camposVehiculo").children).filter((e)=>e.tagName === "INPUT");
        const camposTexto = camposVehiculo.concat(camposTipoVehiculo);
        const selectABM = ObtenerElementoPorId("selecionarTipofrmABM");
        const propiedadesObjeto = Object.getOwnPropertyNames(objeto);


        frmABM.classList.remove("none-visible");
        frmPrincipal.classList.add("none-visible");

        selectABM.value = nombreTipo;
        selectABM.selected = true;
        selectABM.disabled = true;

        // No se puede utilizar foreach debido a que el return no corta la ejecución 
        for (const campo of camposTexto) {
            let nombreCampo = campo.id.split("-")[1];
            if (propiedadesObjeto.includes(nombreCampo)) {
                campo.value = objeto[nombreCampo];
                if (campo.classList.contains(`none-visible`)) {
                    campo.classList.remove(`none-visible`);
                }
            }
        }

    });

    botonAgregar.addEventListener("click",(e)=>{
        e.preventDefault();
        InicializarFrmABM();
        frmABM.classList.remove("none-visible");
        frmPrincipal.classList.add("none-visible");
    });

    botonCancelarABM.addEventListener("click",(e)=>{
        e.preventDefault();
        InicializarFrmABM();
        frmABM.classList.add("none-visible");
        frmPrincipal.classList.remove("none-visible");
    });

    botonEliminarABM.addEventListener("click",(e)=>{
        e.preventDefault();
        const idObjeto = parseInt(ObtenerElementoPorId("txt-id").value);
        const objetos = ObtenerVehiculos(keyLocalStorage);
        const resultado = window.confirm("¿Estás seguro de realizar esta acción?");
        if (resultado) {
            const nuevoArray = objetos.filter((o)=>o.id !== idObjeto);
            localStorage.setObjects(keyLocalStorage,nuevoArray);
        // El usuario hizo clic en "OK"
        alert("Registro Eliminado con exito");
        } 
        InicializarFrmABM();
        objetosFiltrados = ObtenerVehiculos(keyLocalStorage);
        ActualizarTablaPricipal(tablaPrincipal,propiedades,objetosFiltrados);
        frmABM.classList.add("none-visible");
        frmPrincipal.classList.remove("none-visible");
    });

    botonModificarABM.addEventListener("click",(e)=>{
        e.preventDefault();
        let camposPropiedades = [];
        const objetos = ObtenerVehiculos(keyLocalStorage);
        const camposTipoVehiculo = Array.from(ObtenerElementoPorId("camposSegunTipo").children).filter((e)=>e.tagName === "INPUT");
        const camposVehiculo = Array.from(ObtenerElementoPorId("camposVehiculo").children).filter((e)=>e.tagName === "INPUT");

        camposPropiedades = camposVehiculo.concat(camposTipoVehiculo);
        let campoId = camposPropiedades.find((campo)=>campo.id.split("-")[1] == "id");

        for(let i = 0;i<objetos.length;i++){
            let objeto = objetos[i];
            if(objeto.id == campoId.value){
                camposPropiedades.forEach((cp)=>{
                    let campoPropiedad = cp.id.split("-")[1];
                    if(campoPropiedad !== "id" && objeto.hasOwnProperty(campoPropiedad)){
                        // Modificar en caso de ser una entidad distinta:
                        let valorCampo = cp.value;
                        if(campoPropiedad !== "modelo"){
                            valorCampo = parseFloat(valorCampo);
                        }
                        objeto[campoPropiedad] = valorCampo;
                    }
                })
                break;
            }
        }
        const resultado = window.confirm("¿Estás seguro de realizar esta acción?");
        if (resultado) {
            localStorage.setObjects(keyLocalStorage,objetos);
        // El usuario hizo clic en "OK"
        alert("Registro Modificado con exito");
        } 
        InicializarFrmABM();
        objetosFiltrados = ObtenerVehiculos(keyLocalStorage);
        ActualizarTablaPricipal(tablaPrincipal,propiedades,objetosFiltrados);
        frmABM.classList.add("none-visible");
        frmPrincipal.classList.remove("none-visible");
    });

    botonAgregarABM.addEventListener("click", (e) => {
        e.preventDefault();
        let camposPropiedades = [];
        let nuevoObjeto = {};
        const objetos = ObtenerVehiculos(keyLocalStorage);
        const nuevoId = AsignarId(objetos);
        const camposTipoVehiculo = Array.from(ObtenerElementoPorId("camposSegunTipo").children).filter((e) => e.tagName === "INPUT");
        const camposVehiculo = Array.from(ObtenerElementoPorId("camposVehiculo").children).filter((e) => e.tagName === "INPUT");
        const elementoSeleccionado = ObtenerElementoPorId("selecionarTipofrmABM").value;
        camposPropiedades = camposVehiculo.concat(camposTipoVehiculo);
        let objetoTemporal = {};
    
        camposPropiedades.forEach((cp) => {
            let clave = cp.id.split("-")[1];
            let valor = cp.value;
            if (!isNaN(parseFloat(valor))) {
                valor = parseFloat(valor);
            }
            objetoTemporal[clave] = valor;
        });
    
        if (elementoSeleccionado !== "todos") {
    
            try {
                switch (elementoSeleccionado) {
                    case "terrestre":
                        nuevoObjeto = new Terrestre(nuevoId, objetoTemporal.modelo, objetoTemporal.anoFab, objetoTemporal.velMax, objetoTemporal.cantPue, objetoTemporal.cantRue);
                        break;
                    case "aereo":
                        nuevoObjeto = new Aereo(nuevoId, objetoTemporal.modelo, objetoTemporal.anoFab, objetoTemporal.velMax, objetoTemporal.altMax, objetoTemporal.autonomia);
                        break;
                }
    
                const resultado = window.confirm("¿Estás seguro de realizar esta acción?");
                if (resultado) {
                    objetos.push(nuevoObjeto);
                    localStorage.setObjects(keyLocalStorage, objetos);
    
                    // El usuario hizo clic en "OK"
                    alert("Registro agregado con exito");
                }
                InicializarFrmABM();
                objetosFiltrados = ObtenerVehiculos(keyLocalStorage);
                ActualizarTablaPricipal(tablaPrincipal, propiedades, objetosFiltrados);
                frmABM.classList.add("none-visible");
                frmPrincipal.classList.remove("none-visible");
    
            } catch (e) {
                alert(e.message);
            }
    
        } else {
            alert("Debe seleccionar al menos un tipo");
        }
    
    });
    



})