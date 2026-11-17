const formulario = document.getElementById('formulario');
const inputTexto = document.getElementById('texto');
const lista = document.getElementById('lista');
const contador = document.getElementById('contador');
const fecha = document.getElementById('fecha');
const btnOrdenar = document.getElementById('btn-ordenar');
const btnLimpiar = document.getElementById('btn-limpiar');

const colores = ['#fff176', '#ff8a80', '#80d8ff', '#b9f6ca', '#ffd180', '#ea80fc'];

let tareas = [];

function guardar() {
    try {
        localStorage.setItem('mis-tareas', JSON.stringify(tareas));
    } catch (e) {
    }
}

function cargar() {
    try {
        const guardado = localStorage.getItem('mis-tareas');
        if (guardado) tareas = JSON.parse(guardado);
    } catch (e) {
        tareas = [];
    }
}

function ponerFecha() {
    const hoy = new Date();
    let texto = hoy.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
    texto = texto.charAt(0).toUpperCase() + texto.slice(1);
    fecha.textContent = 'Hoy es ' + texto;
}

function dibujar() {
    lista.innerHTML = '';

    tareas.forEach((tarea, i) => {
        const nota = document.createElement('div');
        nota.className = 'nota' + (tarea.hecha ? ' hecha' : '');
        nota.style.backgroundColor = tarea.color;
        nota.style.setProperty('--giro', tarea.giro + 'deg');

        const texto = document.createElement('span');
        texto.textContent = tarea.texto;
        nota.appendChild(texto);

        nota.addEventListener('click', () => {
            tarea.hecha = !tarea.hecha;
            guardar();
            dibujar();
        });

        const x = document.createElement('button');
        x.className = 'borrar';
        x.textContent = '✖';
        x.addEventListener('click', (e) => {
            e.stopPropagation();
            tareas.splice(i, 1);
            guardar();
            dibujar();
        });
        nota.appendChild(x);

        lista.appendChild(nota);
    });

    actualizarContador();
}

function actualizarContador() {
    const faltan = tareas.filter(t => !t.hecha).length;

    if (tareas.length === 0) {
        contador.textContent = 'No hay nada pegado todavía 😴';
    } else if (faltan === 0) {
        contador.textContent = '¡terminaste todo! 🥳';
    } else if (faltan === 1) {
        contador.textContent = 'solo te falta 1 tarea 💪';
    } else {
        contador.textContent = 'te faltan ' + faltan + ' tareas 😅';
    }
}

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const texto = inputTexto.value.trim();
    if (texto === '') return;

    tareas.unshift({
        texto: texto,
        hecha: false,
        color: colores[Math.floor(Math.random() * colores.length)],
        giro: Math.floor(Math.random() * 7) - 3
    });

    inputTexto.value = '';
    guardar();
    dibujar();
});

btnOrdenar.addEventListener('click', () => {
    const pendientes = tareas.filter(t => !t.hecha);
    const hechas = tareas.filter(t => t.hecha);
    tareas = pendientes.concat(hechas);
    guardar();
    dibujar();
});

btnLimpiar.addEventListener('click', () => {
    tareas = tareas.filter(t => !t.hecha);
    guardar();
    dibujar();
});

cargar();
ponerFecha();
dibujar();
