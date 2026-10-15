//----------------------------------------//
//--|funcionalidad_adjetivos_educativos|--//
//----------------------------------------//
const preguntas = [
    {
        frase: "El gato ___ duerme en el sofá.",
        opciones: ["negro", "correr", "lentamente"],
        correcta: "negro"
    },
    {
        frase: "Mi mamá prepara una sopa ___.",
        opciones: ["cocinar", "deliciosa", "mañana"],
        correcta: "deliciosa"
    },
    {
        frase: "Los niños juegan en el parque ___.",
        opciones: ["grande", "saltan", "ayer"],
        correcta: "grande"
    },
    {
        frase: "La maestra lee un libro ___.",
        opciones: ["interesante", "leer", "siempre"],
        correcta: "interesante"
    },
    {
        frase: "Hoy hace un día ___.",
        opciones: ["soleado", "caminar", "pronto"],
        correcta: "soleado"
    },
    {
        frase: "Mi hermano tiene una bicicleta ___.",
        opciones: ["pedalear", "nueva", "aquí"],
        correcta: "nueva"
    },
    {
        frase: "El elefante es un animal muy ___.",
        opciones: ["corre", "tarde", "pesado"],
        correcta: "pesado"
    },
    {
        frase: "Compré una manzana ___ en el mercado.",
        opciones: ["roja", "comer", "después"],
        correcta: "roja"
    }
];
const CLAVE = "adjetivosEducativos";
const nuevoEstado = (nombre = "") => ({ nombre, indice: 0, puntaje: 0, elegida: null });
let estado = nuevoEstado();
const $ = (id) => document.getElementById(id);
const pantallas = {
    inicio: $("pantalla-inicio"),
    juego: $("pantalla-juego"),
    final: $("pantalla-final")
};
//--------------------------//
//--|almacenamiento_local|--//
//--------------------------//
function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
function cargar() {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado) {
        estado = JSON.parse(guardado);
    }
}
//---------------------//
//--|funciones_juego|--//
//---------------------//
function mostrar(nombre) {
    for (const clave in pantallas) {
        pantallas[clave].classList.toggle("oculto", clave !== nombre);
    }
}
function comenzar() {
    const nombre = $("campo-nombre").value.trim();
    $("error-nombre").classList.toggle("oculto", nombre !== "");
    if (nombre === "") {
        return;
    }
    estado = nuevoEstado(nombre);
    guardar();
    pintarPregunta();
}
function pintarPregunta() {
    if (estado.indice >= preguntas.length) {
        pintarFinal();
        return;
    }
    mostrar("juego");
    const p = preguntas[estado.indice];
    $("saludo").textContent = "Hola, " + estado.nombre;
    $("progreso").textContent = (estado.indice + 1) + " de " + preguntas.length;
    $("puntaje").textContent = "Puntos: " + estado.puntaje;
    $("progreso-barra").style.width = (estado.indice / preguntas.length) * 100 + "%";
    $("frase").textContent = p.frase;
    $("opciones").innerHTML = "";
    p.opciones.forEach((texto) => {
        const boton = document.createElement("button");
        boton.className = "opcion";
        boton.textContent = texto;
        boton.addEventListener("click", () => elegir(texto));
        $("opciones").appendChild(boton);
    });
    if (estado.elegida !== null) {
        revisar();
    } else {
        limpiarRespuesta();
    }
}
function limpiarRespuesta() {
    $("mensaje").textContent = "";
    $("btn-siguiente").classList.add("oculto");
}
function elegir(texto) {
    estado.elegida = texto;
    if (texto === preguntas[estado.indice].correcta) {
        estado.puntaje++;
    }
    guardar();
    revisar();
}
function revisar() {
    const correcta = preguntas[estado.indice].correcta;
    document.querySelectorAll(".opcion").forEach((boton) => {
        boton.disabled = true;
        if (boton.textContent === correcta) {
            boton.classList.add("correcta");
        } else if (boton.textContent === estado.elegida) {
            boton.classList.add("incorrecta");
        }
    });
    $("puntaje").textContent = "Puntos: " + estado.puntaje;
    $("mensaje").textContent = estado.elegida === correcta ? "¡Muy bien! Es un adjetivo." : "Casi. El adjetivo era: " + correcta;
    $("btn-siguiente").classList.remove("oculto");
}
function siguiente() {
    estado.indice++;
    estado.elegida = null;
    guardar();
    pintarPregunta();
}
//---------------------//
//--|funciones_final|--//
//---------------------//
function pintarFinal() {
    mostrar("final");
    $("titulo-final").textContent = "¡Terminaste, " + estado.nombre + "!";
    $("resultado").textContent = estado.puntaje + " / " + preguntas.length;
    $("comentario").textContent = estado.puntaje >= preguntas.length * 0.7 ? "¡Excelente! Ya reconoces los adjetivos." : "Sigue practicando, ¡tú puedes!";
}
function reiniciar() {
    localStorage.removeItem(CLAVE);
    estado = nuevoEstado();
    $("campo-nombre").value = "";
    mostrar("inicio");
}
//-------------//
//--|eventos|--//
//-------------//
$("btn-comenzar").addEventListener("click", comenzar);
$("btn-siguiente").addEventListener("click", siguiente);
$("btn-reiniciar").addEventListener("click", reiniciar);
$("btn-salir").addEventListener("click", reiniciar);
$("campo-nombre").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        comenzar();
    }
});
//--------------//
//--|arranque|--//
//--------------//
cargar();
if (estado.nombre) {
    pintarPregunta();
} else {
    mostrar("inicio");
}