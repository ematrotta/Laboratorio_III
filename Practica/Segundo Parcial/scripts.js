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

async function AgregarObjeto(object){
    const response = await fetch('http://localhost/API_LaboIII/PersonasEmpleadosClientes.php', {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', 
// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, 
        //same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(object) // Tiene que coincidir con el Content-Type
  });

  return response;
}


document.addEventListener("DOMContentLoaded",()=>{
    let propiedades;
    let EventoCargarFrm;
    let arrObjetos;
    const keyLocalStorage = "personas";
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

    
    function ObtenerIdNuevo(response){
        response.json().then(data=>{
            OcultarCampos([spinner],true);
            OcultarCampos([cuerpo],false);
            OcultarCampos([frmLista],false);
            OcultarCampos([frmABM],true);
            alert(data.id);
        }).catch("error");
    }

    function MostrarError(response){
        response.text().then((r)=>{
            alert(r);
        });

    }

    document.addEventListener("RecargarTabla",(e)=>{
        // Ocultamos los elementos que no queremos que se muestren
        const respuesta = e.detail;
        const jsonArr = JSON.parse(respuesta);
        arrObjetos = ConvertirEnObjetos(jsonArr); //Convierte en los objetos correspondientes
        OcultarCampos([spinner],true);
        OcultarCampos([cuerpo],false);
        OcultarCampos([frmLista],false);
        OcultarCampos([frmABM],true);

        if(arrObjetos === undefined){
            alert("El array de objetos es undefined");
        }else{
            localStorage.setObjects(keyLocalStorage,JSON.stringify(arrObjetos));
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
        const propiedadesTipo = ObtenerArrayPropiedadesPorTipo(tipoObjeto);
        const objetoTemporal = ObtenerDatosDeCampos(camposTexto);
        const propiedadesObjetoTemporal = Object.getOwnPropertyNames(objetoTemporal);

        // Eliminamos los datos de campos que no correspondan a la clase seleccionada
        propiedadesObjetoTemporal.forEach((p)=>{
            if(!propiedadesTipo.includes(p)){
                delete objetoTemporal[p];
            }
        });

        if(ValidarCamposInput(objetoTemporal,tipoObjeto)){
            OcultarCampos([spinner],false);
            OcultarCampos([cuerpo],true);
            OcultarCampos([frmLista],true);
            OcultarCampos([frmABM],true);
            switch(tipoOperacion){
                case "agregar":
                    // Le eliminamos al objeto temporal el id ya que no se debe pasar en el string
                    delete objetoTemporal.id;
                    AgregarObjeto(objetoTemporal)
                    .then((r)=>{
                        if(r.status === 200){
                            r.json().then((r)=>{
                                // Le asignamos el id de la respuesta al objeto
                                objetoTemporal.id = r.id;
                                const nuevoObjeto = ConvertirEnObjetos([objetoTemporal])[0];
                                arrObjetos.push(nuevoObjeto);
                                localStorage.setObjects(keyLocalStorage,arrObjetos);
                                alert("Objeto agregado con exito");
                                ActualizarTablaPricipal(tabla,propiedades,arrObjetos);
                                
                            });
                        }else{
                            r.text().then((r)=>{
                                alert(r);
                            })
                        }
                    })
                    .catch(MostrarError).finally(()=>{
                            OcultarCampos([spinner],true);
                            OcultarCampos([cuerpo],false);
                            OcultarCampos([frmLista],false);
                            OcultarCampos([frmABM],true);
                        });
                    break;
                case "eliminar":
                    break;
                case "modificar":
                    break;
            }

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