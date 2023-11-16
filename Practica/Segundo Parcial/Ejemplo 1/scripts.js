import { Persona } from "./Entidades/Persona.js";
import { Empleado } from "./Entidades/Empleado.js";
import { Cliente } from "./Entidades/Cliente.js";


function ObtenerObjetos(){
    let respuesta;
    let objArr;
    const cuerpo = document.getElementById("cuerpo");
    const body = document.getElementsByTagName("body")[0];
    // Ocultamos el cuerpo
    cuerpo.style.display = "none";
    // Mostramos un spinner
    const spinner = document.createElement("img");
    spinner.src = "./Recursos/spinner.gif";
    spinner.alt = "imagenSpinner";
    spinner.id = "spinnerTemporal";
    body.appendChild(spinner);
    const xhttp = new XMLHttpRequest(); //Instancio el objeto
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //Acción a ejecutar cuando el estado es 200 ok y el readyState=4 (respuesta lista)
            
            respuesta = JSON.parse(this.responseText);
            cuerpo.style.display = "block";
            body.removeChild(spinner);
            objArr = respuesta.map((obj)=>{
                if(obj.hasOwnProperty("ventas") && obj.hasOwnProperty("sueldo"))
                {
                    return new Empleado(obj.id,obj.nombre,obj.apellido,obj.edad,obj.sueldo,obj.ventas);
                }else if(obj.hasOwnProperty("compras") && obj.hasOwnProperty("telefono")){
                    return new Cliente(obj.id,obj.nombre,obj.apellido,obj.edad,obj.compras,obj.telefono);
                }else{
                    return new Persona(obj.id,obj.nombre,obj.apellido,obj.edad);
                }
            });
            // Aca debo cargar la tabla
            console.log(objArr);
        }
    }; //Configúro manejador para cambio de estado
    xhttp.open("GET", "http://localhost/API_LaboIII/PersonasEmpleadosClientes.php", true); //Inicializo la solicitud
    xhttp.send(); //Envio la solicitud
}

document.addEventListener("DOMContentLoaded",()=>{
    ObtenerObjetos();




});