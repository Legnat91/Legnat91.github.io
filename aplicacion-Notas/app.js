document.addEventListener('DOMContentLoaded', () => {

  const btnAgregar = document.getElementById('btnAgregar');
  const notas = document.getElementById('notas');
  const inpNota = document.getElementById('inpNota');


  function ingresarNota(texto) {

    const li = document.createElement('li');
    li.classList.add('nota');

    li.innerHTML = `<span>${texto}</span> <button class="btnBorrar">Borrar</button>`;

    return li;
  }
  
  function guardarNotas(){
    const notasArrays=[];
    
    document.querySelectorAll('#notas li span').forEach(span=>{
      notasArrays.push(span.textContent);
    });

    localStorage.setItem('notas',JSON.stringify(notasArrays))

  }

  function cargarNotas(){
    const notasGuardadas=JSON.parse(localStorage.getItem('notas'))||[];
    notasGuardadas.forEach(texto=>{
      const li=ingresarNota(texto);
      notas.append(li);
    })
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
    }

  })

 cargarNotas();

});
