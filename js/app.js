// Import de clases

import productoParaAgregar from "./classProducto.js";
import reciboCliente from "./classRecibo.js";


//////////////////////////
// Selectores //

//////////////////////////

// Tomando clases para agregar producto
const btnagregarClick = document.getElementsByClassName("btnComprar");

// Tomando id click del botón vaciar carrito 
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");

// Tomando id del botón realizar pedido
const btnRealizarPedido = document.getElementById("realizarPedido");

// Tomando id para luego borrar producto del botón realizar pedido
const btnBorrarProducto = document.getElementById("div-compra");

// Tomando id del carrito
const tbodyCarrito = document.getElementById("carrito");


//Declaración de variables globales//

let transaccion;


//////////////////////////

//Listeners//

//////////////////////////

// Eventos en el botón de Agregar
for (const button of btnagregarClick){
    button.addEventListener("click", agregarCarrito);
}

// Evento en el botón Vaciar carrito
btnVaciarCarrito.addEventListener("click", eliminarProductos);
 
// Evento en el botón Realizar pedido
btnRealizarPedido.addEventListener("click", crearRecibo);

// Eventos para borrar producto del carro

btnBorrarProducto.addEventListener("click",borrarProducto);


//////////////////////////

//Funciones carrito//

//////////////////////////


//Armado de carrito para tomar elementos y agregar al carrito

function agregarCarrito(e){
    const botonClickeado = e.target;
    const producto = botonClickeado.closest('.card');
    const productoNombre = producto.querySelector('.card-title').textContent;
    const productoPrecio = parseInt(producto.querySelector('.precio span').textContent);
    const productoId = producto.querySelector('button').getAttribute('data-id');
    const cantidad = 1;/*parseInt(producto.querySelector('.cantidad').value);*/
    let productoAgregar = new productoParaAgregar(productoNombre,productoPrecio,productoId,cantidad)
    
    
// Find para chequear si la hamburguesa está en el carrito y agregar una hamburguesa más al clickear
    const carritoParaCheck = tomarDeLocalStorage();
    const chequeoCarrito = carritoParaCheck.find(carritoParaCheck=>carritoParaCheck.nombreProducto === productoAgregar.nombreProducto);
    if(chequeoCarrito){
        const nuevoCarrito = carritoParaCheck.map(producto=>{
            if (productoId === producto.ProductoId){
                producto.cantidad++;
            }
            return producto;
            })
        
        actualizarStorage(nuevoCarrito);
        renderCarrito();
        toastShow(mensajes[1]);
        return null;
    }
    agregarProducto(productoAgregar);
    toastShow(mensajes[0]);
}


// Agregar producto al carrito y luego al local storage (función de local storage debajo)

function agregarProducto(productoAgregar){  
    $("#carrito").append(
        `
        <tr>
        <th scope="row"><a href="#" class="borrarProducto" data-id="${productoAgregar.ProductoId}">Quitar</a></th>
        <td>${productoAgregar.nombreProducto}</td>
        <td>${productoAgregar.PrecioProducto}</td>
        <td>
        ${productoAgregar.cantidad}
        </td>
        <td>$ ${productoAgregar.PrecioProducto*productoAgregar.cantidad}</td>
        </tr>
        `
    );

    agregarLocalStorage(productoAgregar);
    total();
    }


//Render carrito

function renderCarrito(){
    let productos;
    tbodyCarrito.innerHTML = '';
    productos = tomarDeLocalStorage()
    productos.map (productoAgregar=>
        $("#carrito").append(
            `
            <tr>
            <th scope="row"><a href="#" class="borrarProducto" data-id="${productoAgregar.ProductoId}">Quitar</a></th>
            <td>${productoAgregar.nombreProducto}</td>
            <td>${productoAgregar.PrecioProducto}</td>
            <td>
            ${productoAgregar.cantidad}
            </td>
            <td>$ ${productoAgregar.PrecioProducto*productoAgregar.cantidad}</td>
            </tr>
            `         ));
    total()       
  };


//Función para calcular el total, está función la use también en las funciones agregarProducto,EliminarProductos,render carrito

function total(){
    const productos = tomarDeLocalStorage();
    let total = 0;

    document.getElementById("total").innerHTML = "$ " + total;

    for (const element of productos){
        let producto = element.PrecioProducto * element.cantidad
        total = total + producto;

        document.getElementById("total").innerHTML = "$" + total;
 
   }
}  


// Función para eliminar un producto

