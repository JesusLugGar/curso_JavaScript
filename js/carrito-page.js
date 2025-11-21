let LS_KEY = "carrito";// lo mismo localStorage
let carrito = [];

// ---------- Utils ----------
function cargarCarrito() {
  const t = localStorage.getItem(LS_KEY);
  if (!t) { carrito = []; return; }
  try { carrito = JSON.parse(t) || []; }
  catch { carrito = []; }
}

function guardarCarrito() {
  localStorage.setItem(LS_KEY, JSON.stringify(carrito));
}

function formatear(n) {
  return (n || 0).toLocaleString("es-CL");
}

function totalItems() {
  return carrito.reduce((acc, it) => acc + (it.cantidad || 0), 0);
}
function totalGeneral() {
  return carrito.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
}

// Actualiza badge del header,icono
function actualizarBadgeHeader() {
  const badge = document.getElementById("cartCount");
  if (badge) {
    badge.textContent = totalItems();
  }
}

// ---------- Render ----------
function render() {
  const cont = document.getElementById("listaCarrito");
  const totalEl = document.getElementById("totalGeneral");
  const itemsTop = document.getElementById("summaryItems");
  const itemsRight = document.getElementById("summaryItemsRight");
  const subtotalRight = document.getElementById("summarySubtotal");

  cont.innerHTML = "";

  if (carrito.length === 0) {
    cont.innerHTML = `<div class="alert alert-light border">No hay productos en el carrito.</div>`;
    if (totalEl) totalEl.textContent = "$0";
    if (itemsTop) itemsTop.textContent = "0";
    if (itemsRight) itemsRight.textContent = "0";
    if (subtotalRight) subtotalRight.textContent = "$0";
    actualizarBadgeHeader();
    return;
  }

  let total = 0;
  let itemsCount = 0;

  carrito.forEach((item, idx) => {
    const sub = item.precio * item.cantidad;
    total += sub;
    itemsCount += item.cantidad;

    const card = document.createElement("div");
    card.className = "card mb-3";
    card.innerHTML = `
      <div class="card-body d-flex gap-3 align-items-center">
        <img src="${item.img || '../assets/img/no-image.png'}" alt="${item.nombre}" class="item-thumb">
        <div class="flex-grow-1">
          <div class="fw-semibold">${item.nombre}</div>
          <div class="item-subtle">Talla: ${item.talla || "-"}</div>
          <div class="item-subtle">Precio: $${formatear(item.precio)}</div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-secondary btn-sm qty-menos" data-i="${idx}" aria-label="Restar">−</button>
          <span class="fw-semibold" style="min-width:24px; text-align:center">${item.cantidad}</span>
          <button class="btn btn-outline-secondary btn-sm qty-mas" data-i="${idx}" aria-label="Sumar">+</button>
        </div>

        <div class="text-end" style="width:120px">
          <div class="item-subtle">Subtotal</div>
          <div class="fw-semibold">$${formatear(sub)}</div>
          <button class="btn btn-link text-danger p-0 small quitar-item" data-i="${idx}">Quitar</button>
        </div>
      </div>
    `;
    cont.appendChild(card);
  });

  if (totalEl) totalEl.textContent = `$${formatear(total)}`;
  if (itemsTop) itemsTop.textContent = String(itemsCount);
  if (itemsRight) itemsRight.textContent = String(itemsCount);
  if (subtotalRight) subtotalRight.textContent = `$${formatear(total)}`;

  actualizarBadgeHeader();
}

// ---------- Eventos ----------//
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  render();

 
  const cont = document.getElementById("listaCarrito");
  cont.addEventListener("click", (e) => {
    const mas = e.target.closest(".qty-mas");
    const menos = e.target.closest(".qty-menos");
    const quitar = e.target.closest(".quitar-item");

    if (mas) {
      const i = Number(mas.dataset.i);
      if (carrito[i]) {
        carrito[i].cantidad += 1;
        guardarCarrito(); render();
      }
    } else if (menos) {
      const i = Number(menos.dataset.i);
      if (carrito[i]) {
        carrito[i].cantidad -= 1;
        if (carrito[i].cantidad <= 0) carrito.splice(i, 1);
        guardarCarrito(); render();
      }
    } else if (quitar) {
      const i = Number(quitar.dataset.i);
      if (carrito[i]) {
        carrito.splice(i, 1);
        guardarCarrito(); render();
      }
    }
  });

  // Vaciar
  const btnVaciar = document.getElementById("btnVaciar");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      carrito = [];
      guardarCarrito();
      render();
    });
  }
});


// Botón Finalizar compra
const btnCheckout = document.getElementById("btnCheckout");
if (btnCheckout) {
  btnCheckout.addEventListener("click", () => {
    const items = totalItems();
    const total = totalGeneral();

    if (items === 0) {
      Swal.fire({
        icon: "info",
        title: "Carrito vacío",
        text: "Agrega productos antes de finalizar.",
        timer: 1800,
        showConfirmButton: false
      });
      return;
    }

    Swal.fire({
      icon: "question",
      title: "¿Confirmar compra?",
      html: `
        <div style="text-align:left">
          <p>Productos: <b>${items}</b></p>
          <p>Total: <b>$${formatear(total)}</b></p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Pagar",
      cancelButtonText: "Seguir comprando"
    }).then(res => {
      if (res.isConfirmed) {

        //aca simulo un pago con la alerta sweet
        carrito = [];
        guardarCarrito();
        render();
        Swal.fire({
          icon: "success",
          title: "¡Compra realizada!",
          text: "Gracias por tu compra.",
          timer: 1800,
          showConfirmButton: false
        });
      }
    });
  });
}

