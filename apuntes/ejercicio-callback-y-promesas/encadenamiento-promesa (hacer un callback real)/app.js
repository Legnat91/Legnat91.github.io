document.addEventListener("DOMContentLoaded", () => {
  const salida = document.getElementById("salida");
  const ejecutar = document.getElementById("ejecutar");


  function obtenerDatos() {
    //Creamos la promesa con 2segundos para simular que se obtienen datos
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        //Como queremos que las exista posibilidades de fallo le añadimos una probabilidad, cuanto mas alto es el numero mayor es la posibilidad de fallo
        const okObtener = Math.random() > 0.25;
        if (!okObtener) {
          reject("Error al obtener datos");//creamos mensaje personalizado del error
        } else {
          const datos = { nombre: "Angel", edad: 34 };
          resolve(datos);
        }
      }, 2000);
    });
  }

  function procesarDatos(datos) {
    //Promesa de 1 segundo
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        //Hacemos lo mismo añadivos una varible random para darle posibilidad de fallo
        const okProceso = Math.random() > 0.25;
        if (!okProceso) {
          reject('Error al procesar los datos')//creamos mensaje personalizado del error
        } else {
          const resultado = {
            nombre: datos.nombre,
            edad: datos.edad,
            mensaje: `Los datos de ${datos.nombre} han sido procesados`,
          };
          resolve(resultado);
        }
      }, 1000);

    });
  }
  //esta funcion la hemos creado para poder añadir texto con clases
  function crearMensaje(texto, clase) {
    let p = document.createElement("p");
    p.className = clase;
    p.textContent = texto;
    return p;
  }

  //ACLARACIÓN:He puesto console.log porque lo pide el ejercicio pero teniendo el HTML creo que no seria necesario. 

  ejecutar.addEventListener("click", () => {
    ejecutar.disabled = true;//Cabiamo la propiedad del boton para que el boton este desabilitado y no haga varias peticiones
    salida.textContent = "";
    let cargar = crearMensaje("Cargando...", "cargando");
    salida.append(cargar);

    obtenerDatos()
      .then((datos) => {
        const textoDatos = `Datos obtenidos: ${datos.nombre} edad ${datos.edad}`;
        let obtener = crearMensaje(textoDatos, "obteniendo");
        salida.append(obtener);
        console.log("Datos obtenidos:", datos);
        //si todo sale bien se devuelve la funcion a los 2 segundos
        return procesarDatos(datos);
      })
      .then((resultado) => {
        //se resulve la ultima funcion después de un segundo y cuando acabe la primera
        const textoResultado = `Datos procesados: ${resultado.mensaje}`;
        let datosResultado = crearMensaje(textoResultado, "procesando");
        const obtener = document.querySelector(".obteniendo");
        if (obtener) obtener.style.color = "black";
        salida.append(datosResultado);
        console.log("Datos procesados:", resultado);
      })

      .catch((error) => {
        cargar.remove();
        const textoError = `ERROR:${error}`;
        let fallo = crearMensaje(textoError, "error");
        salida.append(fallo);
        console.error("Error:", error);
      })

      //Esto siempre se ejecuta, por dos motivos, uno para que el usuario vea que el proceso acabo y otra para habilitar siempre el boton
      .finally(() => {
        ejecutar.disabled = false;//habilitamos le boton
        cargar.remove();
        salida.innerHTML += `<p class="final">Programa finalizado</p>`;
        console.log("Finalizado")
      });

  });


});