function borrarProducto(e){
    e.preventDefault();
    let carrito = [];
    if (e.target.classList.contains("borrarProducto")){
        const productoABorrar = e.target.parentElement.parentElement;
        const productoId = e.target.getAttribute('data-id');
        productoABorrar.remove()

        let carritoStorage = tomarDeLocalStorage();
        carrito = carritoStorage.filter(producto => producto.ProductoId !== productoId);
        actualizarStorage(carrito)
    }
}


// función para eliminar todos los productos del carrito

function eliminarProductos(e){
    e.preventDefault();
       
    while(tbodyCarrito.firstChild){
        tbodyCarrito.removeChild(tbodyCarrito.firstChild)
    }

    localStorage.clear();
    total();
    return false;
}



//////////////////////////

//Funciones para interactuar con local storage//

//////////////////////////


//Actualizar local storage

function actualizarStorage(carrito) {
    localStorage.clear();
	localStorage.setItem('carrito', JSON.stringify(carrito));
}


// Agregar local storage

function agregarLocalStorage(productoAgregar){
    let carrito;
    carrito = tomarDeLocalStorage();
    carrito.push(productoAgregar)
    localStorage.setItem("carrito", JSON.stringify(carrito))
}


//  Tomar productos de local storage

function tomarDeLocalStorage(){
    let productos;
    if(localStorage.getItem("carrito") === null){
        productos = []
    }else{
        productos =  JSON.parse(localStorage.getItem("carrito"));
    }
    return productos;
}   


//////////////////////////

//Creando pedido/recibo del cliente. Utilizo la clase "classRecibo"//

//////////////////////////


function crearRecibo(e){
    e.preventDefault();

    //Tomando datos del form
    const nombre = document.getElementById("cliente").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("correo").value;

  
    //Tomando nombres de hamburguesas compradas
    const hamburguesas = tomarDeLocalStorage()
    const hamburguesasParaNombre = hamburguesas.map(hamburguesas=>{return hamburguesas.nombreProducto})
    const nombreHamburguesas = hamburguesasParaNombre.join(", ")

    //Tomando el total desde el formulario
    const totalAPagar = document.getElementById("total").textContent.replace("$","");;
      

    // hide del carrito, y aparece el loader
     $(".carrito-form").fadeOut("slow",function(){
        $("#loader").fadeIn()
     });
     ;
 
    // llamado a ajax
    llamadoAjax();

    setTimeout(function(){ 

    //Creando objeto en la clase recibo

    const recibo = new reciboCliente (nombre,telefono, email, totalAPagar, nombreHamburguesas,transaccion);
            
    $("#loader").hide()    
    //Función que crea el recibo/pedido
    const pedido = recibo.obtenerRecibo();
   
    // Agrego el recibo al sitio
    $("#div-compra").append(pedido);

    //Confirmación de envío recibo
    $("#btnDownload").click((e) =>{
        e.preventDefault();
        toastShow(mensajes[2])
        });

    $("#btnBuyAgain").click((e) =>{
        e.preventDefault();
        $(".recibo").fadeOut();
        $(".carrito-form").fadeIn();
        eliminarProductos(e);
        renderCarrito();
        });        
       
     }, 5000);
}


//////////////////////////

//Toasts//

//////////////////////////


// Toast function utilizada en todo el documento
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

// Mensajes y clases para los toast

const mensajes = [{ 
    claseBackground: "bg-success",claseFont:"text-white fw-bold",titulo: "Agregada", mensaje: "Hamburguesa agregada al carrito" },
    {claseBackground: "bg-success",claseFont:"text-white fw-bold", titulo: "Otra más!", mensaje: "Agregaste una hamburguesa más al carrito"},
    {claseBackground: "bg-success",claseFont:"text-white fw-bold", titulo: "Email enviado", mensaje: "Enviamos el comprobante a tu email"}
];
      

//////////////////////////

//Funciones que se ejecutan al actualizar el sitio//

//////////////////////////


$(document).ready(renderCarrito());


//////////////////////////

//Llamado a ajax//

//////////////////////////


function llamadoAjax() {
    $.ajax({
	url: "js/txt.txt",
 	method: "GET",
 	dataType: "text",
	success: function (result, status, jqXHR) {
        transaccion = result
    },
    error: function (jqXHR, status, error) {
        transaccion = "Error"    
	}
}) 


};




//Animaciones
/*$(".card").animate({margin: "+=50px"},5000)
          .animate({margin: "-=50px"},5000);

$(".logo-hamb").animate({height: "+=20px"},1000, function(){
   $(".logo-hamb").delay(5000)
                .animate({height:"-=20px"},5000)   
})*/

