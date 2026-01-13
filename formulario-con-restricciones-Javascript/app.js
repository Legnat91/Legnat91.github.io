document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById("formulario");
  const nombre = document.getElementById("nombre");
  const apellido1 = document.getElementById("apellido1");
  const email = document.getElementById("email");
  const telefono = document.getElementById("telefono");
  const fechaNacimiento = document.getElementById("fechaNacimiento");
  const genero = document.querySelectorAll('input[name="genero"]');
  const pais = document.getElementById('pais');
  const terminos = document.getElementById("terminos");
  const apellido2 = document.getElementById("apellido2");

  const emailRegex = /^[^\s@]+@[^\s@]+\.+[^\s@]+$/;
  const numeroRegex = /^\d{9}$/;
  const textoRegex = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]{3,}$/;

  function comprobarVacio(input) {
    const span = input.parentElement.querySelector('.nota');
    if (input.value.trim() === "") {
      input.classList.add('cajaError');
      if (span) span.textContent = 'El campo esta vacio, por favor rellena los campos obligatorios.';
      input.focus();
      return false;
    }
    input.classList.remove('cajaError');
    if (span) span.textContent = "";
    return true;
  }

  function comprobarEmail() {
    const span = email.parentElement.querySelector('.nota');
    if (!emailRegex.test(email.value.trim())) {
      email.classList.add('cajaError');
      email.focus();
      if (span) span.textContent = "El correo electronico debe ser ej:usuario@dominio.com";
      return false
    }
    email.classList.remove('cajaError');
    if (span) span.textContent = "";
    return true
  }

  function comprobarNumero() {
    telefono.classList.remove('cajaError');
    const span = telefono.parentElement.querySelector('.nota');
    if (telefono.value.trim() === "") {
      if (span) span.textContent = "";
      return true
    }
    if (!numeroRegex.test(telefono.value)) {
      telefono.classList.add('cajaError');
      telefono.focus();
      if (span) span.textContent = "Deben ser un número de telefono valido (9 números)";
      return false;
    }
    if (span) span.textContent = "";
    return true;
  }

  function comprobarTexto(input) {
    const span = input.parentElement.querySelector('.nota');
    input.classList.remove('cajaError');

    if (!textoRegex.test(input.value.trim())) {
      input.classList.add('cajaError');
      input.focus();
      if (span) span.textContent = "Debe tener al menos 3 letras y no empezar por espacio"
      return false
    }
    if (span) span.textContent = "";
    return true
  }

  function comprobarGenero() {
    const fieldset = document.querySelector('fieldset');
    const span = fieldset.parentElement.querySelector('.nota');

    for (g of genero) {
      if (g.checked) {
        fieldset.classList.remove('generoError');
        if (span) span.textContent = "";
        return true;
      }
    }
    if (span) span.textContent = 'Marque un genero';
    fieldset.classList.add('generoError');
    return false;

  }

  function comprobarTerminos() {
    const span = terminos.parentElement.querySelector('.nota');
    if (!terminos.checked) {
      if (span) span.textContent = 'Debe aceptar los terminos';
      return false;
    }
    if (span) span.textContent = "";
    return true
  }

  function comprobarFechaNacimiento() {
    const span = fechaNacimiento.parentElement.querySelector('.nota');

    if (fechaNacimiento.value.trim() === "") {
      if (span) span.textContent = "Introduce una fecha de nacimiento";
      return false;
    }

    const controlFecha = new Date();
    const fecha = new Date(fechaNacimiento.value);

    if (fecha > controlFecha) {
      fechaNacimiento.classList.add("cajaError");
      if (span) span.textContent = "La fecha de nacimiento debe ser menor a la fecha actual";
      fechaNacimiento.focus();
      return false
    }
    fechaNacimiento.classList.remove('cajaError');
    if (span) span.textContent = "";
    return true;
  }

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    let validalor = true;

    if (!comprobarVacio(nombre) || !comprobarTexto(nombre)) {
      validalor = false;
    }

    if (!comprobarVacio(apellido1) || !comprobarTexto(apellido1)) {
      validalor = false;
    };

    if (apellido2.value.trim() !== "") {
      if (!comprobarTexto(apellido2)) {
        validalor = false;
      }
    } else {
      apellido2.classList.remove('cajaError');
      const span = apellido2.parentElement.querySelector('.nota');
      if (span) span.textContent = "";
    }

    if (!comprobarVacio(email) || !comprobarEmail()) validalor = false;

    if (!comprobarVacio(fechaNacimiento) || !comprobarFechaNacimiento()) validalor = false;

    if (!comprobarVacio(pais)) validalor = false;

    if (!comprobarGenero()) validalor = false;

    if (!comprobarTerminos()) validalor = false;

    if (!comprobarNumero()) validalor = false;

    if (validalor) {
      alert("Formulario válido");
      formulario.submit();
    }

  });

});