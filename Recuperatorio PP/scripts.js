import { AsignarId, ObtenerElementoPorId, OcultarCampos } from "./Complementos/ComplementedScripts.js";
import {ActualizarTablaPricipal} from "./DOM/TablaPrincipal.js";
import {Persona} from "./Entidades/Persona.js";
import {Futbolista} from "./Entidades/Futbolista.js";
import {Profesional} from "./Entidades/Profesional.js";
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
 * Obtiene el json string alojado en el local storage y lo transforma en un nuevo array de Personas
 * @param {string} keyLocalStorage 
 * @returns Array de Personas
 */
function ObtenerPersonas(keyLocalStorage){
    const jsonArr = localStorage.getObjects(keyLocalStorage);
    const objArr = jsonArr.map((obj)=>{
        if(obj.hasOwnProperty("equipo") && obj.hasOwnProperty("posicion") && obj.hasOwnProperty("cantidadGoles"))
        {
            return new Futbolista(obj.id,obj.nombre,obj.apellido,obj.edad,obj.equipo,obj.posicion,obj.cantidadGoles);
        }else if(obj.hasOwnProperty("titulo") && obj.hasOwnProperty("facultad") && obj.hasOwnProperty("añoGraduacion")){
            return new Profesional(obj.id,obj.nombre,obj.apellido,obj.edad,obj.titulo,obj.facultad,obj.añoGraduacion);
        }else{
            return new Persona(obj.id,obj.nombre,obj.apellido,obj.edad);
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
    datosInvalidos["nombre"] = objetoTemporal["nombre"] !== undefined && objetoTemporal["nombre"] !=='';
    datosInvalidos["apellido"] = objetoTemporal["apellido"] !== undefined && objetoTemporal["apellido"] !=='';
    datosInvalidos["edad"] = objetoTemporal["edad"] > 15;
    if(objType === "futbolista"){
        datosInvalidos["equipo"] = objetoTemporal["equipo"] !== undefined && objetoTemporal["equipo"] !=='';
        datosInvalidos["posicion"] = objetoTemporal["posicion"] !== undefined && objetoTemporal["posicion"] !=='';
        datosInvalidos["cantidadGoles"] = objetoTemporal["cantidadGoles"] > -1;
    }
    else if(objType === "profesional"){
        datosInvalidos["titulo"] = objetoTemporal["titulo"] !== undefined && objetoTemporal["titulo"] !=='';
        datosInvalidos["facultad"] = objetoTemporal["facultad"] !== undefined && objetoTemporal["facultad"] !=='';
        datosInvalidos["añoGraduacion"] = objetoTemporal["añoGraduacion"] > 1950;
    }
    return !Object.values(datosInvalidos).some(value => value === false);
}


document.addEventListener("DOMContentLoaded",function(){
    const keyLocalStorage = "personas";
    const tablaPrincipal = ObtenerElementoPorId("tablaPrincipal");
    const sectionFrmABM = ObtenerElementoPorId("sectionFrmABM");
    const sectionFrmPrincipal = ObtenerElementoPorId("sectionFrmPrincipal");
    let selectPrincipal = ObtenerElementoPorId("selecionarTipofrmPrincipal");
    let propiedades = ObtenerArrayPropiedades(ObtenerPersonas(keyLocalStorage));
    let objetosFiltrados = ObtenerPersonas(keyLocalStorage);
    let selectABM = ObtenerElementoPorId("selecionarTipofrmABM");
    let botonCalcular = ObtenerElementoPorId("btnCalcular");
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
        const txtCalcular = ObtenerElementoPorId("txtPromedio");
        if(valorFiltrado !== "todos"){
            objetosFiltrados = FiltrarObjetos(ObtenerPersonas(keyLocalStorage),valorFiltrado,true);
        }
        else{
            objetosFiltrados = ObtenerPersonas(keyLocalStorage);
        }
        ActualizarTablaPricipal(tablaPrincipal,propiedades,objetosFiltrados);
        txtCalcular.value = "";
    });

    botonCalcular.addEventListener("click",(e)=>{
        e.preventDefault();
        const resultado = CalcularPorPropiedad(objetosFiltrados,"edad");
        const txtCalcular = ObtenerElementoPorId("txtPromedio");
        txtCalcular.value = parseFloat(resultado/objetosFiltrados.length).toFixed(2);
    });

    /**
     * Evento generado desde la creación del formulario abm.
     * Al cambiar el tipo del select dentro del abm
     * deja visibles solo aquellos campos que correspondan al objeto
     */
    document.addEventListener("SeleccionarTipoABM",(e)=>{
        const valorSeleccionado = e.detail;
        const camposPersonaPorTipo = ObtenerElementoPorId("camposSegunTipo").children;

        const Personas = ObtenerPersonas(keyLocalStorage);
        const tipoPersonaSelecionado = Personas.find((Persona)=>Persona.constructor.name.toLowerCase() === valorSeleccionado);
        for(let i = 0;i<camposPersonaPorTipo.length;i++){
            let propiedad = camposPersonaPorTipo[i].id.split("-")[1];
            // Realizamos la siguiente validacion por si es que no existen objetos con ese constructor. ej "todos"
            if(tipoPersonaSelecionado !== undefined && tipoPersonaSelecionado.hasOwnProperty(propiedad)){
                camposPersonaPorTipo[i].classList.remove("none-visible");
            }
            else{
                if(!camposPersonaPorTipo[i].classList.contains("none-visible")){
                    camposPersonaPorTipo[i].classList.add("none-visible");
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
        const objetos = ObtenerPersonas(keyLocalStorage);
        const objeto = objetos.find((o)=>o.id == idObjeto);
        const nombreTipo = objeto.constructor.name.toLowerCase();
        const camposTipoPersona = InicializarFrmABM().filter((e)=>e.tagName === "INPUT" || e.tagName === "LABEL");
        const camposPersona = Array.from(ObtenerElementoPorId("camposPersona").children).filter((e)=>e.tagName === "INPUT");
        const camposTexto = camposPersona.concat(camposTipoPersona);
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
        const objetos = ObtenerPersonas(keyLocalStorage);
        const resultado = window.confirm("¿Estás seguro de realizar esta acción?");
        if (resultado) {
            const nuevoArray = objetos.filter((o)=>o.id !== idObjeto);
            localStorage.setObjects(keyLocalStorage,nuevoArray);
        // El usuario hizo clic en "OK"
        alert("Registro Eliminado con exito");
        } 
        InicializarFrmABM();
        objetosFiltrados = ObtenerPersonas(keyLocalStorage);
        selectPrincipal.value = "todos";
        selectPrincipal.selected = true;
        ActualizarTablaPricipal(tablaPrincipal,propiedades,objetosFiltrados);
        sectionFrmABM.classList.add("none-visible");
        sectionFrmPrincipal.classList.remove("none-visible");
    });

    botonModificarABM.addEventListener("click",(e)=>{
        e.preventDefault();
        let camposPropiedades = [];
        const objetos = ObtenerPersonas(keyLocalStorage);
        const camposTipoPersona = Array.from(ObtenerElementoPorId("camposSegunTipo").children).filter((e)=>e.tagName === "INPUT");
        const camposPersona = Array.from(ObtenerElementoPorId("camposPersona").children).filter((e)=>e.tagName === "INPUT");
        camposPropiedades = camposPersona.concat(camposTipoPersona);

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
            objetosFiltrados = ObtenerPersonas(keyLocalStorage);
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
        const objetos = ObtenerPersonas(keyLocalStorage);
        const nuevoId = AsignarId(objetos);
        const camposTipoPersona = Array.from(ObtenerElementoPorId("camposSegunTipo").children).filter((e) => e.tagName === "INPUT");
        const camposPersona = Array.from(ObtenerElementoPorId("camposPersona").children).filter((e) => e.tagName === "INPUT");
        const elementoSeleccionado = selectABM.value;
        camposPropiedades = camposPersona.concat(camposTipoPersona);
        let objetoTemporal = ObtenerDatosDeCampos(camposPropiedades);
    
        if (elementoSeleccionado !== "todos") {
            // Modificar según el tipo de objeto
            // validamos a través de un objeto creado de manera tempral que queda campo sea correcto a través del 
            // constructor de cada clase
    
            try {
                switch (elementoSeleccionado) {
                    case "futbolista":
                        nuevoObjeto = new Futbolista(nuevoId,objetoTemporal.nombre,objetoTemporal.apellido,objetoTemporal.edad,objetoTemporal.equipo,objetoTemporal.posicion,objetoTemporal.cantidadGoles);
                        break;
                    case "profesional":
                        nuevoObjeto = new Profesional(nuevoId, objetoTemporal.nombre,objetoTemporal.apellido,objetoTemporal.edad,objetoTemporal.titulo,objetoTemporal.facultad,objetoTemporal.añoGraduacion);
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

                objetosFiltrados = ObtenerPersonas(keyLocalStorage);
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