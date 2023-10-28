document.addEventListener("DOMContentLoaded",function(){
    jsonObjetos = [{"id":1, "nombre":"Marcelo", "apellido":"Luque", "edad":45, "ventas":15000, "sueldo":2000},{"id":2,
    "nombre":"Ramiro", "apellido":"Escobar", "edad":35, "ventas": 6000, "sueldo": 1000},{"id":3, "nombre":"Facundo",
    "apellido":"Cairo", "edad":30, "ventas":500, "sueldo":15000},{"id":4, "nombre":"Fernando", "apellido":"Nieto",
    "edad":18, "compras":8000, "telefono":"152111131"},{"id":5, "nombre":"Manuel", "apellido":"Loza", "edad":20,
    "compras":50000, "telefono":"42040077"},{"id":666, "nombre":"Nicolas", "apellido":"Serrano", "edad":23,
    "compras":7000, "telefono":"1813181563"}]

    const arrayObjetos = [];
    const arrayColumnas = ["Id","Nombre","Apellido","Edad","Sueldo","Ventas","Compras","Telefono"];

    jsonObjetos.forEach(objeto => {


        if(objeto.hasOwnProperty("id") && objeto.hasOwnProperty("nombre") && objeto.hasOwnProperty("apellido") && objeto.hasOwnProperty("edad") && objeto.edad>15)
        {
            if(objeto.hasOwnProperty("ventas") && objeto.hasOwnProperty("sueldo"))
            {
                if(objeto.ventas > 0 && objeto.sueldo > 0){

                    arrayObjetos.push(new Empleado(objeto.id,objeto.nombre,objeto.apellido,objeto.edad,objeto.sueldo,objeto.ventas));
                }
            }
            if(objeto.hasOwnProperty("compras") && objeto.hasOwnProperty("telefono"))
            {
                if(objeto.compras>0){

                    arrayObjetos.push(new Cliente(objeto.id,objeto.nombre,objeto.apellido,objeto.edad,objeto.compras,objeto.telefono));
                }

            }
            if(!objeto.hasOwnProperty("compras") && !objeto.hasOwnProperty("telefono") && !objeto.hasOwnProperty("ventas") && !objeto.hasOwnProperty("sueldo")){
                arrayObjetos.push(new Persona(objeto.id,objeto.nombre,objeto.apellido,objeto.edad));
                console.log("Es Persona");

            }
        }
        
    });

    const $ = (id)=> document.getElementById(id);

    const tabla = $('tablaFrmPrincipal');

    const thead = AgregarCabecera(tabla,arrayColumnas);

    const body = AgregarDatos(tabla,thead,arrayObjetos);
    VaciarTabla(tabla,body);

    setTimeout(()=>{

        RefrescarTabla(tabla,thead,body,arrayObjetos);

    },3000);






    
})

