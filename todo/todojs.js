document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("nuevaLista");/*nuevalista*/

    const btnAdd = document.getElementById("btnAdd");/*btnñadir*/

    const lista = document.getElementById("lista");/*listaTareas */

    function crearLi(texto) {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="texto">${texto}</span>
            <button class="btnDelete" type="button">Eliminar</button>
            <button class="btnMod" type="button">Modificar</button>`;
        return li;
    }

    btnAdd.addEventListener("click", () => {

        const texto = input.value.trim();
        if (texto === "") {
            input.focus();
            return;
        }

        const nuevoLi = crearLi(texto);

        lista.append(nuevoLi);


        input.value = "";

        input.focus();
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

        else if (target.classList.contains("btnMod")) {

            const li = target.closest("li");

            const textoSpan = li.querySelector(".texto");

            const textoOriginal = textoSpan.textContent;

            li.innerHTML = `
            <input type="text" class="inputMod" value="${textoOriginal}">
            <button class="btnGuardar" type="button">Guardar</button>
            <button class="btnCancelar" type="button">Cancelar</button>
        `;

        }

        else if (target.classList.contains("btnGuardar")) {
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

            const li = target.closest("li");

            const input = li.querySelector(".inputMod");

            const textoOriginal = input.value;

            li.innerHTML = `
            <span class="texto">${textoOriginal}</span>
            <button class="btnEliminar" type="button">Eliminar</button>
            <button class="btnMod" type="button">Modificar</button>
        `;
        }

    });
});