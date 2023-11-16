document.addEventListener("DOMContentLoaded",function(){
    jsonObjetos = [{"id":1, "nombre":"Clark", "apellido":"Kent", "edad":45, "alterego":"Superman", "ciudad":"Metropolis",
    "publicado":2002},{"id":2, "nombre":"Bruce", "apellido":"Wayne", "edad":35, "alterego":"Batman", "ciudad":"Gotica",
    "publicado":20012},{"id":3, "nombre":"Bart", "apellido":"Alen", "edad":30, "alterego":"Flash", "ciudad":"Central",
    "publicado":2017},{"id":4, "nombre":"Lex", "apellido":"Luthor", "edad":18, "enemigo":"Superman", "robos":500,
    "asesinatos":7},{"id":5, "nombre":"Harvey", "apellido":"Dent", "edad":20, "enemigo":"Batman", "robos":750,
    "asesinatos":2},{"id":666, "nombre":"Celina", "apellido":"kyle", "edad":23, "enemigo":"Batman", "robos":25,
    "asesinatos":1}]

    const arrayObjetos = [];
    const arrayColumnas = ["Id","Nombre","Apellido","Edad","AlterEgo","Ciudad","Publicado","Enemigo","Robos","Asesinatos"];

    jsonObjetos.forEach(objeto => {

        if(objeto.hasOwnProperty("id") && objeto.hasOwnProperty("nombre") && objeto.hasOwnProperty("apellido") && objeto.hasOwnProperty("edad"))
        {
            if(objeto.hasOwnProperty("alterego") && objeto.hasOwnProperty("ciudad") && objeto.hasOwnProperty("publicado"))
            {
                if(objeto.publicado > 1940 && objeto.alterego !== "" && objeto.ciudad !==""){

                    arrayObjetos.push(new Heroe(objeto.id,objeto.nombre,objeto.apellido,objeto.edad,objeto.alterego,objeto.ciudad,objeto.publicado));
                }
            }
            if(objeto.hasOwnProperty("enemigo") && objeto.hasOwnProperty("robos") && objeto.hasOwnProperty("asesinatos"))
            {
                if(objeto.robos>0 && objeto.asesinatos>0){

                    arrayObjetos.push(new Villano(objeto.id,objeto.nombre,objeto.apellido,objeto.edad,objeto.enemigo,objeto.robos,objeto.asesinatos));
                }

            }
        }
        
    });

    const $ = (id)=> document.getElementById(id);

    const tabla = $('tablaFrmPrincipal');
    const seleccionarTipo = $("selectType1");
    console.log(seleccionarTipo);
    const seleccionarTipoABM = $("selectType2");

    // Formulario Principal:
    const formularioPrincipal = $("frmPrincipal");
    const thead = AgregarCabecera(tabla,arrayColumnas);
    const body = AgregarDatos(tabla,thead,arrayObjetos);
    const botonCalcular = $("btnCalcularEdad");
    botonCalcular.addEventListener("click",(e)=>{
        e.preventDefault();
    
        let objetosFiltrados = [];
        if (seleccionarTipo.value !== "todos") {
            objetosFiltrados = arrayObjetos.filter((objeto) => objeto.constructor.name === seleccionarTipo.value);
        } else {
            objetosFiltrados = arrayObjetos;
        }
    
        let sumaEdades = objetosFiltrados.reduce((suma, objeto) => suma + objeto.edad, 0);
    
        let txtCalculadorEdad = $("calcularEdadPromedio");
        txtCalculadorEdad.value = sumaEdades / objetosFiltrados.length;
        
    })

    // Formulario ABM:
    const formularioABM = $("frmABM");

    // Rellenar Selects:
    let arrayTipos = [];
    arrayObjetos.forEach((obj)=>{

        let tipoObjeto = obj.constructor.name;
        if(!arrayTipos.includes(tipoObjeto))
        {
            let nuevaOpcionSelectTipe1 = document.createElement("option");
            let nuevaOpcionSelectTipe2 = document.createElement("option");
            nuevaOpcionSelectTipe1.textContent = tipoObjeto
            nuevaOpcionSelectTipe2.textContent = tipoObjeto
            arrayTipos.push(tipoObjeto);
            nuevaOpcionSelectTipe1.id = "typ1-"+tipoObjeto;
            nuevaOpcionSelectTipe1.value = tipoObjeto;
            nuevaOpcionSelectTipe2.id = "typ2-"+tipoObjeto;
            nuevaOpcionSelectTipe2.value = tipoObjeto;
            seleccionarTipo.appendChild(nuevaOpcionSelectTipe1);
            seleccionarTipoABM.appendChild(nuevaOpcionSelectTipe2);
        }
        arrayTipos.forEach

    })

    const botonAgregarNuevo = $("appendNew");
    botonAgregarNuevo.addEventListener("click",(event)=>{
        event.preventDefault();
        if(formularioABM.style.display === "none"){
            formularioPrincipal.style.display = "none";
            formularioABM.style.display = "block";
        }

    })

    const botonCancelar = $("cancelEdition");
    const camposDeTipo = $("fielsOfTypeDiv");

    botonCancelar.addEventListener("click",(event)=>{
        event.preventDefault();
        if(formularioPrincipal.style.display === "none"){
            formularioABM.style.display = "none";
            formularioPrincipal.style.display = "block";
        }
        while(camposDeTipo.hasChildNodes())
        {
            camposDeTipo.removeChild(camposDeTipo.firstChild);
        }



    });


    seleccionarTipoABM.addEventListener("change",()=>{
        let atributosObjeto = [];
        while(camposDeTipo.hasChildNodes())
        {
            camposDeTipo.removeChild(camposDeTipo.firstChild);
        }

        switch(seleccionarTipoABM.value){
            case "Villano":
                atributosObjeto = Object.getOwnPropertyNames(new Villano());

                break;
            case "Heroe":
                atributosObjeto = Object.getOwnPropertyNames(new Heroe());
                break;
        }
        atributosObjeto.forEach((a)=>{
            console.log(a);
                    
            let label = document.createElement("label");
            let inputText = document.createElement("input");
            inputText.type = "text";
            inputText.id = "frm"+a;
            label.textContent = a.charAt(0).toUpperCase() + a.slice(1).toLowerCase();
            label.setAttribute("for",inputText.id);
            if(a === "id"){
                return;
            }
            
            camposDeTipo.appendChild(inputText);
            camposDeTipo.appendChild(label);
        })


    })














    
})

