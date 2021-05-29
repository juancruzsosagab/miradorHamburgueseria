// Import de clases

import productoParaAgregar from "./classProducto.js";
import reciboCliente from "./classRecibo.js";



//////////////////////////

//Capturando clicks y agregando funciones a los eventos//

//////////////////////////



// Tomando Evento click de los botones Agregar 
const btnagregarClick = document.getElementsByClassName("btnComprar");

// Evento en el botón de Agregar
for (const button of btnagregarClick){
    button.addEventListener("click", agregarCarrito);
}


// Tomando Evento click del botón vaciar carrito 
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");

// Evento en el botón Vaciar carrito
btnVaciarCarrito.addEventListener("click", eliminarProductos);
  

// Tomando Evento click del botón realizar pedido
const btnRealizarPedido = document.getElementById("realizarPedido");

// Evento en el botón Realizar pedido
btnRealizarPedido.addEventListener("click", crearRecibo);




//////////////////////////

//Funciones carrito//

//////////////////////////



//Armado de carrito para tomar elementos y agregar al carrito

function agregarCarrito(e){
    const botonClickeado = e.target;
    const producto = botonClickeado.closest('.card');
    const productoNombre = producto.querySelector('.card-title').textContent;
    const productoPrecio = parseInt(producto.querySelector('.precio span').textContent);
    const cantidad = 1;
    let productoAgregar = new productoParaAgregar(productoNombre,productoPrecio,cantidad)
    
// For para chequear si el elmento ya está en el carrito
    let chequeoCarrito = tomarDeLocalStorage();
    for (let i = 0; i < chequeoCarrito.length; i++) {
        if(chequeoCarrito[i].nombreProducto===productoAgregar.nombreProducto){ 
            toastShow(mensajes[1]);
            return null;
        }
        
    }
    
    agregarProducto(productoAgregar);
    toastShow(mensajes[0]);
}


// Agregar producto al carrito y luego al local storage (función de local storage debajo)

function agregarProducto(productoAgregar){  
    const tbodyCarrito = document.getElementById("carrito");
    const cardCarrito = document.createElement("tr");
    cardCarrito.innerHTML = 
    `
    <tr >
    <th scope="row">Imagen</th>
    <td>${productoAgregar.nombreProducto}</td>
    <td>${productoAgregar.PrecioProducto}</td>
    <td>
    <input type="number" class="form-control" value=${productoAgregar.cantidad}>
    </td>
    <td>Sub Total</td>
    </tr>
    `;
    tbodyCarrito.appendChild(cardCarrito);
    agregarLocalStorage(productoAgregar);
    total();
    }


// Vaciar carrito

function eliminarProductos(e){
    e.preventDefault();
    const tbodyCarrito = document.getElementById("carrito");
    
    while(tbodyCarrito.firstChild){
        tbodyCarrito.removeChild(tbodyCarrito.firstChild)
    }

    localStorage.clear();
    total();
    return false;
}


// Set local storage

function agregarLocalStorage(productoAgregar){
    let carrito;
    carrito = tomarDeLocalStorage();
    carrito.push(productoAgregar)
    localStorage.setItem("carrito", JSON.stringify(carrito))
}


// Get local storage y mostrar items de carrito´

function tomarDeLocalStorage(){
    let productos;
    if(localStorage.getItem("carrito") === null){
        productos = []
    }else{
        productos =  JSON.parse(localStorage.getItem("carrito"));
    }
    return productos;
}   


//Función para calcular el total, está función la use también en las funciones agregarProducto,EliminarProductos,window.onload

function total(){
    var productos = tomarDeLocalStorage();
    let total = 0;
    document.getElementById("total").innerHTML = "$ " + total;

    for (const element of productos){
        let producto = element.PrecioProducto * element.cantidad
        total = total + producto;

        document.getElementById("total").innerHTML = "$" + total;
 
   }
}


// Refrescando sitio y usando localStorage

window.onload = function() {
    let productos;
    productos = tomarDeLocalStorage()
    for (const productoAgregar of productos){
    const tbodyCarrito = document.getElementById("carrito");
    const cardCarrito = document.createElement("tr");
    cardCarrito.innerHTML = 
    `
    <tr>
    <th scope="row">Imagen</th>
    <td>${productoAgregar.nombreProducto}</td>
    <td>${productoAgregar.PrecioProducto}</td>
    <td>
    <input type="number" class="form-control" value=${productoAgregar.cantidad}>
    </td>
    <td>Sub Total</td>
    </tr>
    `;
    tbodyCarrito.appendChild(cardCarrito); 
    total();   
    }
  };


//////////////////////////

//Creando pedido/recibo del cliente. Utilizo la clase "classRecibo"//

//////////////////////////



function crearRecibo(e){
    e.preventDefault();

    //Tomando el total desde el formulario
    let totalAPagar = document.getElementById("total").textContent;
    totalAPagar = totalAPagar.replace("$","");
    
    
    //Tomando datos del form
    const nombre = document.getElementById("cliente").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("correo").value;
    
    //Creando objeto en la clase recibo

    const recibo = new reciboCliente (nombre,telefono, email, totalAPagar);
    
    // Display none del carrito, así solo aparece el pedido
    let carritoForm = document.querySelector('.carrito-form');
    console.log(carritoForm)
    carritoForm.classList.add('displaynone');

    //loader
    let loader = document.querySelector('#loader');
    loader.classList.remove('displaynone');

    setTimeout(function(){ 
    loader.classList.add('displaynone');    
    //Función que crea el recibo/pedido
    const pedido = recibo.obtenerRecibo();

    // Agrego el recibo al sitio
    let divCompra = document.getElementById("div-compra"); 
    divCompra.appendChild(pedido);
    
    }, 5000);
}

// Descargar comprobante

/*function download() {

    var node = document.getElementById('para-descargar');
    node.style.fontFamily = "Rubik";
    
    domtoimage.toPng(node)
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            downloadURI(dataUrl, "records.png")
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
    
    }
    
function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link = null;
    }
    */

    
// Toast function
function toastShow(mensajes){
    $(".toast").remove();
    $("body").prepend(`
    <div class="position-fixed top-50 end-0 translate-middle-y p-3" style="z-index: 5">
    <div id="liveToast" class="toast hide " role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header ${mensajes.claseBackground} ${mensajes.claseFont}">
        <img src="./img/logo-naranja.png" class="rounded me-2" alt="..." width="40" height="auto">
        <strong class="me-auto"> ${mensajes.titulo}</strong>
        <small>ahora</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
    ${mensajes.mensaje}    
    
    </div>
    </div>`

)
$('.toast').toast('show');
}


// Mensajes para el toast

const mensajes = [{ 
    claseBackground: "bg-success",claseFont:"text-white fw-bold",titulo: "Agregada", mensaje: "Hamburguesa agregada al carrito" },
{  claseBackground: "bg-danger",claseFont:"fw-bold", titulo: "opppss", mensaje: "Esta hamburguesa ya había sido agregada al carrito" }
];
      





