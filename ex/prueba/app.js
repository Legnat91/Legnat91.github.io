document.addEventListener("DOMContentLoaded", () => {

  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const contraseña = document.getElementById("contraseña");
  const contraseña2 = document.getElementById("contraseña2");
  const fNacimiento = document.getElementById("fNacimiento");
  const terminos = document.getElementById("terminos");
  const formulario = document.getElementById("formulario");
  const mensaje = document.getElementById("mensaje");

  const nRegex = /^.{3,}$/;
  const eRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  function comprobarNombre() {
    const texto = nombre.nextElementSibling;

    if (!nRegex.test(nombre.value.trim())) {
      texto.textContent = "El nombre debe tener al menos 3 caracteres";
      nombre.classList.add("error");
      return false;
    }

    texto.textContent = "";
    nombre.classList.remove("error");
    return true;
  }

  function comprobarEmail() {
    const texto = email.nextElementSibling;

    if (!eRegex.test(email.value.trim())) {
      texto.textContent = "Formato de email inválido";
      email.classList.add("error");
      return false;
    }

    texto.textContent = "";
    email.classList.remove("error");
    return true;
  }

  function comprobarContraseña() {
    const texto = contraseña.nextElementSibling;
    const texto2 = contraseña2.nextElementSibling;

    if (!cRegex.test(contraseña.value)) {
      texto.textContent = "Debe tener 8 caracteres, una mayúscula y un número";
      contraseña.classList.add("error");
      return false;
    } else {
      texto.textContent = "";
      contraseña.classList.remove("error");
    }

    if (contraseña.value !== contraseña2.value) {
      texto2.textContent = "Las contraseñas no coinciden";
      contraseña2.classList.add("error");
      return false;
    } else {
      texto2.textContent = "";
      contraseña2.classList.remove("error");
    }

    return true;
  }

  function comprobarFecha() {
    const texto = fNacimiento.nextElementSibling;

    const hoy = new Date();
    const fechaInput = new Date(fNacimiento.value);

    if (isNaN(fechaInput.getTime())) {
      texto.textContent = "Fecha inválida";
      return false;
    }

    const limite = new Date(
      hoy.getFullYear() - 18,
      hoy.getMonth(),
      hoy.getDate()
    );

    if (fechaInput > limite) {
      texto.textContent = "Debes ser mayor de 18 años";
      return false;
    }

    texto.textContent = "";
    return true;
  }

  function comprobarTerminos() {
    const texto = document.getElementById("textoError");

    if (!terminos.checked) {
      texto.textContent = "Debes aceptar los términos";
      return false;
    }

    texto.textContent = "";
    return true;
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    let valido = true;
    mensaje.textContent = "";

    if (!comprobarNombre()) valido = false;
    if (!comprobarEmail()) valido = false;
    if (!comprobarContraseña()) valido = false;
    if (!comprobarFecha()) valido = false;
    if (!comprobarTerminos()) valido = false;

    if (valido) {
      mensaje.textContent = "Formulario enviado con éxito";
      formulario.reset();
    }
  });


  
});
