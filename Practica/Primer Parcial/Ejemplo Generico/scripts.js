import { AsignarId, ObtenerElementoPorId, OcultarCampos } from "./Complementos/ComplementedScripts.js";
import {ActualizarTablaPricipal} from "./DOM/TablaPrincipal.js";
import {Terrestre} from "./Entidades/Terrestre.js";
import {Aereo} from "./Entidades/Aereo.js";
import {Vehiculo} from "./Entidades/Vehiculo.js";
import { InicializarFormularioPrincipal } from "./DOM/FrmPrincipal.js";
import { CalcularPorPropiedad, FiltrarObjetos, ObtenerArrayConstructores, ObtenerArrayPropiedades, OrdenarObjetos } from "./Complementos/ArrayHelpers.js";
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

// Modificar según el tipo de objeto
/**
 * Obtiene el json string alojado en el local storage y lo transforma en un nuevo array de vehiculos
 * @param {string} keyLocalStorage 
 * @returns Array de vehiculos
 */
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

function ObtenerDatosDeCampos(arrCamposInput){
    const objetoTemporal = {};
    arrCamposInput.forEach((cp) => {
        let clave = cp.id.split("-")[1];
        let valor = cp.value;
        if (!isNaN(parseFloat(valor))) {
            valor = parseFloat(valor);
        }
        objetoTemporal[clave] = valor;
    });

    return objetoTemporal;
}

// Modificar según el tipo de objeto
function validarInputs(arrCamposInput, objType){
    let objetoTemporal = ObtenerDatosDeCampos(arrCamposInput);
    let datosInvalidos = [];

    datosInvalidos["modelo"] = objetoTemporal["modelo"] !== undefined && '';
    datosInvalidos["velMax"] = objetoTemporal["velMax"] > 0;
    datosInvalidos["anoFab"] = objetoTemporal["anoFab"] > 1885;
    if(objType === "terrestre"){
        datosInvalidos["cantPue"] = objetoTemporal["cantPue"] > -1;
        datosInvalidos["cantRue"] = objetoTemporal["cantRue"] > 0;
    }
    else if(objType === "aereo"){
        datosInvalidos["altMax"] = objetoTemporal["altMax"] > 0;
        datosInvalidos["autonomia"] = objetoTemporal["autonomia"] > 0;
    }
    return !Object.values(datosInvalidos).some(value => value === false);
}


