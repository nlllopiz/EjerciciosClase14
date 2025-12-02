// DEFINICION DE VARIABLES GLOBALES *****************************************************

let productos = [];
let listaProductosCarrito = cargarCarritoDeStorage();

// DEFINICION DE FUNCIONES **************************************************************

//función que inserta los productos en la página

//Agregamos el parámetro lista
//eliminamos la copia
//cambio en el for listaProductos por lista
function insertarProductos(lista) {
    //obtengo el elemento contenedor de los productos
    const contenedorProductos = document.querySelector("#productos .row");
    //para verificar el elemento seleccionado
    //console.log(contenedorProductos);

    //utilizo un bucle para insertar todos los elementos de la lista
    //uso desestructuración del producto en variables para cada producto de la lista
    for (const { id, img, nombre, descripcion, precio } of lista) {
        //creamos el elemento (en memoria)
        const nuevoElemento = document.createElement("div");
        //agregamos al elemento las clases necesarias
        nuevoElemento.className = "card col-10 col-sm-5 col-lg-3 m-2";
        //creamos el contenido del elemento
        //usamos el atributo data del botón para identificar el producto
        nuevoElemento.innerHTML = `
                    <img src="${img}" class="card-img-top" alt="...">
                    <div class="card-body text-center">
                        <h5 class="card-title">${nombre}</h5>
                        <p class="m-0">
                            <a 
                                class="link-info link-opacity-50-hover link-underline-opacity-0" 
                                href="#."
                                data-descripcion="${descripcion}"
                            >
                                Ver descripción
                            </a>
                        </p>
                        <div class="descripcion"></div>
                        <p class="card-text text-danger fs-3 mt-2">${precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</p>
                        <button 
                            type="button" 
                            class="btn btn-dark pb-2"
                            data-id="${id}"
                        >
                            Agregar al carrito
                        </button>
                    </div>
        `;
        //insertamos el nuevo elemento en el contenedor en el HTML
        contenedorProductos.appendChild(nuevoElemento);
    }
}

//función para mostrar la descripción del producto
//la llama el listener y le pasa los datos del evento
function mostrarDescripcion(datosEvento) {
    console.log(datosEvento.target.tagName);

    const elementoEvento = datosEvento.target.tagName;
    if (elementoEvento === "A") {
        //obtener el elemento clicado
        const elementoClicado = datosEvento.target;

        //obtener la descripción del dataset
        console.log(datosEvento.target.dataset.descripcion)
        const descripcionProducto = elementoClicado.dataset.descripcion;
        //encontrar la tarjeta contenedora del botón
        const divCard = elementoClicado.closest(".card");
        console.log(divCard);
        //obtener el div de la descripción
        const divDescripcion = divCard.querySelector(".descripcion");
        console.log(divDescripcion);


        if (divDescripcion.children.length == 0) {
            //creamos el elemento que vamos a insertar
            const parrafoDescripcion = document.createElement("p");
            //insertamos la descripción en el p
            parrafoDescripcion.textContent = descripcionProducto;
            //insertar el parrafo en el div
            divDescripcion.appendChild(parrafoDescripcion);
            //cambiamos el texto del enlace
            elementoClicado.textContent = "Ocultar descripción";
        }
        else {
            elementoClicado.textContent = "Ver descripción";
            divDescripcion.innerHTML = "";
        }
    }
}

//función para buscar producto en la lista del carrito
//retorna el id encontrado, o -1 si no encontró
function buscarEnLista(id, lista) {
    //verificamos los datos recibidos
    console.log(id, lista);

    for (const producto of lista) {
        //si encontramos el id
        if (producto.id === id) {
            console.log("Encontrado", producto.id);
            return id;
        }
    }
    //si en el bucle no se encontró el id
    return -1;
}

//función para buscar un producto por su id
//retorna el producto encontrado
function buscarProductoPorId(id, lista) {
    //verificamos los datos recibidos
    console.log(id, lista);

    for (let i = 0; i < lista.length; i++) {
        //si encontramos el id retornamos el producto
        if (lista[i].id === id) {
            console.log(lista[i]);
            return lista[i];
        }
    }
}

//función para insertar producto en el html
function insertarProductoHTML(producto) {
    console.log(producto);
    //obtener el contenedor ul
    const listaCarrito = document.querySelector("#carrito .list-group");
    //verificamos
    console.log(listaCarrito);
    //crear el elemento li
    const liProducto = document.createElement("li");
    //agregar el contenido
    liProducto.textContent = `${producto.nombre} ${producto.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}`;
    //agregar las clases
    liProducto.className = "list-group-item";
    //insertar el elemento
    listaCarrito.appendChild(liProducto);
}

//función para actualizar el contador
function actualizarContador() {
    //obtener el contenedor del número
    const contenedorNumero = document.querySelector("#carrito .contador");
    //verificamos
    console.log(contenedorNumero);
    //usamos la cantidad de productos de la lista
    contenedorNumero.textContent = listaProductosCarrito.length;
}

//función para guardar datos en Local Storage
function guardarCarritoEnStorage(lista) {
    const carritoJSON = JSON.stringify(lista);
    localStorage.setItem("listaCarrito", carritoJSON);
    console.log("producto en Storage");
}

