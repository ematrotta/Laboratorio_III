import { ObtenerArrayConstructores, ObtenerArrayPropiedades } from "./Complementos/ArrayHelpers.js";
import { $, ObtenerDatosDeCampos, OcultarCampos } from "./Complementos/ComplementedScripts.js";
import { ActualizarTablaPricipal } from "./DOM/TablaPrincipal.js";
import { CrearFrmABM } from "./DOM/FrmABM.js";
import { ConvertirEnObjetos, ObtenerArrayPropiedadesPorTipo, ValidarCamposInput } from "./Complementos/ObjectHelpers.js";

Storage.prototype.getObjects = function(key){
    return (JSON.parse(this.getItem(key)));
}

Storage.prototype.setObjects = function(key,objects){
    return (this.setItem(key,JSON.stringify(objects)));
}

function ObtenerObjetos(){
    let respuesta;
    let objArr;
    const cuerpo = $("cuerpo");
    const spinner = $("spinnerLoad");
    // Ocultamos el cuerpo
    OcultarCampos([cuerpo],true);
    OcultarCampos([spinner],false);

    const xhttp = new XMLHttpRequest(); //Instancio el objeto
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if(this.status == 200){
                //Acción a ejecutar cuando el estado es 200 ok y el readyState=4 (respuesta lista)
                const nuevoEvento = new CustomEvent("RecargarTabla",{detail:this.responseText});
                document.dispatchEvent(nuevoEvento);
            }
            else{
                spinner.style.display = "none";
                alert("No se pudo acceder al recurso");
            }
        };
    }; //Configúro manejador para cambio de estado
    xhttp.open("GET", "http://localhost/API_LaboIII/PersonasEmpleadosClientes.php", true); //Inicializo la solicitud
    xhttp.send(); //Envio la solicitud
}

document.addEventListener("DOMContentLoaded",()=>{
    let propiedades;
    let EventoCargarFrm;
    let arrObjetos;
    const spinner = $("spinnerLoad");
    const cuerpo = $("cuerpo");
    const frmLista = $("frmLista");
    const frmABM = $("frmABM");
    const camposABM = $("fieldsObjs");
    const tabla = $("tablaLista");
    const botonAgregar = $("btnAgregar");
    const botonCancelarABM = $("btnCancelarABM");
    const botonAceptarABM = $("btnAceptarABM");
    const h3TipoOperacion = $("tipoOperacion");

    ObtenerObjetos();
    document.addEventListener("RecargarTabla",(e)=>{
        // Ocultamos los elementos que no queremos que se muestren
        const respuesta = e.detail;
        const jsonArr = JSON.parse(respuesta);
        arrObjetos = ConvertirEnObjetos(jsonArr); //Convierte en los objetos correspondientes
        OcultarCampos([spinner],true);
        OcultarCampos([cuerpo],false);
        OcultarCampos([frmLista],false);
        OcultarCampos([frmABM],true);

        localStorage.setObjects("personas",)
        if(arrObjetos === undefined){
            alert("El array de objetos es undefined");
        }else{
            localStorage.setObjects("personas",JSON.stringify(arrObjetos));
            propiedades = ObtenerArrayPropiedades(arrObjetos);
            ActualizarTablaPricipal(tabla,propiedades,arrObjetos);
        };

    });

    botonAgregar.addEventListener("click",(e)=>{
        e.preventDefault();
        h3TipoOperacion.innerText = "Agregar";
        OcultarCampos([frmLista],true);
        OcultarCampos([frmABM],false);
        CrearFrmABM(camposABM,propiedades);
    });

    document.addEventListener("mostrarCamposEspecificos",(e)=>{
        const selectABM = e.detail;
        const valorSeleccionado = selectABM.value;
        const camposObjetosABM = Array.from(camposABM.children).filter((cmp)=>cmp.tagName === "INPUT" || cmp.tagName === "LABEL");
        let propiedadesObjeto = ObtenerArrayPropiedadesPorTipo(valorSeleccionado);

        if(valorSeleccionado !== "seleccione"){
            camposObjetosABM.forEach((cmp)=>{
                const propiedadCampo = cmp.id.split("-")[1];
                if(!propiedadesObjeto.includes(propiedadCampo)){
                    OcultarCampos([cmp],true);
                }else{
                    OcultarCampos([cmp],false);
                }
    
                
            });
        }else{
            // Ocultamos los nodos hermanos
            let proximoNodoHermano = selectABM.nextSibling;
            while(proximoNodoHermano){
                OcultarCampos([proximoNodoHermano],true);
                proximoNodoHermano = proximoNodoHermano.nextSibling;
            }
        }

    });

    botonCancelarABM.addEventListener("click",(e)=>{
        e.preventDefault();
        OcultarCampos([frmLista],false);
        OcultarCampos([frmABM],true);
        h3TipoOperacion.innerText = "";
    });

    function ManejadorEventoCargarABM(objeto){
        // Verificamos que el evento no esté creado
        if(!EventoCargarFrm){
            const nuevoEvento = new CustomEvent("CargarFrmABM",{detail:objeto});
            document.dispatchEvent(nuevoEvento);
        }

    }

    document.addEventListener("modificar",(e)=>{
        const objeto = e.detail;
        h3TipoOperacion.innerText = "Modificar";
        ManejadorEventoCargarABM(objeto);

    })

    document.addEventListener("eliminar",(e)=>{
        const objeto = e.detail;
        h3TipoOperacion.innerText = "Eliminar";
        ManejadorEventoCargarABM(objeto);
    })

    botonAceptarABM.addEventListener("click",(e)=>{
        e.preventDefault();
        const tipoOperacion = h3TipoOperacion.innerText.toLowerCase();
        const camposTexto = Array.from(camposABM.children).filter((cmp)=>cmp.tagName === "INPUT");
        const tipoObjeto = Array.from(camposABM.children).find((cmp)=>cmp.tagName === "SELECT").value;
        const objetoTemporal = ObtenerDatosDeCampos(camposTexto);
        if(ValidarCamposInput(objetoTemporal,tipoObjeto)){
            switch(tipoOperacion){
                case "agregar":
                    break;
                case "eliminar":
                    break;
                case "modificar":
                    break;
            }
            alert("todo ok");
        }else{
            alert("Alguno de los datos es erroneo");
        }

    })

    document.addEventListener("CargarFrmABM",(e)=>{
        const objeto = e.detail;
        OcultarCampos([frmLista],true);
        OcultarCampos([frmABM],false);
        CrearFrmABM(camposABM,propiedades);
        const camposFrmABM = Array.from(camposABM.children);
        const nombreContructor = ObtenerArrayConstructores([objeto])[0].toLowerCase();
        camposFrmABM.forEach((cmp)=>{
            const propiedadDeCampo = cmp.id.split("-")[1];
            if(cmp.tagName !== "SELECT" && objeto.hasOwnProperty(propiedadDeCampo)){

                cmp.value = objeto[propiedadDeCampo];
                OcultarCampos([cmp],false);
            }else{
                cmp.value = nombreContructor;
                cmp.disabled = true;
                cmp.selected = true;
            }
        })

    })






});