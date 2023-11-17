import { CrearElemento, EliminarElementos, LetraCapital } from "../Complementos/ComplementedScripts.js";
import { Persona } from "../Entidades/Persona.js"

export function CrearFrmABM(contenedor,propiedades){

    EliminarElementos(contenedor);
    CamposBase(contenedor);
    CrearSelectABM(contenedor);
    CrearCamposEspecificos(contenedor,propiedades);

}

function CamposBase(contenedor){
    // Modificar en caso de cambiar la entidad
    const persona = new Persona(1,"p","p",15);
    const propiedadesPersona = Object.getOwnPropertyNames(persona);

    propiedadesPersona.forEach((p)=>{
        const nuevaLabel = CrearElemento("label");
        const nuevoTextBox = CrearElemento("input");
        nuevoTextBox.type = "text";
        nuevaLabel.id = `lbl-${p}`;
        nuevoTextBox.id = `txt-${p}`;
        nuevoTextBox.value = "";
        nuevaLabel.setAttribute("for",nuevoTextBox.id);
        nuevaLabel.innerText = `${LetraCapital(p)}:`;
        if(p === "id"){
            nuevoTextBox.readOnly = true;
        }

        contenedor.appendChild(nuevaLabel);
        contenedor.appendChild(nuevoTextBox);
    })
}

function CrearSelectABM(contenedor){
    // Modificar en caso de cambiar la entidad
    const tipos = ["seleccione","futbolista","profesional"];
    const nuevoSelect = CrearElemento("select");
    nuevoSelect.id = "selectABM";

    tipos.forEach((t)=>{
        const nuevaOpcion = CrearElemento("option");
        nuevaOpcion.value = t;
        nuevaOpcion.innerText = LetraCapital(t);
        nuevoSelect.appendChild(nuevaOpcion);
    });

    nuevoSelect.addEventListener("change",(e)=>{
        e.preventDefault();
        const nuevoEvento = new CustomEvent("mostrarCamposEspecificos",{detail:nuevoSelect});
        document.dispatchEvent(nuevoEvento);
    });

    contenedor.appendChild(nuevoSelect);
}

function CrearCamposEspecificos(contenedor,propiedades){
    const camposExistentes = Array.from(contenedor.children).filter((cmp)=>cmp.tagName === "INPUT");
    const propiedadesExistentes = camposExistentes.map((cmp)=>cmp.id.split("-")[1]);
    const propiedadesEspecificas = propiedades.filter((p)=>!propiedadesExistentes.includes(p));
    propiedadesEspecificas.forEach((p)=>{
        const nuevaLabel = CrearElemento("label");
        const nuevoTextBox = CrearElemento("input");
        nuevaLabel.id = `lbl-${p}`;
        nuevoTextBox.id = `txt-${p}`;
        nuevoTextBox.value = "";
        nuevaLabel.setAttribute("for",nuevoTextBox.id);
        nuevaLabel.innerText = `${LetraCapital(p)}:`;
        nuevaLabel.classList.add("none-visible");
        nuevoTextBox.classList.add("none-visible");
        nuevoTextBox.classList.add("especificFields");
        contenedor.appendChild(nuevaLabel);
        contenedor.appendChild(nuevoTextBox);
    });
}
