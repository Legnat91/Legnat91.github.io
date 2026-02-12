document.addEventListener("DOMContentLoaded", () => {
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const nEntrada = document.getElementById("nEntrada");
  const tEntrada = document.getElementById("tEntrada");
  const formulario = document.getElementById("formulario");
  const tablaR = document.querySelector("#tablaR tbody");

  let reservas = []; // Array donde guardamos las reservas

  // REGEX
  const nombreRegex = /^.{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // FUNCIONES DE VALIDACIÓN
  function mostrarError(input, mensaje) {
    const texto = input.nextElementSibling;
    input.classList.add("error");
    if (texto) texto.textContent = mensaje;
  }

  function limpiarError(input) {
    const texto = input.nextElementSibling;
    input.classList.remove("error");
    if (texto) texto.textContent = "";
  }

  function validarNombre() {
    if (!nombreRegex.test(nombre.value.trim())) {
      mostrarError(nombre, "El nombre debe tener mínimo 3 caracteres");
      return false;
    }
    limpiarError(nombre);
    return true;
  }

  function validarEmail() {
    if (!emailRegex.test(email.value.trim())) {
      mostrarError(email, "El email no tiene el formato correcto");
      return false;
    }
    limpiarError(email);
    return true;
  }

  function validarEntradas() {
    const valor = Number(nEntrada.value);
    if (isNaN(valor) || valor < 1 || valor > 10) {
      mostrarError(nEntrada, "Debe ser un número entre 1 y 10");
      return false;
    }
    limpiarError(nEntrada);
    return true;
  }

  function validarTipo() {
    if (!tEntrada.value) {
      mostrarError(tEntrada, "Debe seleccionar un tipo de entrada");
      return false;
    }
    limpiarError(tEntrada);
    return true;
  }

  // FUNCION PARA RENDERIZAR TABLA
  function renderTabla() {
    tablaR.innerHTML = ""; // Limpiar tabla
    reservas.forEach((reserva, index) => {
      tablaR.innerHTML += `
        <tr>
          <td>${reserva.nombre}</td>
          <td>${reserva.email}</td>
          <td>${reserva.entradas}</td>
          <td>${reserva.tipo}</td>
          <td><button class="eliminar" data-index="${index}">Eliminar</button></td>
        </tr>
      `;
    });
  }

  // DELEGACIÓN DE EVENTOS PARA ELIMINAR
  tablaR.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar")) {
      const index = e.target.dataset.index;
      reservas.splice(index, 1); // Eliminar del array
      renderTabla(); // Volver a dibujar
    }
  });

  // SUBMIT FORMULARIO
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    let valido = true;
    if (!validarNombre()) valido = false;
    if (!validarEmail()) valido = false;
    if (!validarEntradas()) valido = false;
    if (!validarTipo()) valido = false;

    if (!valido) return;

    // Añadir reserva al array
    reservas.push({
      nombre: nombre.value.trim(),
      email: email.value.trim(),
      entradas: Number(nEntrada.value),
      tipo: tEntrada.value
    });

    renderTabla(); // Mostrar tabla
    formulario.reset(); // Limpiar formulario
  });
});
