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

function CrearChecks(arrPropiedades){
    const divChecks = document.getElementById("filtrosDeColumnas");
    arrPropiedades.forEach(p => {
        const nuevoCheck = document.createElement("input");
        const nuevaLabel = document.createElement("label");
        const propiedadMayuscula = p.charAt(0).toUpperCase() + p.slice(1);
        nuevoCheck.type = "checkbox";
        nuevoCheck.id = `chk-${p}`;
        nuevaLabel.id = `lbl${propiedadMayuscula}`;
        nuevaLabel.textContent = propiedadMayuscula;
        nuevaLabel.setAttribute("for",nuevoCheck.id);
        nuevoCheck.checked = true;
        nuevoCheck.addEventListener("change",(e)=>{
            const eventoOcultarColumnas = new CustomEvent("ocultarColumnas",{detail:p})
            document.dispatchEvent(eventoOcultarColumnas);
        })
        nuevoCheck.className = "checkColumn";
        divChecks.appendChild(nuevoCheck); 
        divChecks.appendChild(nuevaLabel); 
    });
}


document.addEventListener("DOMContentLoaded",function(){

    const objArr = ObtenerVehiculos();
    const propiedades  = ObtenerArrayAtributos(objArr);
    const tabla = document.getElementById("tablaPrincipal");
    CrearChecks(propiedades);

    ActualizarTabla(tabla,propiedades,objArr);

    // A traves del siguiente evento que cargamos en cada check, actualizamos la tabla en base a los checks
    // que se encuentren visibles, dando como resultado un array de propiedades
    document.addEventListener("ocultarColumnas",(e)=>{
        const arrChecks = document.querySelectorAll(".checkColumn");
        const arrEncabezadosVisibles = [];
        arrChecks.forEach((chk)=>{
            if(chk.checked === true)
            {
                arrEncabezadosVisibles.push(chk.id.split("-")[1]);
            }
        })
        ActualizarTabla(tabla,arrEncabezadosVisibles,objArr);

    })

    document.addEventListener("ordenarTabla",(e)=>{
        const arrObjOrdenado = OrdenarObjetos(objArr,e.detail);
        const propiedadesObjetos  = ObtenerArrayAtributos(arrObjOrdenado);
        ActualizarTabla(tabla,propiedadesObjetos,arrObjOrdenado);

    })
    














})