document.addEventListener("DOMContentLoaded",function(){
    const keyLocalStorage = "vehiculos";
    const tablaPrincipal = ObtenerElementoPorId("tablaPrincipal");
    const sectionFrmABM = ObtenerElementoPorId("sectionFrmABM");
    const sectionFrmPrincipal = ObtenerElementoPorId("sectionFrmPrincipal");
    let selectPrincipal = ObtenerElementoPorId("selecionarTipofrmPrincipal");
    let propiedades = ObtenerArrayPropiedades(ObtenerVehiculos(keyLocalStorage));
    let objetosFiltrados = ObtenerVehiculos(keyLocalStorage);
    let selectABM = ObtenerElementoPorId("selecionarTipofrmABM");
    let botonCalcular = ObtenerElementoPorId("btnCalcularVelocidadMaxima");
    let botonAgregar = ObtenerElementoPorId("btnAgregar");
    let botonCancelarABM = ObtenerElementoPorId("btnCancelarRegistro");
    let botonEliminarABM = ObtenerElementoPorId("btnEliminarRegistro");
    let botonModificarABM = ObtenerElementoPorId("btnModificarRegistro");
    let botonAgregarABM = ObtenerElementoPorId("btnAgregarNuevo");

    InicializarFormularioPrincipal(propiedades,objetosFiltrados);
    InicializarFrmABM();
    CrearOpcionesSelectABM(ObtenerArrayConstructores(objetosFiltrados));

    /**
     * Evento generado desde la creación de los checks dentro del formulario principal.
     * verifica aquellos checks que no esten activos y sobreescribe la variable global propiedades
     * que se utiliza para actualizar la tabla en pantalla, eliminando la columna o incorporandola si no estaba
     * visible
     */
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

    /**
     * Evento generado desde la creación del formulario principal.
     * verifica el valor contenido en el select del formulario principal, filtra los objetos segun el constructor
     * y sobreescribe la variable global para que solo se muestren en la tabla los objetos filtrados
     */
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

    /**
     * Evento generado desde la creación del formulario abm.
     * Al cambiar el tipo del select dentro del abm
     * deja visibles solo aquellos campos que correspondan al objeto
     */
    document.addEventListener("SeleccionarTipoABM",(e)=>{
        const valorSeleccionado = e.detail;
        const camposVehiculoPorTipo = ObtenerElementoPorId("camposSegunTipo").children;

        const vehiculos = ObtenerVehiculos(keyLocalStorage);
        const tipoVehiculoSelecionado = vehiculos.find((vehiculo)=>vehiculo.constructor.name.toLowerCase() === valorSeleccionado);
        for(let i = 0;i<camposVehiculoPorTipo.length;i++){
            let propiedad = camposVehiculoPorTipo[i].id.split("-")[1];
            // Realizamos la siguiente validacion por si es que no existen objetos con ese constructor. ej "todos"
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

    /**
     * Evento generado desde la creación del formulario principal.
     * Al hacer doble click sobre una de las filas, obtendremos el id de ese objeto,
     * a traves del mismo, buscaremos el objeto dentro del array y visualizaremos y asignaremos los valores que contiene
     * a cada campo correspondiente
     */
    document.addEventListener("AbrirFormularioABM",(e)=>{
        const idObjeto = e.detail;
        OcultarCampos([botonEliminarABM],false);
        OcultarCampos([botonModificarABM],false);
        OcultarCampos([botonAgregarABM],true);
        const objetos = ObtenerVehiculos(keyLocalStorage);
        const objeto = objetos.find((o)=>o.id == idObjeto);
        const nombreTipo = objeto.constructor.name.toLowerCase();
        const camposTipoVehiculo = InicializarFrmABM().filter((e)=>e.tagName === "INPUT" || e.tagName === "LABEL");
        const camposVehiculo = Array.from(ObtenerElementoPorId("camposVehiculo").children).filter((e)=>e.tagName === "INPUT");
        const camposTexto = camposVehiculo.concat(camposTipoVehiculo);
        const propiedadesObjeto = Object.getOwnPropertyNames(objeto);


        sectionFrmABM.classList.remove("none-visible");
        sectionFrmPrincipal.classList.add("none-visible");

        // Inhabilitamos la selección del tipo
        selectABM.value = nombreTipo;
        selectABM.selected = true;
        selectABM.disabled = true;

        // No se puede utilizar foreach debido a que el return no corta la ejecución 
        for (const campo of camposTexto) {
            // Extraemos de las labels o inputs la propiedad contenida en su id y la utilizamos para asignarselo a los campos de texto
            let nombreCampo = campo.id.split("-")[1];
            if (propiedadesObjeto.includes(nombreCampo)) {

                if(campo.tagName === "INPUT"){
                    campo.value = objeto[nombreCampo];
                }

                // Ponemos visibles solo los campos correspondientes
                if (campo.classList.contains(`none-visible`)) {
                    campo.classList.remove(`none-visible`);
                }
            }
        }

    });

    document.addEventListener("OrdenarTabla",(e)=>{
        e.preventDefault();
        // Ordenamos los objetos que sean visibles, es decir que esten filtrados unicamente
        const objetosOrdenados = OrdenarObjetos(objetosFiltrados,e.detail);
        objetosFiltrados = objetosOrdenados;
        ActualizarTablaPricipal(tablaPrincipal,propiedades,objetosFiltrados);
    });

    botonAgregar.addEventListener("click",(e)=>{
        e.preventDefault();
        InicializarFrmABM();
        OcultarCampos([botonEliminarABM],true);
        OcultarCampos([botonModificarABM],true);
        OcultarCampos([botonAgregarABM],false);
        sectionFrmABM.classList.remove("none-visible");
        sectionFrmPrincipal.classList.add("none-visible");
    });

    botonCancelarABM.addEventListener("click",(e)=>{
        e.preventDefault();
        InicializarFrmABM();
        sectionFrmABM.classList.add("none-visible");
        sectionFrmPrincipal.classList.remove("none-visible");
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
        selectPrincipal.value = "todos";
        selectPrincipal.selected = true;
        ActualizarTablaPricipal(tablaPrincipal,propiedades,objetosFiltrados);
        sectionFrmABM.classList.add("none-visible");
        sectionFrmPrincipal.classList.remove("none-visible");
    });

    botonModificarABM.addEventListener("click",(e)=>{
        e.preventDefault();
        let camposPropiedades = [];
        const objetos = ObtenerVehiculos(keyLocalStorage);
        const camposTipoVehiculo = Array.from(ObtenerElementoPorId("camposSegunTipo").children).filter((e)=>e.tagName === "INPUT");
        const camposVehiculo = Array.from(ObtenerElementoPorId("camposVehiculo").children).filter((e)=>e.tagName === "INPUT");
        camposPropiedades = camposVehiculo.concat(camposTipoVehiculo);

        let resultadoValidacion = validarInputs(camposPropiedades,selectPrincipal.value);

        if(resultadoValidacion === true){
            const objetoTemporal = ObtenerDatosDeCampos(camposPropiedades);

            for(let i = 0;i<objetos.length;i++){
                let objeto = objetos[i];
                // Obtenemos todas las propiedades del objeto excepto el id que no se modifica
                let propiedadesObjeto = Object.getOwnPropertyNames(objeto).filter((p)=>p!=="id");
                if(objeto.id == objetoTemporal.id){
                    // Solo actualizamos al objeto, las propiedades que correspondan.
                    propiedadesObjeto.forEach((p)=>{
                        objeto[p] = objetoTemporal[p];
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
            sectionFrmABM.classList.add("none-visible");
            sectionFrmPrincipal.classList.remove("none-visible");
        }else{
            alert("Alguno de los datos es erroneo");
        }


    });

    botonAgregarABM.addEventListener("click", (e) => {
        e.preventDefault();
        let camposPropiedades = [];
        let nuevoObjeto = {};
        const objetos = ObtenerVehiculos(keyLocalStorage);
        const nuevoId = AsignarId(objetos);
        const camposTipoVehiculo = Array.from(ObtenerElementoPorId("camposSegunTipo").children).filter((e) => e.tagName === "INPUT");
        const camposVehiculo = Array.from(ObtenerElementoPorId("camposVehiculo").children).filter((e) => e.tagName === "INPUT");
        const elementoSeleccionado = selectABM.value;
        camposPropiedades = camposVehiculo.concat(camposTipoVehiculo);
        let objetoTemporal = ObtenerDatosDeCampos(camposPropiedades);
    
        if (elementoSeleccionado !== "todos") {
            // Modificar según el tipo de objeto
            // validamos a través de un objeto creado de manera tempral que queda campo sea correcto a través del 
            // constructor de cada clase
    
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
                selectPrincipal.value = "todos";
                selectPrincipal.selected = true;
                ActualizarTablaPricipal(tablaPrincipal, propiedades, objetosFiltrados);
                sectionFrmABM.classList.add("none-visible");
                sectionFrmPrincipal.classList.remove("none-visible");
    
            } catch (e) {
                alert(e.message);
            }
    
        } else {
            alert("Debe seleccionar al menos un tipo");
        }
    
    });
    



})