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
  const valorRango = document.getElementById("valorRango");
  const mensaje = document.getElementById("mensajeEn");

  const nombreRegex = /^[^\s][a-zA-ZÁáÈéÍíÓóÚúÜüÑñ\s]{2,}/; //No permite salto al principio pero si luego
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contraseñaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&.-_]).{8,}$/;//Debe tener al menos una o mas de una de estas condiciones
  const telefonoRegex = /^\+?[\d\s]{9,12}$/;//El +numero de pais opcional, y permite numeros y salto pero entre 9 a 12 numeros.

  function comprobarVacios(input) {//comprobamos los vacios, el input se añade el que queremos.
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
  //Comprobamos el Regex de nombre, si no cumple nos avisa
  function comprobarNombre() {
    const texto = nombre.nextElementSibling;

    if (!nombreRegex.test(nombre.value.trim())) {
      if (texto) texto.textContent = "El texto debe tener al menos tres letras, no empezar por espacio";
      nombre.classList.add("cajaError");
      //nombre.style.border="3px solid rgb(60, 235, 37)";
      //nombre.setAttribute=nombre.setAttribute('style', 'box-shadow: 0 0 8px 2px rgb(247, 109, 173);');
      return false;
    };
    if (texto) texto.textContent = "";
    nombre.classList.remove("cajaError");
    return true;
  };
  //Comprobamos el regex de email
  function comprobarEmail() {
    const texto = email.nextElementSibling;
    if (!emailRegex.test(email.value.trim())) {
      if (texto) texto.textContent = "El correo debe tener el formato correo@correo.es";
      email.classList.add("cajaError");
      return false;
    }
    if (texto) texto.textContent = "";
    email.classList.remove("cajaError");
    return true;
  };
  //Comprobamos tanto el Regex de contraseña como que coincidan, en contraseña2 no hace falta comprobar el Regex porque sino se cumple en la primera se para las comprobaciones y para seguir con la comparacion de contraseñas debe pasar primero
  function comprobarContraseña() {
    const texto = contraseña.nextElementSibling;
    const texto2 = contraseña2.nextElementSibling;

    if (!contraseñaRegex.test(contraseña.value.trim())) {
      if (texto) texto.textContent = "La contraseña debe tener al menos una mayuscula, una minuscula, un numero o caracter especial. Minimo 8 caracteres";
      contraseña.classList.add("cajaError");
      return false;
    }
    if (texto) texto.textContent = "";
    contraseña.classList.remove("cajaError");

    if (contraseña.value.trim() !== contraseña2.value.trim()) {
      if (texto2) texto2.textContent = "Las constraseña deben coincidir";
      contraseña2.classList.add("cajaError");
      return false
    }
    if (texto2) texto2.textContent = "";
    contraseña2.classList.remove("cajaError");
    return true;
  };

  function comprobarTelefono() {
    const texto = telefono.nextElementSibling;

    if (!telefonoRegex.test(telefono.value.trim())) {
      if (texto) texto.textContent = "El telefono debe tener estos formatos. ej:+34xxxxxxxxx o xxxxxxxxx";
      telefono.classList.add("cajaError");
      return false;
    };

    if (texto) texto.textContent = "";
    telefono.classList.remove("cajaError");
    return true
  };

  function comprobarFecha() {
    const texto = fNacimiento.nextElementSibling;
    //Recogemos los datos
    const hoy = new Date();
    const fechaNa = new Date(fNacimiento.value);
    //De los datos de fecha cogemos los años y los restamos para saber si es 18 o mas años
    let edad = hoy.getFullYear() - fechaNa.getFullYear();
    //Comprobamos los meses
    const mes = hoy.getMonth() - fechaNa.getMonth();
    //Si los meses son 0 o negativo, pues comprobamos que el dia hoy sea menor que el dia de cumpleaños
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNa.getDate())) {
      edad--;
    }
    //Si edad es menor a 18 pues no entra
    if (edad < 18) {
      if (texto) texto.textContent = "Debes ser mayor de 18 años"
      fNacimiento.classList.add("cajaError");
      return false;
    }

    if (texto) texto.textContent = "";
    fNacimiento.classList.remove("cajaError");
    return true;
  };

  function comprobarGenero() {
    const contenGenero = document.querySelector(".styGenero");
    const texto = contenGenero.nextElementSibling;

    for (let g of genero) {
      if (g.checked) {
        if (texto) texto.textContent = ""
        contenGenero.classList.remove("cajaError");
        return true;
      }
    }
    if (texto) texto.textContent = "Debe selecionar un genero"
    contenGenero.classList.add("cajaError");
    return false;
  };

  function comprobarTerminos() {
    const contenCondi = document.querySelector(".styCondi");
    const texto = contenCondi.nextElementSibling;
    if (condiciones.checked) {
      if (texto) texto.textContent = ""
      condiciones.classList.remove("cajaError");
      return true;

    }
    if (texto) texto.textContent = "Debes aceptar los terminos"
    condiciones.classList.add("cajaError");
    return false;
  };

  function comprobarRango() {
    return rango.value >= 0 && rango.value <= 10;
  }
  //se Puede usar este o el comentado para coger el valor de genero
  function generoSeleccionado() {
    for (let g of genero) {
      if (g.checked) {
        return g.value;
      }
    }
    return null;
  }

  function mensajeTexto() {
    //const generoSeleccionado = [...genero].find(g => g.checked)?.value || null;
    let datosFormulario = {
      nombre: nombre.value.trim(),
      email: email.value.trim(),
      telefono: telefono.value.trim(),
      pais: pais.value.trim(),
      fNacimiento: fNacimiento.value.trim(),
      genero: generoSeleccionado(),
      rango: rango.value.trim(),
      terminos: condiciones.checked
    };
    return datosFormulario
  }


  function guardarFormulario(datos) {
    localStorage.setItem('formularioCompletro', JSON.stringify(datos));
  }

 function mostrarForGuar(datos) {
  mensaje.style.display = "block"; 
  mensaje.innerHTML = `
    <div class="exito-box">
      <h2>Se han guardado los datos correctamente</h2>
      <p><strong>Nombre:</strong> ${datos.nombre}</p> 
      <p><strong>E-mail:</strong> ${datos.email}</p> 
      <p><strong>Telefono:</strong> ${datos.telefono}</p> 
      <p><strong>Pais:</strong> ${datos.pais}</p> 
      <p><strong>Fecha de Nacimiento:</strong> ${datos.fNacimiento}</p> 
      <p><strong>Genero:</strong> ${datos.genero}</p> 
      <p><strong>Rango:</strong> ${datos.rango}</p> 
      <p><strong>Terminos:</strong> ${datos.terminos ? "Aceptados" : "No aceptados"}</p> 
    </div>
  `;
}

  function cargarFormulario() {
    const datosForGuar = JSON.parse(localStorage.getItem('formularioCompletro'));
    if (datosForGuar) {
      mostrarForGuar(datosForGuar);
    }
  }

  //Para que se vea el valor de rango
  rango.addEventListener("input", () => {
    valorRango.textContent = rango.value;
  });


  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    let control = true;

    if (!comprobarVacios(nombre) || !comprobarNombre()) control = false;
    if (!comprobarVacios(email) || !comprobarEmail()) control = false;
    if (!comprobarVacios(contraseña) || !comprobarContraseña()) control = false;
    if (telefono.value.trim() !== "" && !comprobarTelefono()) control = false;
    if (!comprobarVacios(pais)) control = false;//Solo es necesario si se intenta pasar un vacio
    if (!comprobarVacios(fNacimiento) || !comprobarFecha()) control = false;
    if (!comprobarGenero()) control = false;
    if (!comprobarTerminos()) control = false;
    if (!comprobarRango()) control = false;


    if (control) {
      const datos = mensajeTexto();
      guardarFormulario(datos);
      mostrarForGuar(datos);
      formulario.reset();
    };

  });

  formulario.addEventListener("reset", () => {
    document.querySelectorAll('.aviso').forEach(avisoTexto => avisoTexto.textContent = "")
    document.querySelectorAll('.cajaError').forEach(clase => clase.classList.remove('cajaError'));

  })
  cargarFormulario();

});