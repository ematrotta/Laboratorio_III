// import {superHeroes as people} from "../data/data.js";
// import {crearTabla} from "./tabla.js";
import {actualizarTabla} from "./tabla.js";
import {SuperHeroe} from "./superHeroe.js";
import {crearSelect} from "./selectOptions.js";



const $seccionTabla = document.getElementById("tabla");
const $formulario = document.forms[0];
const armas = ["Armadura","Espada","Martillo","Escudo","Arma de fuego","Flechas","Musculos"];

// Si tengo algo en el localstorage
const superHeroes = JSON.parse(localStorage.getItem("superHeroes")) || [];
if(superHeroes.length) actualizarTabla($seccionTabla,superHeroes);

// Creo dinamicamente las armas
crearSelect(armas)




$formulario.addEventListener("submit",(e)=>{
    // saca el comportamiento por defecto
    e.preventDefault();
    // Lo utilizo para desestructurar y obtener las variables del formulario
    // Así mismo 
    const {txtId,txtNombre,txtAlias,rdoEditorial,ranFuerza,sltArma} = $formulario;

    if(txtId.value === "")
    {
        const newSuperHeroe = new SuperHeroe(Date.now(),txtNombre.value,txtAlias.value,rdoEditorial.value,parseInt(ranFuerza.value),sltArma.value);
        
        
        // Agrego el spinner
        setTimeout(cargarSpinner,2);
        // superheroe nueva
        handlerCreate(newSuperHeroe);
    }
    else{
        
        // Update SuperHeroe
        const updateSuperHeroe = new SuperHeroe(parseInt(txtId.value),txtNombre.value,txtAlias.value,rdoEditorial.value,parseInt(ranFuerza.value),sltArma.value);
        cargarFormularioSuperHeroe($formulario,updateSuperHeroe);
        handlerUpdate(updateSuperHeroe);

    }

    // Referencia que vacía el formulario
    $formulario.reset();

})

function handlerCreate(nuevaSuperHeroe){
    superHeroes.push(nuevaSuperHeroe);
    actualizarStorage("superHeroes",superHeroes);
    actualizarTabla($seccionTabla,superHeroes);

}

function handlerUpdate(editSuperHeroe){
    console.log(editSuperHeroe);
    let index = superHeroes.findIndex((suph)=> suph.id == editSuperHeroe.id);
    console.log(index);
    console.log(editSuperHeroe);
    // Tengo que buscar a la superheroe con el id y reemplazarla
    superHeroes.splice(index,1,editSuperHeroe);

    actualizarStorage("superHeroes",superHeroes);
    actualizarTabla($seccionTabla,superHeroes);
}

function handlerDelete(id){
    let index = superHeroes.findIndex((suph)=> suph.id == id);
    console.log(index);
    superHeroes.splice(index,1);
    actualizarStorage("superHeroes",superHeroes);
    actualizarTabla($seccionTabla,superHeroes);
    $formulario.reset();
    
}

window.addEventListener("click",(e)=>{

    if(e.target.matches("td"))
    {
        const id = e.target.parentElement.getAttribute("data-id");
        console.log(id);
        const selectedSuperHeroe = superHeroes.find((find)=>{
            return find.id == id;
        })

        cargarFormularioSuperHeroe($formulario,selectedSuperHeroe);

        // console.log(selectedSuperHeroe);

    }
    // else if(e.target.matches("input[value='Eliminar superheroe']")){
    //     const id = parseInt($formulario.txtId);
    //     handlerDelete(id);
    // }

})

function actualizarStorage(clave,data){
    localStorage.setItem(clave,JSON.stringify(data));
}

function cargarFormularioSuperHeroe(formualrio,superheroe){
    formualrio.txtId.value = superheroe.id;
    formualrio.txtNombre.value = superheroe.nombre;
    formualrio.txtAlias.value = superheroe.alias;
    formualrio.rdoEditorial.value = superheroe.editorial;
    formualrio.ranFuerza.value = superheroe.fuerza;
    formualrio.sltArma.value = superheroe.arma;
}


function cargarSpinner()
{
    const $main = document.getElementById("main");
    const $img = document.createElement("video");
    $img.src = ".\\Images\\1kxh.gif"
    
    $main.appendChild($img);
}
