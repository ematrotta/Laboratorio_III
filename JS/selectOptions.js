export const crearSelect = (data)=>{
    
    const $select = document.getElementById("slt-Armas");

    if(!Array.isArray(data)) return null;

    // $select.appendChild(crearCabecera(data[0],colorCabecera));
    data.forEach((element)=>{
        const $option = document.createElement("option");
        $option.setAttribute("value",element);
        $option.textContent = element;
        $select.appendChild($option);
    
    
    })

    return $select;
}
