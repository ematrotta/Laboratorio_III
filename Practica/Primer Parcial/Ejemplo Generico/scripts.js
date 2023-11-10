import { EliminarElementos, ObtenerElementoPorId } from "./Complementos/ComplementedScripts.js";
import {ActualizarTablaPricipal} from "./DOM/TablaPrincipal.js";
import {Terrestre} from "./Entidades/Terrestre.js";
import {Aereo} from "./Entidades/Aereo.js";
import {Vehiculo} from "./Entidades/Vehiculo.js";
import { InicializarFormularioPrincipal } from "./DOM/FrmPrincipal.js";
import { CalcularPorPropiedad, FiltrarObjetos, ObtenerArrayConstructores, ObtenerArrayPropiedades } from "./Complementos/ArrayHelpers.js";
import { CrearOpcionesSelectABM,InicializarFrmABM} from "./DOM/FrmABM.js";


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
    let propiedades = ObtenerArrayPropiedades(ObtenerVehiculos(keyLocalStorage));
    let objetosFiltrados = ObtenerVehiculos(keyLocalStorage);
    let botonCalcular = ObtenerElementoPorId("btnCalcularVelocidadMaxima");
    let botonAgregar = ObtenerElementoPorId("btnAgregar");

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
        // if(check.checked === false){
        //     columnaAfectada = document.querySelectorAll(`.column-${e.detail}`);
        //     console.log(columnaAfectada);
        //     for(var i = 0;i<columnaAfectada.length;i++){
        //         columnaAfectada[i].classList.add("none-visible");
        //     }   
        // }else{
        //     columnaAfectada = document.querySelectorAll(`.column-${e.detail}.none-visible`);
        //     for(var i = 0;i<columnaAfectada.length;i++){
        //         columnaAfectada[i].classList.remove("none-visible");
        //     }  
        // }
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
        if(valorSeleccionado !== "todos"){
            const vehiculos = ObtenerVehiculos(keyLocalStorage);
            const tipoVehiculoSelecionado = vehiculos.find((vehiculo)=>vehiculo.constructor.name.toLowerCase() === valorSeleccionado);
            const camposVehiculoPorTipo = ObtenerElementoPorId("camposSegunTipo").children;
            for(let i = 0;i<camposVehiculoPorTipo.length;i++){
                let propiedad = camposVehiculoPorTipo[i].id.split("-")[1];
                if(tipoVehiculoSelecionado.hasOwnProperty(propiedad)){
                    camposVehiculoPorTipo[i].classList.remove("none-visible");
                }
                else{
                    if(!camposVehiculoPorTipo[i].classList.contains("none-visible")){
                        camposVehiculoPorTipo[i].classList.add("none-visible");
                    }

                }
            }
        }
    })

    botonAgregar.addEventListener("click",(e)=>{
        e.preventDefault();
        const frmABM = ObtenerElementoPorId("frmABM");
        const frmPrincipal = ObtenerElementoPorId("frmPrincipal");
        InicializarFrmABM();
        frmABM.classList.remove("none-visible");
        frmPrincipal.classList.add("none-visible");
        
    })


    // let objArrFiltrado = [...ObtenerVehiculos()];
    // const propiedades  = ObtenerArrayAtributos(ObtenerVehiculos());
    // let arrEncabezadosVisibles = [...propiedades];
    // const tabla = document.getElementById("tablaPrincipal");
    // const selectFrmPrincipal = document.getElementById("selecionarTipofrmPrincipal");
    // const selectFrmABM = document.getElementById("selecionarTipofrmABM");
    // const botonCalcular = document.getElementById("btnCalcularVelocidadMaxima");
    // const textBoxCalcular = document.getElementById("txtPromedioVelocidadMaxima");
    // const contenedorCamposPorTipo = document.getElementById("camposSegunTipo");
    // const contenedorCamposVehiculo = $("camposVehiculo");
    // const botonAgregar = document.getElementById("btnAgregar");
    // const botonAgregarFrmAMB = document.getElementById("btnAgregarNuevo");
    // const botonCancelarFrmABM = $("btnCancelarRegistro");
    // const botonModificarFrmAMB = $("btnModificarRegistro");
    // const botonEliminarFrmABM = $("btnEliminarRegistro");
    // const formularioABM = $("frmABM");
    // const formularioPrincipal = $("frmPrincipal");
    // CrearChecks(propiedades);
    // ActualizarTabla(tabla,propiedades,objArrFiltrado);
    // CargarOpcionesSelector(ObtenerVehiculos(),selectFrmPrincipal);
    // CargarOpcionesSelector(ObtenerVehiculos(),selectFrmABM);

    // selectFrmPrincipal.addEventListener("change",()=>{
    //     const objActuales = ObtenerVehiculos();
        
    //     const valorSeleccionado = selectFrmPrincipal.value;
    //     if(valorSeleccionado !== "todos"){
    //         objArrFiltrado = objActuales.filter((obj)=>obj.constructor.name === valorSeleccionado);
    //     }
    //     else{
    //         objArrFiltrado = [...objActuales];
    //     }
    //     ActualizarTabla(tabla,arrEncabezadosVisibles,objArrFiltrado);
    //     textBoxCalcular.value = "";

    // })

    // selectFrmABM.addEventListener("change",()=>{
    //     CrearCamposPorTipo(selectFrmABM.value,contenedorCamposPorTipo,ObtenerVehiculos());

    // })

    // // A traves del siguiente evento que cargamos en cada check, actualizamos la tabla en base a los checks
    // // que se encuentren visibles, dando como resultado un array de propiedades
    // document.addEventListener("ocultarColumnas",(e)=>{
    //     const arrChecks = document.querySelectorAll(".checkColumn");
    //     const arrEncabezados = [];
    //     arrChecks.forEach((chk)=>{
    //         if(chk.checked === true)
    //         {
    //             arrEncabezados.push(chk.id.split("-")[1]);
    //         }
    //     })
    //     arrEncabezadosVisibles = [...arrEncabezados];
    //     ActualizarTabla(tabla,arrEncabezadosVisibles,objArrFiltrado);

    // });

    // document.addEventListener("ordenarTabla",(e)=>{
    //     const arrObjectsActualizado = ObtenerVehiculos();
    //     let arrObjetosOrdenado = OrdenarObjetos(arrObjectsActualizado,e.detail);
    //     const valorSeleccionado = selectFrmPrincipal.value;
    //     if(valorSeleccionado !== "todos"){
    //         arrObjetosOrdenado = arrObjetosOrdenado.filter((obj)=>obj.constructor.name === valorSeleccionado);
    //     }
    //     ActualizarTabla(tabla,arrEncabezadosVisibles,arrObjetosOrdenado);

    // });

    // botonCalcular.addEventListener("click",(e)=>{
    //     e.preventDefault();
    //     const sumaVelocidades = objArrFiltrado.reduce((bval, obj) => {
    //         return bval + obj.velMax;
    //     }, 0);
    
    //     textBoxCalcular.value = (sumaVelocidades/objArrFiltrado.length).toFixed(2);
    // });

    // document.addEventListener('cargarFormABM',(e)=>{
    //     const idObjeto = e.detail;
    //     const arrObjetos = ObtenerVehiculos();
    //     const objetoSeleccionado = arrObjetos.find((o)=>o.id == idObjeto);
    //     CargarInfoPorTipo(objetoSeleccionado,contenedorCamposPorTipo,arrObjetos,selectFrmABM);
    //     formularioPrincipal.style = "display: none;";
    //     formularioABM.style = "display: block;";
    //     botonAgregarFrmAMB.style = "display: none";
    //     botonEliminarFrmABM.style = "display: inline";
    //     botonModificarFrmAMB.style = "display: inline";
    // });

    // botonAgregar.addEventListener("click",(e)=>{
    //     e.preventDefault();
    //     (Array.from(contenedorCamposPorTipo.children)).forEach((children)=>{
    //         contenedorCamposPorTipo.removeChild(children);
    //     })
    //     InicializarContenedor(contenedorCamposPorTipo);
    //     InicializarContenedor(contenedorCamposVehiculo);
    //     botonEliminarFrmABM.style = "display: none";
    //     botonModificarFrmAMB.style = "display: none";
    //     formularioPrincipal.style = "display: none;";
    //     formularioABM.style = "display: block;";
    //     botonAgregarFrmAMB.style = "display: inline;"
    // });

    // botonCancelarFrmABM.addEventListener("click",(e)=>{
    //     e.preventDefault();
    //     formularioPrincipal.style = "display: block;";
    //     formularioABM.style = "display: none;";
    // });

    // botonAgregarFrmAMB.addEventListener("click",(e)=>{
    //     e.preventDefault();
    //     botonModificarFrmAMB.style = "display: none";
    //     const datosVehiculo = ObtenerDatosDeCampos(contenedorCamposVehiculo);
    //     const datosSegunTipo = ObtenerDatosDeCampos(contenedorCamposPorTipo);
    //     const arrObj = ObtenerVehiculos();
    //     let vehiculo = {};
    //     try{
    //         if(selectFrmABM.value != "todos"){
    //             switch(selectFrmABM.value){
    //                 case "Terrestre":
    //                     vehiculo = new Terrestre(AsignarId(arrObj),datosVehiculo.modelo,parseInt(datosVehiculo.anoFab),parseFloat(datosVehiculo.velMax),parseInt(datosSegunTipo.cantPue),parseInt(datosSegunTipo.cantRue));
    //                     break;
    //                 case "Aereo":
    //                     vehiculo = new Aereo(AsignarId(arrObj),datosVehiculo.modelo,parseInt(datosVehiculo.anoFab),parseFloat(datosVehiculo.velMax),parseInt(datosSegunTipo.altMax),parseInt(datosSegunTipo.autonomia));
    //                     break;
    //             }
    //             arrObj.push(vehiculo);
    //             localStorage.setObjects("vehiculos",arrObj);
    //         }else{
    //             alert("Debe seleccionar un tipo al menos");
    //         }

    //     }catch(exception){
    //             console.log(exception.message);

    //     }
    //     InicializarContenedor(contenedorCamposPorTipo);
    //     InicializarContenedor(contenedorCamposVehiculo);
    //     formularioPrincipal.style = "display: block;";
    //     formularioABM.style = "display: none;";
    //     selectFrmPrincipal.value = "todos";
    //     ActualizarTabla(tabla,arrEncabezadosVisibles,ObtenerVehiculos());
    // })

    // botonModificarFrmAMB.addEventListener("click",(e)=>{
    //     e.preventDefault();
    //     const arrObj = ObtenerVehiculos();
    //     const datosVehiculo = ObtenerDatosDeCampos(contenedorCamposVehiculo);
    //     const datosSegunTipo = ObtenerDatosDeCampos(contenedorCamposPorTipo);
    //     const objeto = arrObj.find((o,i)=>{
    //         if(o.id == datosVehiculo.id){
    //             arrObj[i].modelo = datosVehiculo.modelo;
    //             arrObj[i].anoFab = parseInt(datosVehiculo.anoFab);
    //             arrObj[i].velMax = parseFloat(datosVehiculo.velMax);
    //             if(o.constructor.name === "Terrestre"){
    //                 arrObj[i].cantPue = parseInt(datosSegunTipo.cantPue);
    //                 arrObj[i].cantRue = parseInt(datosSegunTipo.cantRue);
    //             }
    //             if(o.constructor.name === "Areo"){
    //                 arrObj[i].altMax = parseFloat(datosSegunTipo.altMax);
    //                 arrObj[i].autonomia = parseFloat(datosSegunTipo.autonomia);
    //             }
    //             return o;
    //         }
    //     });
    //     if(objeto !== undefined){
    //         localStorage.setObjects("vehiculos",arrObj);
    //         alert("Modificacion exitosa");
    //     }else{
    //         alert("Error en la modificación");
    //     }
    //     InicializarContenedor(contenedorCamposPorTipo);
    //     InicializarContenedor(contenedorCamposVehiculo);
    //     formularioPrincipal.style = "display: block;";
    //     formularioABM.style = "display: none;";
    //     ActualizarTabla(tabla,arrEncabezadosVisibles,ObtenerVehiculos());
    // });

    // botonEliminarFrmABM.addEventListener("click",(e)=>{
    //     e.preventDefault();
    //     let arrObj = ObtenerVehiculos();
    //     const datosVehiculo = ObtenerDatosDeCampos(contenedorCamposVehiculo);
    //     arrObj = arrObj.filter((o)=>o.id !== parseInt(datosVehiculo.id));
    //     console.log(arrObj)
    //     localStorage.setObjects("vehiculos",arrObj);
    //     alert("Eliminacion exitosa");
    //     InicializarContenedor(contenedorCamposPorTipo);
    //     InicializarContenedor(contenedorCamposVehiculo);
    //     formularioPrincipal.style = "display: block;";
    //     formularioABM.style = "display: none;";
    //     ActualizarTabla(tabla,arrEncabezadosVisibles,ObtenerVehiculos());
    // })





    














})