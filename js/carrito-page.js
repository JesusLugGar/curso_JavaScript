let LS_KEY = "carrito";//localStore Key
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

function formatear(n) {
  return (n || 0).toLocaleString("es-CL");
}

function render() {
  let cont = document.getElementById("listaCarrito");
  let totalEl = document.getElementById("totalGeneral");

  cont.innerHTML = "";

  if (carrito.length === 0) {
    cont.innerHTML = "<p>No hay productos en el carrito.</p>";
    totalEl.textContent = "0";
    return;
  }

  let total = 0;

  for (let i = 0; i < carrito.length; i++) {
    let item = carrito[i];
    let sub = item.precio * item.cantidad;
    total += sub;

    let p = document.createElement("p");
    p.textContent = item.cantidad + " x " + item.nombre + " — $" + formatear(sub);
    cont.appendChild(p);
  }

  totalEl.textContent = formatear(total);
}

document.addEventListener("DOMContentLoaded", function () {
  cargarCarrito();
  render();

  document.getElementById("btnVaciar").addEventListener("click", function () {
    carrito = [];
    localStorage.setItem(LS_KEY, JSON.stringify(carrito));
    render();
  });
});
