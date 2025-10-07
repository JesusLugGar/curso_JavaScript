// ===== Datos =====
const productos = [
  { id: 1, nombre: "Retrovisor Moto", precio: 30.990 },
  { id: 2, nombre: "Tubo de Escape", precio: 400.00 },
  { id: 3, nombre: "Pantalla TFT", precio: 500.000 },
  { id: 4, nombre: "Cadena de Cambio", precio: 150.000 },
];

let carrito = []; 

// ===== Funciones 
function listar() {
  console.clear();
  console.log("=== CATÁLOGO ===");
  productos.forEach(p => console.log(`ID ${p.id} | ${p.nombre} - $${p.precio}`));
  console.log("===============");
}

function agregar() {
  const id = Number(prompt("ID a agregar:"));
  const cant = Number(prompt("Cantidad:"));
  const p = productos.find(x => x.id === id);
  if (!p || !cant) { console.log("Datos inválidos."); return; }

  const item = carrito.find(x => x.id === id);
  item ? (item.cantidad += cant) : carrito.push({ ...p, cantidad: cant }); /// el signo ?? esta en la misma clase de videos cortos lo usa para abreviar el IF
  console.log(`+ ${p.nombre} x${cant}`);
}

function ver() {
  console.log("=== CARRITO ===");
  if (carrito.length === 0) return console.log("Vacío");
  let total = 0;
  carrito.forEach(i => {
    const s = i.precio * i.cantidad;
    total += s;
    console.log(`- ${i.nombre} x ${i.cantidad} = $${s.toFixed(2)}`);
  });
  console.log(`TOTAL: $${total.toFixed(2)}`);
  console.log("===============");
}

function simulador() {
  listar();
  let op;
  while ((op = prompt("1=Listar, 2=Agregar, 3=Ver, 0=Salir")) !== null && op !== "0") {
    if (op === "1") listar();
    else if (op === "2") agregar();
    else if (op === "3") ver();
    else console.log("Opción inválida");
  }
  console.log("Fin del simulador.");
}
///// Esta parte lo saque de la IA ya que no sabia como asociar un boton X que cree para probar
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnIniciar");
  if (btn) btn.addEventListener("click", simulador);
});

