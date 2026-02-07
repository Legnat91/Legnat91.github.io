document.addEventListener("DOMContentLoaded", () => {
  const msIntro = document.getElementById("msIntro");
  const probar = document.getElementById("probar");
  const texto = document.getElementById("texto");

  const numeroRegex = /^\d+$/;


  function temporizador(s) {
    return new Promise((resolve, reject) => {

    //Comprobamos que el número sea entero,nada de decimales 
      if (!numeroRegex.test(s)) {
        reject("Error: Debe ser un numero entero");
      } else {
        setTimeout(() => {
          resolve(
            //Si el valor es 0 ponemos que es inmediato sino sale todo normal,esto da sensacion de control
            s === 0 ? "Temporarizador inmediato" : `Han pasado ${s} s`);
        }, s*1000)
      }
    });
  }

  probar.addEventListener("click", () => {
    texto.textContent="";
    //Si por equivocación no introducimos un valor lo avisamos
    if (msIntro.value.trim() === "") {
      texto.classList.remove("exito");
      texto.classList.add("error");
      texto.textContent = "Introduce un valor en milisegundos";
      return;
    }
    //Cambiamos el valor a un Number para ver el valor 0
    let s = Number(msIntro.value);
    //cada vez que demos al boton quitamos las clases por si queda alguna
    texto.classList.remove('error')
    texto.classList.remove('exito')
    temporizador(s)
      .then((mensaje) => {
        texto.classList.remove('error')
        texto.classList.add("exito")
        texto.textContent = mensaje
      })
      //Aqui capturamos los posibles errores que no pasen el numeroRegex
      .catch((error) => {
        texto.classList.remove('exito')
        texto.classList.add("error")
        texto.textContent = error
      })

  })
  //Lo utilizamos este evento para ver si pulsan enter, y reutiliamos el evento anterior
  msIntro.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      probar.click();
    }

  });

});

