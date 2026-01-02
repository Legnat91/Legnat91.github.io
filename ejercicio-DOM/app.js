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

  }

  formulario.addEventListener('submit', (e) => {

    e.preventDefault();
    
    const accion = e.submitter.value;

    if (accion === 'preview') {
      mensajeTexto();
      preview.innerHTML = `<div>
    <p><strong>Nombre:</strong> ${datosMensaje.nombre}</p> 
    <p><strong>E-mail:</strong> ${datosMensaje.email}</p> 
    <p><strong>Mensaje:</strong> </p>
    <p class="mensaje-previo">${datosMensaje.mensaje}</p>
    </div>
    <div class="botones">
    <button class="btn-enviar" type="submit" name="accion" value="enviar">Enviar</button>
    </div>
    `;

    }


    if (accion === 'enviar') {
      localStorage.setItem('mensajeGuardado', JSON.stringify(datosMensaje));
      alert('Mensaje enviado y guardado');
      formulario.reset();
      preview.innerHTML = ``;
      preview.classList.remove('vista-previa');
    }

  });

  
});