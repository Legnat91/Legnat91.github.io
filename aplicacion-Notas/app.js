document.addEventListener('DOMContentLoaded', () => {

  const btnAgregar = document.getElementById('btnAgregar');
  const notas = document.getElementById('notas');
  const inpNota = document.getElementById('inpNota');


  function ingresarNota(texto) {

    const li = document.createElement('li');
    li.classList.add('nota');

    li.innerHTML = `<span class="texto">${texto}</span> 
    <span><button class="btnModificar">Modificar</button> <button class="btnBorrar">Borrar</button></span>`;

    return li;
  }

  function guardarNotas() {
    const notasArrays = [];

    document.querySelectorAll('#notas li .texto').forEach(span => {
      notasArrays.push(span.textContent);
    });

    localStorage.setItem('notas', JSON.stringify(notasArrays))

  }

  function cargarNotas() {
    const notasGuardadas = JSON.parse(localStorage.getItem('notas')) || [];
    notasGuardadas.forEach(texto => {
      const li = ingresarNota(texto);
      notas.append(li);
    })
  }

  function modificar(target) {
    const li = target.closest("li");
    const textoOriginal = li.querySelector(".texto").textContent;
    return li.innerHTML = `<input type="text" class="inputMod" value="${textoOriginal}">
    <span><button class="btnGuardar" type="button">Guardar</button> <button class="btnCancelar" type="button">Cancelar</button></span>`
  }

  function guardarMod(target) {
    const li = target.closest('li');
    const nuevoTexto = li.querySelector('.inputMod').value.trim();

    if (nuevoTexto === "") return;

    li.innerHTML = `
    <span class="texto">${nuevoTexto}</span> 
    <span><button class="btnModificar">Modificar</button> <button class="btnBorrar">Borrar</button></span>
  `;
  }

  btnAgregar.addEventListener('click', () => {

    const texto = inpNota.value.trim();

    if (texto === "") {
      inpNota.focus();
      return
    }

    const listaTexto = ingresarNota(texto);

    notas.append(listaTexto);

    inpNota.value = "";

    inpNota.focus();

    guardarNotas();

  });

  inpNota.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      btnAgregar.click();
    }

  });

  notas.addEventListener('click', (e) => {

    const target = e.target;

    if (target.classList.contains('btnBorrar')) {
      const li = target.closest("li");
      li.remove();
      guardarNotas();
    } else if (target.classList.contains('btnModificar')) {
      modificar(target);
    } else if (target.classList.contains('btnCancelar')) {
      notas.innerHTML = "";
      cargarNotas();
    } else if (target.classList.contains('btnGuardar')) {
      guardarMod(target);
      guardarNotas();
    }

  })

  cargarNotas();

});
