//Esperamos que se ejecute el html completo
document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("nuevaLista");

    const btnAdd = document.getElementById("btnAdd");

    const lista = document.getElementById("lista");

    function crearLi(texto) {

        const li = document.createElement("li");
        //Con esto creamos html con js
        li.innerHTML = `
            <span class="texto">${texto}</span>
            <button class="btnDelete" type="button">Eliminar</button>
            <button class="btnMod" type="button">Modificar</button>`;
        return li;
    }

    btnAdd.addEventListener("click", () => {
        //Cuando damos a añadir con el raton cogemos valor que este dentro del input y quitamos los espacios del principio y final
        const texto = input.value.trim();
        if (texto === "") {
            input.focus();
            return;
        }
        
        const nuevoLi = crearLi(texto);
        //Esto hace que se ponga al final del ul
        lista.append(nuevoLi);


        input.value = "";

        input.focus();
    });
    //Cuando lo agregamos con Enter
    input.addEventListener("keydown", (event) => {
        
        if (event.key === 'Enter') {

            event.preventDefault(); //Evita los enter por defecto
            btnAdd.click();           //Con esto utilizamos directamente el evento btnADD

        }
    });

    lista.addEventListener("click", (event) => {

        const target = event.target;

        if (target.classList.contains("btnDelete")) {
            const li = target.closest("li");
            li.remove();
        }

        else if (target.classList.contains("texto")) {
            target.classList.toggle("completado");
        }
        //Para modificar, aqui debemos capturar lo que esta puesto convertilo en un nuevo input y poner los nuevos botones
        else if (target.classList.contains("btnMod")) {

            const li = target.closest("li");
            //aqui es donde se captura el texto
            const textoSpan = li.querySelector(".texto");

            const textoOriginal = textoSpan.textContent;

            li.innerHTML = `
            <input type="text" class="inputMod" value="${textoOriginal}">
            <button class="btnGuardar" type="button">Guardar</button>
            <button class="btnCancelar" type="button">Cancelar</button>
        `;

        }

        else if (target.classList.contains("btnGuardar")) {
            //esto es parecido al boton de añadir, deberia ver se puede referenciar de alguna manera al btn de añadir para no tener tanto codigo
            const li = target.closest("li");

            const nuevoTexto = li.querySelector(".inputMod").value.trim();

            if (nuevoTexto === "") return;

            li.innerHTML = `
            <span class="texto">${nuevoTexto}</span>
            <button class="btnDelete" type="button">Eliminar</button>
            <button class="btnMod" type="button">Modificar</button>
        `;
        }

        else if (target.classList.contains("btnCancelar")) {
            //lo mismo con guardar, ver si se puede reaprovechar  algo es muy parecido
            const li = target.closest("li");

            const input = li.querySelector(".inputMod");

            const textoOriginal = input.value;

            li.innerHTML = `
            <span class="texto">${textoOriginal}</span>
            <button class="btnDelete" type="button">Eliminar</button>
            <button class="btnMod" type="button">Modificar</button>
        `;
        }

    });
});