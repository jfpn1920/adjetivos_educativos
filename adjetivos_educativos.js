// ===== DATOS DEL EJERCICIO =====
// Cada pregunta tiene una frase, tres opciones y la respuesta correcta (el adjetivo)
const preguntas = [
    { frase: "El gato ___ duerme en el sofá.", opciones: ["negro", "correr", "lentamente"], correcta: "negro" },
    { frase: "Mi mamá prepara una sopa ___.", opciones: ["cocinar", "deliciosa", "mañana"], correcta: "deliciosa" },
    { frase: "Los niños juegan en el parque ___.", opciones: ["grande", "saltan", "ayer"], correcta: "grande" },
    { frase: "La maestra lee un libro ___.", opciones: ["interesante", "leer", "siempre"], correcta: "interesante" },
    { frase: "Hoy hace un día ___.", opciones: ["soleado", "caminar", "pronto"], correcta: "soleado" },
    { frase: "Mi hermano tiene una bicicleta ___.", opciones: ["pedalear", "nueva", "aquí"], correcta: "nueva" },
    { frase: "El elefante es un animal muy ___.", opciones: ["corre", "tarde", "pesado"], correcta: "pesado" },
    { frase: "Compré una manzana ___ en el mercado.", opciones: ["roja", "comer", "después"], correcta: "roja" }
];
// ===== ESTADO DEL JUEGO =====
// Clave con la que se guarda todo en localStorage
const CLAVE = "adjetivosEducativos";
// Objeto con los datos que no queremos perder al refrescar
const nuevoEstado = (nombre = "") => ({ nombre, indice: 0, puntaje: 0, elegida: null });
let estado = nuevoEstado();
// ===== REFERENCIAS A ELEMENTOS DEL HTML =====
const $ = (id) => document.getElementById(id);
const pantallas = { inicio: $("pantalla-inicio"), juego: $("pantalla-juego"), final: $("pantalla-final") };
// ===== LOCALSTORAGE =====
// Guarda el estado actual como texto JSON
function guardar() { localStorage.setItem(CLAVE, JSON.stringify(estado)); }
// Lee el estado guardado (si existe) al abrir o refrescar la página
function cargar() { const g = localStorage.getItem(CLAVE); if (g) estado = JSON.parse(g); }
// Muestra solo la pantalla indicada y oculta las demás
function mostrar(nombre) {
    for (const clave in pantallas) pantallas[clave].classList.toggle("oculto", clave !== nombre);
}
// Valida el nombre, lo guarda y comienza el ejercicio
function comenzar() {
    const nombre = $("campo-nombre").value.trim();
    $("error-nombre").classList.toggle("oculto", nombre !== "");
    if (nombre === "") return;
    estado = nuevoEstado(nombre);
    guardar();
    pintarPregunta();
}
// Dibuja la pregunta actual con sus opciones
function pintarPregunta() {
    // Si ya no hay más preguntas, se muestra el resultado
    if (estado.indice >= preguntas.length) return pintarFinal();
    mostrar("juego");
    const p = preguntas[estado.indice]; // pregunta actual
    $("saludo").textContent = "Hola, " + estado.nombre;
    $("progreso").textContent = (estado.indice + 1) + " de " + preguntas.length;
    $("puntaje").textContent = "Puntos: " + estado.puntaje;
    $("progreso-barra").style.width = (estado.indice / preguntas.length) * 100 + "%";
    $("frase").textContent = p.frase; $("opciones").innerHTML = "";
    // Crea un botón por cada opción
    p.opciones.forEach((texto) => {
        const boton = document.createElement("button");
        boton.className = "opcion"; boton.textContent = texto;
        boton.addEventListener("click", () => elegir(texto));
        $("opciones").appendChild(boton);
    });
    // Si ya estaba respondida (tras refrescar) se muestra el resultado
    if (estado.elegida !== null) revisar(); else limpiarRespuesta();
}
// Oculta mensaje y botón "Siguiente" mientras no se responda
function limpiarRespuesta() { $("mensaje").textContent = ""; $("btn-siguiente").classList.add("oculto"); }
// Guarda la opción elegida y la califica
function elegir(texto) {
    estado.elegida = texto;
    if (texto === preguntas[estado.indice].correcta) estado.puntaje++;
    guardar(); revisar();
}
// Pinta en verde la correcta, en rojo la equivocada y bloquea los botones
function revisar() {
    const correcta = preguntas[estado.indice].correcta;
    document.querySelectorAll(".opcion").forEach((boton) => {
        boton.disabled = true;
        if (boton.textContent === correcta) boton.classList.add("correcta");
        else if (boton.textContent === estado.elegida) boton.classList.add("incorrecta");
    });
    $("puntaje").textContent = "Puntos: " + estado.puntaje;
    $("mensaje").textContent = estado.elegida === correcta ? "¡Muy bien! Es un adjetivo." : "Casi. El adjetivo era: " + correcta;
    $("btn-siguiente").classList.remove("oculto");
}
// Avanza a la siguiente pregunta
function siguiente() { estado.indice++; estado.elegida = null; guardar(); pintarPregunta(); }
// ===== FINAL =====
// Muestra el puntaje total con un comentario según el resultado
function pintarFinal() {
    mostrar("final");
    $("titulo-final").textContent = "¡Terminaste, " + estado.nombre + "!";
    $("resultado").textContent = estado.puntaje + " / " + preguntas.length;
    $("comentario").textContent = estado.puntaje >= preguntas.length * 0.7 ? "¡Excelente! Ya reconoces los adjetivos." : "Sigue practicando, ¡tú puedes!";
}
// Borra los datos guardados y vuelve a la pantalla inicial
function reiniciar() {
    localStorage.removeItem(CLAVE);
    estado = nuevoEstado();
    $("campo-nombre").value = "";
    mostrar("inicio");
}
// ===== EVENTOS =====
$("btn-comenzar").addEventListener("click", comenzar);
$("btn-siguiente").addEventListener("click", siguiente);
// Ambos botones borran el progreso y regresan al inicio
["btn-reiniciar", "btn-salir"].forEach((id) => $(id).addEventListener("click", reiniciar));
// Permite iniciar con la tecla Enter en el campo de nombre
$("campo-nombre").addEventListener("keydown", (e) => e.key === "Enter" && comenzar());
// ===== ARRANQUE =====
// Al cargar la página se recupera lo guardado y se muestra la pantalla correcta
cargar();
if (estado.nombre) pintarPregunta(); else mostrar("inicio");