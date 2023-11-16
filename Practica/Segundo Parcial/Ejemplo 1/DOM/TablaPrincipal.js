import{CrearElemento, EliminarElementos,LetraCapital} from "../Complementos/ComplementedScripts.js";

/**
 * Elimina todo lo contenido en la tabla y la vuelve a crear: Inicia con los encabezados basados en las propiedades,
 * y luego crea el cuerpo
 * @param {HTMLElement} tabla 
 * @param {Array} arrPropiedades propiedades de todos los elementos
 * @param {Array} arrObjetos todos los objetos correspondientes
 */
export function ActualizarTablaPricipal(tabla,arrPropiedades,arrObjetos){
    EliminarElementos(tabla);
    const nuevoEncabezado = CrearEncabezados(arrPropiedades);
    const nuevoCuerpo = CrearCuerpo(arrObjetos,nuevoEncabezado);
    tabla.appendChild(nuevoEncabezado);
    tabla.appendChild(nuevoCuerpo);
}


/**
 * Crea los encabezados y asigna el evento para ordenar la tabla
 * @param {Array} arrPropiedades 
 * @returns la fila de encabezados
 */
function CrearEncabezados(arrPropiedades){
    const nuevoEncabezado = CrearElemento("thead");
    const nuevaFila = CrearElemento("tr");
    const encabezadoBotones = ["modificar","eliminar"]; //Se incorporan las columnas Eliminar y Modificar

    // Creamos los encabezados que corresponden a las propiedades
    arrPropiedades.forEach(propiedad => {
        const nuevaColumna = CrearElemento("th");
        nuevaColumna.id = `column-${propiedad}`;
        nuevaColumna.classList.add(`column-${propiedad}`);
        nuevaColumna.innerText = LetraCapital(propiedad);
        // nuevaColumna.addEventListener("click",(e)=>{
        //     e.preventDefault();
        //     const nuevoEvento = new CustomEvent('OrdenarTabla',{detail:propiedad});
        //     document.dispatchEvent(nuevoEvento);
        // })
        nuevaFila.appendChild(nuevaColumna);
    });
    // Creamos los encabezados que contendran los botones
    encabezadoBotones.forEach((eb)=>{
        const nuevaColumna = CrearElemento("th");
        nuevaColumna.id = `column-${eb}`;
        nuevaColumna.classList.add(`column-${eb}`);
        nuevaColumna.innerText = LetraCapital(eb);
        nuevaFila.appendChild(nuevaColumna);
    });

    nuevaFila.classList.add("tableRow-Heder");
    nuevoEncabezado.appendChild(nuevaFila);

    return nuevaFila;
}

/**
 * Crea el cuerpo de la tabla. Las posiciones de cada elemento se basan en como se muestra, los encabezados
 * @param {Array} arrObjetos todos los objetos alojados en almacenamiento.
 * @param {HTMLElement} filaEncabezado objeto obtenido luego de haber creado el encabezado
 * @returns nuevo cuerpo de la tabla
 */
function CrearCuerpo(arrObjetos,filaEncabezado){
    const nuevoCuerpo = CrearElemento("tbody");
    const columnas = Array.from(filaEncabezado.children);
    arrObjetos.forEach((obj)=>{
        const nuevaFila = CrearElemento("tr");
        nuevaFila.id = obj.id;
        columnas.forEach((columna)=>{
            // Crearemos una celda por cada columna y por cada objeto
            const nuevaCelda = CrearElemento("td");

            // La propiedad de la columna la obtenemos a traves del id de la columna
            const propiedadColumna = columna.id.split("-")[1];
            nuevaCelda.id = `${obj.id}-${propiedadColumna}`;
            nuevaCelda.classList.add(`column-${propiedadColumna}`);

            // Si el objeto no posee la propiedad, validaremos que sean las columnas que contienen los botones
            if(obj[propiedadColumna] == undefined){
                // En caso de ser la columna de los botones agregaremos los botones correspondientes
                if(propiedadColumna == "modificar" || propiedadColumna == "eliminar"){
                    const nuevoBoton = CrearElemento("button");
                    nuevoBoton.type = "submit";
                    nuevoBoton.innerText = LetraCapital(propiedadColumna);
                    nuevoBoton.id = `${obj.id}-btn${nuevoBoton.innerText}`;
                    // Agregamos el evento modificar o eliminar
                    nuevoBoton.addEventListener("click",(e)=>{
                        e.preventDefault();
                        const nuevoEvento = new CustomEvent(propiedadColumna,{detail:obj});
                        document.dispatchEvent(nuevoEvento);
                    });
                    nuevaCelda.appendChild(nuevoBoton);

                }else{
                    // En caso de no ser una propiedad del objeto ni una columna de boton
                    nuevaCelda.innerText = "N/A";
                }

            }else{
                // En caso de contener la propiedad
                nuevaCelda.innerText = obj[propiedadColumna];
            }
            nuevaFila.appendChild(nuevaCelda);   
        });
        nuevoCuerpo.appendChild(nuevaFila);  
    })
    return nuevoCuerpo;
}