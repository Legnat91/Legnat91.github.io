document.addEventListener("DOMContentLoaded", () => {
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const edad = document.getElementById("edad");
    const tUsuario = document.getElementById("tUsuario");
    const btnRegistro = document.getElementById("btnRegistro");
    const form = document.getElementById("form");
    const tablaUsuario = document.getElementById("tablaUsuario");

    // Creamos un span para mensajes
    const mensaje = document.createElement("span");
    mensaje.id = "mensaje";
    mensaje.style.color = "green";
    mensaje.style.fontWeight = "bold";
    mensaje.style.display = "block";
    mensaje.style.textAlign = "center";
    mensaje.style.marginTop = "10px";
    form.parentNode.insertBefore(mensaje, form.nextSibling);

    const nRegex = /.{3,}/;
    const eRegex = /^[^@\s]+@[^\s@]+\.[^@\s]+$/;

    const registros = [];

    // --- FUNCIONES DE VALIDACIÓN ---
    function textoError(input, msg) {
        const span = input.nextElementSibling;
        if (span) span.textContent = msg;
        input.classList.add("error");
    }

    function limpiarError(input) {
        const span = input.nextElementSibling;
        if (span) span.textContent = "";
        input.classList.remove("error");
    }

    function comprobarNombre() {
        if (!nRegex.test(nombre.value.trim())) {
            textoError(nombre, "El nombre debe tener 3 o más caracteres");
            return false;
        }
        limpiarError(nombre);
        return true;
    }

    function comprobarEmail() {
        if (!eRegex.test(email.value.trim())) {
            textoError(email, "El correo debe ser del tipo correo@correo.es");
            return false;
        }
        limpiarError(email);
        return true;
    }

    function comprobarEdad() {
        const edadN = Number(edad.value.trim());
        if (isNaN(edadN)) {
            textoError(edad, "La edad debe ser un número");
            return false;
        }
        if (edadN < 18) {
            textoError(edad, "Debe ser mayor de edad");
            return false;
        }
        limpiarError(edad);
        return true;
    }

    function comprobarUsuario() {
        if (tUsuario.value === "") {
            textoError(tUsuario, "Se debe seleccionar un tipo de usuario");
            return false;
        }
        limpiarError(tUsuario);
        return true;
    }

    // --- FUNCIONES DE TABLA ---
    function crearTabla() {
        tablaUsuario.innerHTML = "";
        registros.forEach((reserva, index) => {
            tablaUsuario.innerHTML += `
                <tr>
                    <td>${reserva.nombre}</td>
                    <td>${reserva.email}</td>
                    <td>${reserva.edad}</td>
                    <td>${reserva.usuario}</td>
                    <td><button class="btnEliminar" data-index="${index}">Eliminar</button></td>
                </tr>
            `;
        });
    }

    // --- FUNCION ASINCRONA SIMULADA ---
    function guardarUsuarioAsync(usuario) {
        return new Promise((resolve) => {
            setTimeout(() => {
                registros.push(usuario);
                resolve();
            }, 1000); // simula 1 segundo de retraso
        });
    }

    // --- EVENTO DE BOTON ---
    btnRegistro.addEventListener('click', async (e) => {
        e.preventDefault();

        let validar = true;
        if (!comprobarNombre()) validar = false;
        if (!comprobarEmail()) validar = false;
        if (!comprobarEdad()) validar = false;
        if (!comprobarUsuario()) validar = false;

        if (!validar) return;

        const nuevoUsuario = {
            nombre: nombre.value.trim(),
            email: email.value.trim(),
            edad: Number(edad.value.trim()),
            usuario: tUsuario.value
        };

        await guardarUsuarioAsync(nuevoUsuario);

        crearTabla();
        form.reset();

        // Mensaje en HTML
        mensaje.textContent = "Usuario guardado correctamente!";
        setTimeout(() => {
            mensaje.textContent = "";
        }, 3000); // desaparece después de 3 segundos
    });

    // --- ELIMINAR FILA ---
    tablaUsuario.addEventListener("click", (e) => {
        if (e.target.classList.contains("btnEliminar")) {
            const index = e.target.dataset.index;
            registros.splice(index, 1);
            crearTabla();
        }
    });
});
