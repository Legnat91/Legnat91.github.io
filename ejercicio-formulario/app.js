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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefonoRegex = /^[0-9]{9}$/;

  function validarVacio(input) {
    if (input.value.trim() === "") {
      input.classList.add("cajaError");
      input.focus();
      return false;
    }

    input.classList.remove("cajaError");
    return true

  }

  function validarEmail() {
    email.classList.remove("cajaError");
    if (!emailRegex.test(email.value)) {
      email.classList.add('cajaError');
      email.focus();
      return false;
    }
    return true;
  }

  function validarGenero() {
    for (let g of genero) {
      if (g.checked){
        return true;
      } 
    }
    alert("Selecciona un género");
    return false;
  }

  function validarTerminos() {
    if (!terminos.checked) {
      alert("Debes aceptar los términos");
      return false;
    }
    return true;
  }

  function validarNumero() {
    telefono.classList.remove("cajaError");
    if (telefono.value.trim() === "") {
      return true;
    }
    if (!telefonoRegex.test(telefono.value)) {
      telefono.classList.add('cajaError');
      telefono.focus();
      return false;
    }
    return true;
  }

  function validarFechaNacimiento() {
    const controlFecha = new Date();
    const fecha = new Date(fechaNacimiento.value);
    if (fecha > controlFecha) {
      fechaNacimiento.classList.add("cajaError");
      alert('La fecha de nacimiento no puede ser mayor a la fecha de hoy');
      fechaNacimiento.focus();
      return false
    }
    fechaNacimiento.classList.remove('cajaError');
    return true;
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    let validalor = true;

    if (!validarVacio(nombre)) {
      validalor = false

    };
    if (!validarVacio(apellido1)) {
      validalor = false

    };
    if (!validarVacio(email)) {
      validalor = false

    };

    if (!validarVacio(fechaNacimiento)) {
           validalor = false;
    };

    if (!validarVacio(pais)) {
      validalor = false

    };
    if (!validarGenero()) {
      validalor = false;

    };
    if (!validarTerminos()) {
      validalor = false;

    };
    if (!validarEmail()) {
      validalor = false;

    };

    if (!validarNumero()) {
      validalor = false;
    }

    if (!validarFechaNacimiento()) {
      validalor = false;
    }

    if (!validalor) {
      return;
    }

    alert("Formulario válido");
    formulario.submit();
  });
});