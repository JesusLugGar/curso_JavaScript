
let LS_KEY = "carrito"; //Local Storage

// Datos base
const productos = [
  { id: 1, nombre: "Casco Dark", size: ["M","L","XL"], precio: 105990, img: "../assets/img/casco1.png" },
  { id: 2, nombre: "Casco Integral", size: ["M","L","XL"], precio: 110990, img: "../assets/img/casco2.png" },
  { id: 3, nombre: "Casco Color Claro", size: ["M","L","XL"], precio: 89990, img: "../assets/img/casco3.png" },
  { id: 4, nombre: "Casco para Adventure", size: ["M","L","XL"], precio: 140990, img: "../assets/img/casco4.png" },
  { id: 5, nombre: "Casco Street", size: ["M","L","XL"], precio: 89990, img: "../assets/img/casco5.png" },
  { id: 6, nombre: "Chaqueta Andes", size: ["M","L","XL"], precio: 99990, img: "../assets/img/chaqueta1.png" },
  { id: 7, nombre: "Chaqueta Street Dark", size: ["M","L","XL"], precio: 119990, img: "../assets/img/chaqueta2.png" },
  { id: 8, nombre: "Chaqueta doble Invierno/Verano", size: ["M","L","XL"], precio: 120990, img: "../assets/img/chaqueta3.png" },
  { id: 9, nombre: "Chaqueta Fox verde", size: ["M","L","XL"], precio: 145990, img: "../assets/img/chaqueta4.png" },
  { id: 10, nombre: "Chaqueta con Protectores", size: ["M","L","XL"], precio: 150990, img: "../assets/img/chaqueta5.png" }
];

let carrito = [];

// ---------- LocalStorage ----------
function cargarCarrito() {
  const texto = localStorage.getItem(LS_KEY);
  if (!texto) { carrito = []; return; }
  try { carrito = JSON.parse(texto) || []; }
  catch { carrito = []; }
}
function guardarCarrito() {
  localStorage.setItem(LS_KEY, JSON.stringify(carrito));
}


function buscarProductoPorId(id) {
  id = Number(id);
  return productos.find(p => p.id === id) || null;
}
function totalItems() {
  return carrito.reduce((acc, i) => acc + (i.cantidad || 0), 0);
}
function totalGeneral() {
  return carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
}
function formatear(n) {
  return (n || 0).toLocaleString("es-CL");
}


function actualizarResumenIndex() {
  const cantEl = document.getElementById("resumenCantidad");
  const totEl  = document.getElementById("resumenTotal");
  const badge  = document.getElementById("cartCount");

  const cant = totalItems();
  const tot  = formatear(totalGeneral());

  if (cantEl) cantEl.textContent = cant;
  if (totEl)  totEl.textContent  = tot;

  if (badge) {
    badge.textContent = cant;
    badge.setAttribute("aria-label", `Cart items: ${cant}`);
    if (cant > 0) { 
      badge.classList.remove("bump");
      void badge.offsetWidth; 
      badge.classList.add("bump");
    }
  }
}

// ---------- Modal: elegir talla + cantidad ----------
let modalProductoId = null;
let modalImageUrl = null;

function abrirModalOpciones(productId) {
  modalProductoId = Number(productId);
  const p = buscarProductoPorId(modalProductoId);
  if (!p) return;

  modalImageUrl = p.img || null;

  const sel = document.getElementById("modalSize");
  sel.innerHTML = "";
  p.size.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    sel.appendChild(opt);
  });

  const qty = document.getElementById("modalQty");
  qty.value = 1;

  const modal = new bootstrap.Modal(document.getElementById("sizeQtyModal"));
  modal.show();
}

function agregarAlCarritoConOpciones(id, talla, cantidad) {
  const p = buscarProductoPorId(id);
  if (!p) return;

  const cant = Math.max(1, Number(cantidad) || 1);

  // buscar por id + talla
  const item = carrito.find(i => i.id === p.id && i.talla === talla);
  if (item) {
    item.cantidad += cant;
  } else {
    carrito.push({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      talla: talla,
      cantidad: cant,
      img: p.img
    });
  }

  guardarCarrito();
  actualizarResumenIndex();
}

// ---------- Listeners ----------
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  actualizarResumenIndex();

  // Click en "Agregar al carro" -> abre modal
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    abrirModalOpciones(id);
  });

  // Botón "Agregar" dentro del modal
  const modalAddBtn = document.getElementById("modalAddBtn");
  if (modalAddBtn) {
    modalAddBtn.addEventListener("click", () => {
      const talla = document.getElementById("modalSize").value;
      const qty   = document.getElementById("modalQty").value;
      const p     = buscarProductoPorId(modalProductoId);
      const cant  = Math.max(1, Number(qty) || 1);

      agregarAlCarritoConOpciones(modalProductoId, talla, cant);

      // Referencia al modal
      const modalEl = document.getElementById("sizeQtyModal");
      const modal   = bootstrap.Modal.getInstance(modalEl);

      // Evitar warning de accesibilidad: quita foco y espera cierre
      if (document.activeElement) document.activeElement.blur();

      modalEl.addEventListener("hidden.bs.modal", () => {
        // SweetAlert2 (confirmación)
        Swal.fire({
          title: "Agregado!",
          text: `${cant} × ${p?.nombre || "Producto"} (talla ${talla})`,
          imageUrl: p?.img || modalImageUrl || undefined,
          imageWidth: 120,
          imageHeight: 120,
          imageAlt: p?.nombre || "Imagen",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      }, { once: true });

      // Cerrar modal
      modal.hide();
    });
  }
});