//función para agregar productos al carrito
function agregarAlCarrito(datosEvento) {
    //vemos los datos del evento
    console.log(datosEvento.target.tagName);

    //si el elemento clicado es un botón
    if (datosEvento.target.tagName === "BUTTON") {
        //verificamos el data-id del botón
        console.log(datosEvento.target.dataset);
        console.log(datosEvento.target.dataset.id);
        console.log(typeof (datosEvento.target.dataset.id));
        //guardamos el id como number
        const idProducto = parseInt(datosEvento.target.dataset.id);
        console.log(listaProductosCarrito);
        //buscamos el id en la lista del carrito y guardamos el resultado
        const idEncontrado = buscarEnLista(idProducto, listaProductosCarrito)
        console.log("encontrado:", idEncontrado);

        //si el id no está en la lista (-1) lo agregamos
        if (idEncontrado === -1) {
            //buscar el producto en la lista de productos por el idEncontrado
            //y lo guardamos
            const productoEncontrado = buscarProductoPorId(idProducto, productos);
            console.log(productoEncontrado);
            
            //agregar el productoEncontrado a la lista del carrito
            listaProductosCarrito.push(productoEncontrado)
            console.log("agregar lista carrito");
            console.log(listaProductosCarrito);

            //insertar el producto en el HTML
            insertarProductoHTML(productoEncontrado);

            //actualizar el contador de productos del carrito
            actualizarContador();

            //agregar producto al storage
            guardarCarritoEnStorage(listaProductosCarrito);
        }
    }
}

//función para cargar datos desde el Local Storage
function cargarCarritoDeStorage() {
    const carritoJSON = localStorage.getItem("listaCarrito");
    if (carritoJSON) {
        return JSON.parse(carritoJSON);
    }
    else {
        return [];
    }
}

//función para vaciar el carrito en la página
function vaciarCarrito() {
    const listaCarrito = document.querySelector("#carrito .list-group");
    listaCarrito.innerHTML = "<p>El carrito está vacío</p>";
}

//función para eliminar el carrito en Local Storage
function eliminarCarritoEnStorage() {
    localStorage.removeItem("listaCarrito");
    listaProductosCarrito = [];
    actualizarContador();
    vaciarCarrito();
}

//JSDoc
/**
 * Función asíncrona para obtener los productos del JSON
 * @returns {Promise<Array<Object>>} Una promesa que resuelve en el array de productos.
 */
async function cargarProductosApi() {
    console.log("Cargar productos");
    //Try: intentar. Se intenta ejecutar el código entre llaves
    try {
        //petición del archivo JSON a la URL de API
        const respuesta = await fetch("./productos.json");
        //const respuesta = await fetch("https://mocki.io/v1/43fb5b03-d1e0-4156-9859-43891d4db257");
        //verificamos la respuesta
        console.log(respuesta);

        //manejo de errores de HTTP (ej. 404 Not Found)
        if (!respuesta.ok) {
            //Throw: Lanzamiento. Se lanza un error, se corta la ejecución, 
            //se crea un objeto Error con los datos del error y se envía al bloque Catch
            throw new Error(`Error al obtener los datos: ${respuesta.status} - ${respuesta.statusText}`);
        }
        //si respuesta.ok es true
        // Conversión del JSON a Array
        const productosArray = await respuesta.json();
        console.log(productosArray);
        return productosArray;        
    } 
    //Catch: capturar. Captura el Error y si es necesario se ejecutan instrucciones
    catch (error) {
        //verificamos el error
        console.error("Fallo grave en la carga:", error);
        // Informar al usuario en la interfaz
        const listaUL = document.querySelector("#productos, .contenedorProductos");
        listaUL.innerHTML = '<li id="mensaje-error">❌ Error al cargar el catálogo.</li>';
        // Devolvemos un array vacío para evitar errores posteriores
        return []; 
    }
}

//función que inicia la carga de productos y luego ejecuta las instrucciones del programa
async function main() {
    console.log("Iniciando la carga de productos");
    //guardamos en productos la lista obtenida de la api
    productos = await cargarProductosApi();

    //instrucciones del programa que dependen de la carga
    //Insertar los productos en la página
    insertarProductos(productos);

    //seleccionar el contenedor de los productos
    const contenedorProductos = document.querySelector("#productos .row");
    //console.log(contenedorProductos);

    //agregar el listener al enlace Ver descripción
    contenedorProductos.addEventListener("click", mostrarDescripcion);

    //agregar el listener al botón Agregar al carrito
    contenedorProductos.addEventListener("click", agregarAlCarrito);

    //agregar el listener al botón Vaciar Carrito
    const botonVaciarCarrito = document.querySelector("#carrito .vaciarCarrito");
    botonVaciarCarrito.addEventListener("click", eliminarCarritoEnStorage)

    //cargar el carrito desde local storage
    listaProductosCarrito = cargarCarritoDeStorage();
    //console.log(listaProductosCarrito);

    //si el storage no está vacío
    if (listaProductosCarrito.length != 0) {
        //insertar los productos
        for (const producto of listaProductosCarrito) {
            insertarProductoHTML(producto);
        }
        //actualizar el contador
        actualizarContador();
    }
}

// Instrucciones de mi programa **************************************************************
main();

