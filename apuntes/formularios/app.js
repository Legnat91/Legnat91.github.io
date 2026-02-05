document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const contraseña = document.getElementById("contraseña");
  const contraseña2 = document.getElementById("contraseña2");
  const telefono = document.getElementById("telefono");
  const pais = document.getElementById("pais");
  const fNacimiento = document.getElementById("fNacimiento");
  const genero = document.querySelectorAll('input[name="genero"]');
  const rango = document.getElementById("rango");
  const condiciones = document.getElementById("condiciones");

  const nombreRegex = /^[^\s][a-zA-ZÁáÈéÍíÓóÚúÜüÑñ\s]{2,}/; //No permite salto al principio pero si luego
  const emailRegex = /^[^\s@]+@+[^\s@]+\.+[^\s@]+$/;
  const contraseñaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&.-_]).{8,}$/;//Debe tener al menos una o mas de una de estas condiciones
  const telefonoRegex = /^\+?[\d\s]{9,12}$/;//El +numero de pais opcional, y permite numeros y salto pero entre 9 a 12 numeros.

  function comprobarVacios(input) {
    const texto = input.nextElementSibling;
    if (input.value.trim() === "") {
      if (texto) texto.textContent = "Campo obligatorio, no puede estar vacio";
      input.classList.add("cajaError");
      return false;
    }
    if (texto) texto.textContent = "";
    input.classList.remove("cajaError");
    return true;
  };

  function comprobarNombre() {
    const texto = nombre.nextElementSibling;

    if (!nombreRegex.test(nombre.value.trim())) {
      if (texto) texto.textContent = "El texto debe tener al menos tres letras, no empezar por espacio";
      nombre.classList.add("cajaError");
      return false;
    };
    if (texto) texto.textContent = "";
    nombre.classList.remove("cajaError");
    return true;
  };


  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    let control = true;

    if (!comprobarVacios(nombre) || !comprobarNombre()) control = false;


    if (control) {
      alert("¡Todo ok! Datos enviados correctamente.");
      formulario.reset();
    };

  });
});