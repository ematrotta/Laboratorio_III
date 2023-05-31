export const crearTabla = (data,colorCabecera)=>{
    const $tabla = document.createElement("table");

    // El valor buleano indica que en cuanto el atrapa la burbuja realiza el evento si esta
    // sentado en true. Si está en false, solo lo va a capturar en la fase final de burbuja
    // $tabla.addEventListener("click",handlerClickTabla,true);

    if(!Array.isArray(data)) return null;

    $tabla.appendChild(crearCabecera(data[0],colorCabecera));
    $tabla.appendChild(crearCuerpo(data));

    return $tabla;

}

const crearCabecera = (elemento,color)=>{
    const $thead = document.createElement("thead"),
    headRow = document.createElement("tr");
    headRow.style.setProperty("background-color",color);

    for (const key in elemento) {
        if(key === "id") continue;

        const th = document.createElement("th");
        th.textContent = key;
        headRow.appendChild(th);
    }

    $thead.appendChild(headRow);

    return $thead;


}

const crearCuerpo = (data)=>{

    if(!Array.isArray(data)) return null;
    const $tbody = document.createElement("tbody");

    data.forEach((element,index)=>{
        const tr = document.createElement("tr");
        // Esto hace que este oculta la head de id, pero que los id existan
        // Agregamos un evento dentro de cada fila
        // tr.addEventListener("click",handlerClick);
        if(index%2==0){
            tr.classList.add("rowPar");
        }

        for (const key in element) {
            if(key === "id"){
                tr.dataset.id = element[key];
                // tr.setAttribute("data-id",element[key]); Es lo mismo que la linea anterior
            }
            else{
                const td = document.createElement("td");
                // tr.addEventListener("click",handlerClickTd);
                td.textContent = element[key];
                tr.appendChild(td);
            }

        }
        $tbody.appendChild(tr);

    })




    return $tbody;

}

// Esto tendría mucho mejor rendimiento que agregar un addeventlistener por cada etiqueta.
// Le pido al windows que me agregue un manejado.
// window.addEventListener("click",(e)=>{

//     if(e.target.matches("td"))
//     {
//         const id = e.target.parentElement.getAttribute("data-id");

//     }

// })

function handlerClick(e){
    // const tr = e.target.parentElement.dataset.id;
    const tr = e.target.parentElement.getAttribute("data-id");
    console.log("Soy el manejador del Tr",tr);

}

// function handlerClickTd(e){
//     console.log("Soy el manejador del Td",e.target);
// }

// function handlerClickTabla(e){
//     // e.stopPropagation();
//     console.log("Soy el manejador de la tabla",e.target);
// }

export const actualizarTabla = (contenedeor,data)=>{

    // Mientras el contenedor que tiene la tabla, va removiendo el primer hijo
    while(contenedeor.hasChildNodes()){
        contenedeor.removeChild(contenedeor.firstElementChild);
    }

    contenedeor.appendChild(crearTabla(data,"coral"));

}