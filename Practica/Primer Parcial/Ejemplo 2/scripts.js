Storage.prototype.getObjects = function(key){
    return (JSON.parse(this.getItem(key)));
}

Storage.prototype.setObjects = function(key,objects){
    return (this.setItem(key,JSON.stringify(objects)));
}

function ObtenerVehiculos(){
    const jsonArr = localStorage.getObjects("vehiculos");
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

function AsignarId(arrObj){
    const arrIds = [];
    arrObj.forEach((obj)=>{
        arrIds.push(parseInt(obj.id));
    })

    return Math.max(...arrIds)+1;
}


document.addEventListener("DOMContentLoaded",function(){

    const $ = (idElemento)=>{
        return document.getElementById(idElemento);
    }
    let objArrFiltrado = [...ObtenerVehiculos()];
    const propiedades  = ObtenerArrayAtributos(ObtenerVehiculos());
    let arrEncabezadosVisibles = [...propiedades];
    const tabla = document.getElementById("tablaPrincipal");
    const selectFrmPrincipal = document.getElementById("selecionarTipofrmPrincipal");
    const selectFrmABM = document.getElementById("selecionarTipofrmABM");
    const botonCalcular = document.getElementById("btnCalcularVelocidadMaxima");
    const textBoxCalcular = document.getElementById("txtPromedioVelocidadMaxima");
    const contenedorCamposPorTipo = document.getElementById("camposSegunTipo");
    const contenedorCamposVehiculo = $("camposVehiculo");
    const botonAgregar = document.getElementById("btnAgregar");
    const botonAgregarFrmAMB = document.getElementById("btnAgregarNuevo");
    const botonCancelarFrmABM = $("btnCancelarRegistro");
    const botonModificarFrmAMB = $("btnModificarRegistro");
    const botonEliminarFrmABM = $("btnEliminarRegistro");
    const formularioABM = $("frmABM");
    const formularioPrincipal = $("frmPrincipal");
    CrearChecks(propiedades);
    ActualizarTabla(tabla,propiedades,objArrFiltrado);
    CargarOpcionesSelector(ObtenerVehiculos(),selectFrmPrincipal);
    CargarOpcionesSelector(ObtenerVehiculos(),selectFrmABM);

    selectFrmPrincipal.addEventListener("change",()=>{
        const objActuales = ObtenerVehiculos();
        
        const valorSeleccionado = selectFrmPrincipal.value;
        if(valorSeleccionado !== "todos"){
            objArrFiltrado = objActuales.filter((obj)=>obj.constructor.name === valorSeleccionado);
        }
        else{
            objArrFiltrado = [...objActuales];
        }
        ActualizarTabla(tabla,arrEncabezadosVisibles,objArrFiltrado);
        textBoxCalcular.value = "";

    })

    selectFrmABM.addEventListener("change",()=>{
        CrearCamposPorTipo(selectFrmABM.value,contenedorCamposPorTipo,ObtenerVehiculos());

    })

    // A traves del siguiente evento que cargamos en cada check, actualizamos la tabla en base a los checks
    // que se encuentren visibles, dando como resultado un array de propiedades
    document.addEventListener("ocultarColumnas",(e)=>{
        const arrChecks = document.querySelectorAll(".checkColumn");
        const arrEncabezados = [];
        arrChecks.forEach((chk)=>{
            if(chk.checked === true)
            {
                arrEncabezados.push(chk.id.split("-")[1]);
            }
        })
        arrEncabezadosVisibles = [...arrEncabezados];
        ActualizarTabla(tabla,arrEncabezadosVisibles,objArrFiltrado);

    });

    document.addEventListener("ordenarTabla",(e)=>{
        const arrObjectsActualizado = ObtenerVehiculos();
        let arrObjetosOrdenado = OrdenarObjetos(arrObjectsActualizado,e.detail);
        const valorSeleccionado = selectFrmPrincipal.value;
        if(valorSeleccionado !== "todos"){
            arrObjetosOrdenado = arrObjetosOrdenado.filter((obj)=>obj.constructor.name === valorSeleccionado);
        }
        ActualizarTabla(tabla,arrEncabezadosVisibles,arrObjetosOrdenado);

    });

    botonCalcular.addEventListener("click",(e)=>{
        e.preventDefault();
        const sumaVelocidades = objArrFiltrado.reduce((bval, obj) => {
            return bval + obj.velMax;
        }, 0);
    
        textBoxCalcular.value = (sumaVelocidades/objArrFiltrado.length).toFixed(2);
    });

    document.addEventListener('cargarFormABM',(e)=>{
        const idObjeto = e.detail;
        const arrObjetos = ObtenerVehiculos();
        const objetoSeleccionado = arrObjetos.find((o)=>o.id == idObjeto);
        CargarInfoPorTipo(objetoSeleccionado,contenedorCamposPorTipo,arrObjetos,selectFrmABM);
        formularioPrincipal.style = "display: none;";
        formularioABM.style = "display: block;";
        botonAgregarFrmAMB.style = "display: none";
        botonEliminarFrmABM.style = "display: inline";
        botonModificarFrmAMB.style = "display: inline";
    });

    botonAgregar.addEventListener("click",(e)=>{
        e.preventDefault();
        (Array.from(contenedorCamposPorTipo.children)).forEach((children)=>{
            contenedorCamposPorTipo.removeChild(children);
        })
        InicializarContenedor(contenedorCamposPorTipo);
        InicializarContenedor(contenedorCamposVehiculo);
        botonEliminarFrmABM.style = "display: none";
        botonModificarFrmAMB.style = "display: none";
        formularioPrincipal.style = "display: none;";
        formularioABM.style = "display: block;";
        botonAgregarFrmAMB.style = "display: inline;"
    });

    botonCancelarFrmABM.addEventListener("click",(e)=>{
        e.preventDefault();
        formularioPrincipal.style = "display: block;";
        formularioABM.style = "display: none;";
    });

    botonAgregarFrmAMB.addEventListener("click",(e)=>{
        e.preventDefault();
        botonModificarFrmAMB.style = "display: none";
        const datosVehiculo = ObtenerDatosDeCampos(contenedorCamposVehiculo);
        const datosSegunTipo = ObtenerDatosDeCampos(contenedorCamposPorTipo);
        const arrObj = ObtenerVehiculos();
        let vehiculo = {};
        try{
            if(selectFrmABM.value != "todos"){
                switch(selectFrmABM.value){
                    case "Terrestre":
                        vehiculo = new Terrestre(AsignarId(arrObj),datosVehiculo.modelo,parseInt(datosVehiculo.anoFab),parseFloat(datosVehiculo.velMax),parseInt(datosSegunTipo.cantPue),parseInt(datosSegunTipo.cantRue));
                        break;
                    case "Aereo":
                        vehiculo = new Aereo(AsignarId(arrObj),datosVehiculo.modelo,parseInt(datosVehiculo.anoFab),parseFloat(datosVehiculo.velMax),parseInt(datosSegunTipo.altMax),parseInt(datosSegunTipo.autonomia));
                        break;
                }
                arrObj.push(vehiculo);
                localStorage.setObjects("vehiculos",arrObj);
            }else{
                alert("Debe seleccionar un tipo al menos");
            }

        }catch(exception){
                console.log(exception.message);

        }
        InicializarContenedor(contenedorCamposPorTipo);
        InicializarContenedor(contenedorCamposVehiculo);
        formularioPrincipal.style = "display: block;";
        formularioABM.style = "display: none;";
        selectFrmPrincipal.value = "todos";
        ActualizarTabla(tabla,arrEncabezadosVisibles,ObtenerVehiculos());
    })

    botonModificarFrmAMB.addEventListener("click",(e)=>{
        e.preventDefault();
        const arrObj = ObtenerVehiculos();
        const datosVehiculo = ObtenerDatosDeCampos(contenedorCamposVehiculo);
        const datosSegunTipo = ObtenerDatosDeCampos(contenedorCamposPorTipo);
        const objeto = arrObj.find((o,i)=>{
            if(o.id == datosVehiculo.id){
                arrObj[i].modelo = datosVehiculo.modelo;
                arrObj[i].anoFab = parseInt(datosVehiculo.anoFab);
                arrObj[i].velMax = parseFloat(datosVehiculo.velMax);
                if(o.constructor.name === "Terrestre"){
                    arrObj[i].cantPue = parseInt(datosSegunTipo.cantPue);
                    arrObj[i].cantRue = parseInt(datosSegunTipo.cantRue);
                }
                if(o.constructor.name === "Areo"){
                    arrObj[i].altMax = parseFloat(datosSegunTipo.altMax);
                    arrObj[i].autonomia = parseFloat(datosSegunTipo.autonomia);
                }
                return o;
            }
        });
        if(objeto !== undefined){
            localStorage.setObjects("vehiculos",arrObj);
            alert("Modificacion exitosa");
        }else{
            alert("Error en la modificación");
        }
        InicializarContenedor(contenedorCamposPorTipo);
        InicializarContenedor(contenedorCamposVehiculo);
        formularioPrincipal.style = "display: block;";
        formularioABM.style = "display: none;";
        ActualizarTabla(tabla,arrEncabezadosVisibles,ObtenerVehiculos());
    });

    botonEliminarFrmABM.addEventListener("click",(e)=>{
        e.preventDefault();
        let arrObj = ObtenerVehiculos();
        const datosVehiculo = ObtenerDatosDeCampos(contenedorCamposVehiculo);
        arrObj = arrObj.filter((o)=>o.id !== parseInt(datosVehiculo.id));
        console.log(arrObj)
        localStorage.setObjects("vehiculos",arrObj);
        alert("Eliminacion exitosa");
        InicializarContenedor(contenedorCamposPorTipo);
        InicializarContenedor(contenedorCamposVehiculo);
        formularioPrincipal.style = "display: block;";
        formularioABM.style = "display: none;";
        ActualizarTabla(tabla,arrEncabezadosVisibles,ObtenerVehiculos());
    })





    














})