document.addEventListener("DOMContentLoaded", () => {
  const listaTareas = document.getElementById("listaTareas");
  const inputTarea = document.getElementById("inputTarea");
  const btnTarea = document.getElementById("btnTarea");
  const urlDatos = "https://jsonplaceholder.typicode.com/todos";

  let tareasGlobal = [];

  //Esta funcion aunque no tenga una utilidad real en este caso es para poner siempre la ultima id
  function ultimoId() {

    if (tareasGlobal.length === 0) return 0;

    let maxId = tareasGlobal[0].id;
    //Esto es una funcion for normal para coger el valor más grande
    for (let i = 1; i < tareasGlobal.length; i++) {
      const idActual = tareasGlobal[i].id;
      if (idActual > maxId) {
        maxId = idActual;
      }
    }
    return maxId

  }

  function crearLiTarea(tarea) {
    const li = document.createElement("li");

    const id = document.createElement("span");
    const titulo = document.createElement("span");
    const estado = document.createElement("span");

    id.textContent = tarea.id;

    titulo.classList.add("titulo");
    titulo.textContent = tarea.title;

    // Estado visual
    estado.textContent = tarea.completed ? "Completado" : "Pendiente";
    estado.className = tarea.completed ? "completado" : "terminado";

    //if (tarea.completed) li.classList.add("completada");

    li.appendChild(id);
    li.appendChild(titulo);
    li.appendChild(estado);

    return li;
  }

  //GET
  async function obtenerDatos() {
    try {
      const respuestaDatos = await fetch(urlDatos);
      //Se comprueba si la petición tiene exito 
      if (!respuestaDatos.ok) {
        //capturamos el error
        throw new Error("ERROR:No se ha podido conectar a la base de datos");
      }

      //Si la peticion esta ok pues convertimos los datos a JSON
      const tareas = await respuestaDatos.json();

      //Esto es una varible que usaremos luego para controlar la id
      tareasGlobal = tareas;

      //Borramos posibles datos en la lista de tareas
      listaTareas.innerHTML = "";

      //Recorremos la varible tarea sacando la informacion y creando los li y los span con sus estilos
      tareas.forEach((tarea) => {
        const li = crearLiTarea(tarea);
        listaTareas.prepend(li);

      });

      //Capturamos los errores tanto por consola como por pantalla
    } catch (error) {
      listaTareas.innerText = "Error de carga";
      console.error(error);
    }

  }

  //POST
  async function agregarTarea() {

    //Para capturar las tareas que se agregen por el imput
    const tareaIntro = inputTarea.value.trim();

    //Por sin darnso cuenta ponemos vacio conseguimos detener y poner foco en el input para que añadan un valor
    if (tareaIntro === "") {
      inputTarea.focus();
      return;
    }

    //Creamos el objeto donde se guardaran los datos que añadiremos
    const nuevaTarea = {
      userId: 1,
      id: ultimoId() + 1,//esto es para lo que se puso el id más alto
      title: tareaIntro,
      completed: false
    };

    try {
      //Aqui creamos como vamos a tratar los datos que enviamos al servidor
      const respuestaDatos = await fetch(urlDatos, {
        //El tipo de metodo y el header es necesario para que el servidor no nos rechace
        method: "POST",
        headers: {
          // Los datos se van a enviar en formato JSON
          "Content-Type": "application/json;charset=utf-8"
        },
        // Datos convertidos a formato JSON
        body: JSON.stringify(nuevaTarea)
      });

      //Se comprueba si la petición tiene exito 
      if (!respuestaDatos.ok) {
        throw new Error("ERROR:No se ha podido conectar a la base de datos");
      }

      //promesa con la transformación de los datos a JSON
      await respuestaDatos.json();

      tareasGlobal.push(nuevaTarea);

      const li = crearLiTarea(nuevaTarea);
      listaTareas.prepend(li);

      // Limpiar input
      inputTarea.value = "";
      inputTarea.focus();
    } catch (error) {
      console.error(error);
    }
  }

  obtenerDatos();

  btnTarea.addEventListener("click", (e) => {
    e.preventDefault();
    agregarTarea();
  });
});