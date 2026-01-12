document.addEventListener('DOMContentLoaded', () => {

  const formulario = document.getElementById('formulario');
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const mensaje = document.getElementById('mensaje');
  const preview = document.getElementById('preview');

  let datosMensaje = {};

  function mensajeTexto() {
    datosMensaje = {
      nombre: nombre.value.trim(),
      email: email.value.trim(),
      mensaje: mensaje.value.trim()
    };

    preview.classList.add('vista-previa');
    preview.innerHTML = `<div>
    <p><strong>Nombre:</strong> ${datosMensaje.nombre}</p> 
    <p><strong>E-mail:</strong> ${datosMensaje.email}</p> 
    <p><strong>Mensaje:</strong> </p>
    <p class="mensaje-previo">${datosMensaje.mensaje}</p>
    </div>    
    `;
    localStorage.setItem('mensajeGuardado', JSON.stringify(datosMensaje));
    alert('Mensaje enviado y guardado');
    formulario.reset();
  }
  
  function mostrarPreview(datos) {
  preview.classList.add('vista-previa');
  preview.innerHTML = `
    <div>
      <p><strong>Nombre:</strong> ${datos.nombre}</p> 
      <p><strong>E-mail:</strong> ${datos.email}</p> 
      <p><strong>Mensaje:</strong></p>
      <p class="mensaje-previo">${datos.mensaje}</p>
    </div>
  `;
}

  function cargarMensaje() {
    const datosGuardados = JSON.parse(localStorage.getItem('mensajeGuardado'));
    if (datosGuardados) {
      mostrarPreview(datosGuardados);
    }

  }


  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    mensajeTexto();
  });

  cargarMensaje()

});