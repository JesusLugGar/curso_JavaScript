let LS_KEY = "carrito";

// DATOS 
const productos = [
  { id: 1, nombre: "Casco Dark",   precio: 105990 },
  { id: 2, nombre: "Casco Integral", precio: 110990 },
  { id: 3, nombre: "Casco Color Claro", precio: 89990 },
  { id: 4, nombre: "Casco para Adventure", precio: 140990 },
  { id: 5, nombre: "Casco Street", precio: 89990 },
  { id: 6, nombre: "Chaqueta Andes", precio: 99990 },
  { id: 7, nombre: "Chaqueta Street Dark", precio: 119990 },
  { id: 8, nombre: "Chaqueta doble Invierno/Verano", precio: 120990 },
  { id: 9, nombre: "Chaqueta Fox verde", precio: 145990  },
  { id: 10, nombre: "Chaqueta con Protectores", precio: 150990 }
];


let carrito = [];


function cargarCarrito() {
  let texto = localStorage.getItem(LS_KEY);
  if (texto) {
    try { carrito = JSON.parse(texto); }
    catch (e) { carrito = []; }
  } else {
    carrito = [];
  }
}

function guardarCarrito() {
  localStorage.setItem(LS_KEY, JSON.stringify(carrito));
}

function buscarProductoPorId(id) {
  id = Number(id);
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id === id) return productos[i];
  }
  return null;
}

function agregarAlCarrito(id) {
  let p = buscarProductoPorId(id);
  if (!p) return;

  
  let encontrado = false;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === p.id) {
      carrito[i].cantidad += 1;
      encontrado = true;
      break;
    }
  }
  if (!encontrado) {
    carrito.push({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      cantidad: 1
    });
  }

  guardarCarrito();
  actualizarResumenIndex();
}

function totalItems() {
  let sum = 0;
  for (let i = 0; i < carrito.length; i++) {
    sum += carrito[i].cantidad;
  }
  return sum;
}

function totalGeneral() {
  let t = 0;
  for (let i = 0; i < carrito.length; i++) {
    t += carrito[i].precio * carrito[i].cantidad;
  }
  return t;
}

function formatear(n) {
 
  return (n || 0).toLocaleString("es-CL");
}

function actualizarResumenIndex() {
  let cantEl = document.getElementById("resumenCantidad");
  let totEl  = document.getElementById("resumenTotal");
  if (cantEl) cantEl.textContent = totalItems();
  if (totEl)  totEl.textContent  = formatear(totalGeneral());
}

document.addEventListener("DOMContentLoaded", function () {
  cargarCarrito();
  actualizarResumenIndex();

  
  document.addEventListener("click", function (e) {
    let btn = e.target.closest(".add-to-cart");
    if (!btn) return;
    let id = btn.getAttribute("data-id");
    agregarAlCarrito(id);

    
    btn.textContent = "Agregado";
    setTimeout(function () { btn.textContent = "Agregar al carro"; }, 600);
  });
});
