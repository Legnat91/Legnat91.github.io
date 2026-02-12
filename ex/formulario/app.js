document.addEventListener("DOMContentLoaded", () => {
  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const contrasena = document.getElementById("contrasena");
  const telefono = document.getElementById("telefono");
  const fNacimiento = document.getElementById("fNacimiento");
  const terminos = document.getElementById("terminos");
  const formulario = document.getElementById("formulario")
  const mensajeEn = document.getElementById("mensajeEn");

  //REGEX PARA COMPROBAR
  const nombreRegex = /^[^\s\d][a-zA-Z\s]{2,}/;
  const emailRegex = /^[^\s@\.]+@[^\s@]+\.+[^\s@]+$/;
  const telefonoRegex = /^\d{9}$/;
  const contrasenaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}])[^\s]{8,20}$/;

  let datosFormulario = {};
  //Con esto comprobamos todos los input que esten vacios con su control 
  function comprobarVacios(input) {
    //Coge el padre de al lado del input
    const nota = input.parentElement.nextElementSibling;
    if (input.value.trim() === "") {
      if (nota) nota.textContent = "Los datos son obligatorios no pueden estar vacios";
      input.classList.add("cajaError");
      input.focus();
      return false;
    }

    /*function mostrarError(input, mensaje) {
      const nota = input.parentElement.nextElementSibling;
      input.classList.add("cajaError");
      if (nota) nota.textContent = mensaje;
    }
    //Añadir luego
    function limpiarError(input) {
      const nota = input.parentElement.nextElementSibling;
      input.classList.remove("cajaError");
      if (nota) nota.textContent = "";
    }*/

    if (nota) {
      nota.textContent = "";
      nota.classList.remove("cajaError");
    }

    return true;
  }

  //Comprobacion de nombre
  function comprobarNombre() {
    const nota = nombre.parentElement.nextElementSibling;
    //Utilizamos el Regex para saber si esta todo ok
    if (!nombreRegex.test(nombre.value.trim())) {
      if (nota) nota.textContent = "El nombre debe contener 3 caracteres";

      nombre.classList.add("cajaError");
      nombre.focus();
      return false;
    }
    if (nota) {
      nombre.classList.remove("cajaError");
      nota.textContent = "";
    }
    return true;
  }

  function comprobarContra() {
    const nota = contrasena.parentElement.nextElementSibling;

    if (!contrasenaRegex.test(contrasena.value.trim())) {
      if (nota) {
        contrasena.classList.add("cajaError");
        nota.textContent =
          "La contraseña debe tener minimo 9 caracteres, una mayuscula, una minuscula y un caracter especial";
      }
      contrasena.focus();
      return false;
    }

    if (nota) {
      if (nota) {
        contrasena.classList.remove("cajaError");
        nota.textContent = "";
      }
    }

    return true;
  }

  function comprobarCorreo() {
    const nota = correo.parentElement.nextElementSibling;
    if (!emailRegex.test(correo.value.trim())) {
      if (nota) {
        correo.classList.add("cajaError");
        nota.textContent = "El email debe tener este formato ejem:correo@correo.com";
      }
      return false;
    }
    if (nota) {
      correo.classList.remove("cajaError");
      nota.textContent = "";
    }
    return true;

  }
  function comprobarCheck() {
    const nota = terminos.parentElement.nextElementSibling;
    if (terminos.checked) {
      if (nota) nota.textContent = "";
      return true;
    }
    if (nota) nota.textContent = "Debe aceptar los terminos de uso";
    return false;

  }

  function comprobarNacimiento() {
    //Debemos converitor los DATE en datos numericos, porque el valor es String
    const nota = fNacimiento.parentElement.nextElementSibling;
    //Creamos los constructores
    let hoy = new Date();
    let fechaNacimiento = new Date(fNacimiento.value);

    //Si por casualidad intentan meter una letra lo controlamos
    if (Number.isNaN(fechaNacimiento.getTime())) {
      if (nota) nota.textContent = "Fecha invalida";
      return false;

    }
    //Comprobamos que la fecha de nacimiento sea despues de hoy
    if (fechaNacimiento > hoy) {
      if (nota) nota.textContent = "La fecha no puede ser superior a la de hoy"
      return false
    }
    //Ahora los datos lo pasamos a numeros, primeros vamos a comprobar el año en que es uno mayor de edad
    const limite = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
    //Si vemos que la fecha de nacimiento es mayor que el limite error
    if (fechaNacimiento > limite) {
      if (nota) nota.textContent = "No puede ser menor de edad";
      return false;
    }
    if (nota) nota.textContent = ""
    return true;
  }

  function comprobarTele() {
    const nota = telefono.parentElement.nextElementSibling;
    //si la caja esta vacia al ser un dato opcional debe poder continuar
    if (telefono.value.trim() === "") {
      telefono.classList.remove("cajaError");
      if (nota) nota.textContent = "";
      return true;
    }

    if (!telefonoRegex.test(telefono.value.trim())) {
      if (nota) nota.textContent = "El telefono debe terner un extensión de 9 digitos";
      telefono.classList.add("cajaError");
      return false;
    }

    if (nota) nota.textContent = "";
    telefono.classList.remove("cajaError");
    return true;

  }
  //Aqui debemos crear el objeto donde se guardaran los datos
  function guardarMensaje() {
    datosFormulario = {
      nombre: nombre.value.trim(),
      email: correo.value.trim(),
      telefono: telefono.value.trim(),
      fNacimiento: fNacimiento.value.trim()
    }
    //Creamos el JSON donde se guardara
    localStorage.setItem('formularioGuardado', JSON.stringify(datosFormulario));
  }

  function mensaje(datos) {
    //esto es para que se vea el formulario en pantalla
    mensajeEn.innerHTML = `<div><p><strong>Nombre Completo: </strong>${datos.nombre}</div>
    <div><p><strong>E-mail: </strong>${datos.email}</p></div>
    <div><p><strong>Telefono: </strong>${datos.telefono}</p></div>
    <div><p><strong>Fecha de Nacimiento: </strong>${datos.fNacimiento}</p></div>`;
  }

  function cargarMensaje() {
    //Se cargan el objeto guardado en el json
    const guardado = localStorage.getItem('formularioGuardado');
    if (!guardado) return;//Si no existe pues nada
    const datos = JSON.parse(guardado);//Se escribem los datos
    mensaje(datos);//Se cargan en la pantall
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    let control = true;

    if (!comprobarVacios(nombre) || !comprobarNombre()) control = false;

    if (!comprobarVacios(contrasena) || !comprobarContra()) control = false;

    if (!comprobarVacios(correo) || !comprobarCorreo()) control = false;

    if (!comprobarCheck()) control = false;

    if (!comprobarVacios(fNacimiento) || !comprobarNacimiento()) control = false;

    if (!comprobarTele()) control = false;

    if (!control) return;

    guardarMensaje();
    cargarMensaje();
    formulario.reset();

  });
  //si existe se carga siempres ene pantalla 
  cargarMensaje();

});