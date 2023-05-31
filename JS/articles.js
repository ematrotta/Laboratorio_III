const crearArticles = (data)=>{
    
    const $section = document.getElementById("seccion-personajes");

    if(!Array.isArray(data)) return null;

    // $select.appendChild(crearCabecera(data[0],colorCabecera));
    data.forEach((element,index)=>{
        console.log(element);
        const $article = document.createElement("article");
        for (const key in element) {
            if(key === "id")continue;
            const $h3 = document.createElement("h3");
            // tr.addEventListener("click",handlerClickTd);
            $h3.textContent = key[0].toUpperCase()+key.substring(1) + ": "+element[key];
            $article.appendChild($h3);

        }
        $section.appendChild($article);
    
    })

    return $section;
}

const superHeroes = JSON.parse(localStorage.getItem("superHeroes"))
crearArticles(superHeroes);