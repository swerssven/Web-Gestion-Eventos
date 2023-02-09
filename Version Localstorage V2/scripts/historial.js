"use strict";

let divEventos = document.getElementById('div_eventos');
let select = document.getElementById('ordenar');

let cookie;

let eventos = new Array();

// Al cargar página cargamos eventos.
window.addEventListener('load', e => {
    cookie = getCookie("sesion");
    if(checkCookie("sesion")){
        if(localStorage.getItem(cookie)){
            eventos = JSON.parse(localStorage.getItem(cookie));
            ordenaEventos(eventos, 'nombre');
            muestraEventos(eventos, divEventos);
        }
        document.getElementById('nombre-usuario').innerText = cookie;
    } else {
        window.location = "index.html";
    }
});

// Link de cierre de sesión.
document.getElementById('cierre-sesion').addEventListener('click', e => {
    eliminarCookie("sesion");
    window.location = "index.html";
    divBienvenida.style.display = "none";
});

// Select para seleccionar modo de ordenación de los eventos.
select.addEventListener('change', e => {
    divEventos.innerHTML = null;

    ordenaEventos(eventos, select.options[select.selectedIndex].value);
    muestraEventos(eventos, divEventos);
    console.table(eventos);
});

// Función para mostrar eventos en un elemento HTML, recibe parametros; array eventos, elemento HTML.
function muestraEventos(eventos, elementoHTML){
    let fecha_ahora = new Date((new Date()).getFullYear() + "/" + ((new Date()).getMonth()+1) + "/" + (new Date()).getDate());
    eventos.forEach(element => {
        if (new Date(element.fecha) < fecha_ahora){
            let divEvento = document.createElement('div');
            divEvento.setAttribute('id', element.id);

            let img = document.createElement('img');
            img.src = element.imagen;

            let nombre = document.createElement('h3');
            nombre.innerText = element.nombre;

            let descripcion = document.createElement('p');
            descripcion.innerText = element.descripcion;

            let fecha_precio = document.createElement('div');
            fecha_precio.setAttribute('id', 'div-fecha-precio');

            let fecha = document.createElement('date');
            let fecha_evento = new Date(element.fecha);
            fecha.innerText = fecha_evento.getDate() + "/" + (fecha_evento.getMonth()+1) + "/" + fecha_evento.getFullYear();

            let precio = document.createElement('precio');
            precio.innerText = element.precio + "€";

            fecha_precio.append(fecha, precio);

            divEvento.append(img, nombre, descripcion, fecha_precio);

            elementoHTML.appendChild(divEvento);
        }
    }); 
}

// Función para ordenar array de eventos según método de ordenación.
function ordenaEventos(eventos, metodo_ordenacion) {
    switch(metodo_ordenacion){
        case 'nombre':
            eventos.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;

        case 'descripcion':
            eventos.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
            break;

        case 'fecha':
            eventos.sort((a, b) => a.fecha.localeCompare(b.fecha));
            break;

        case 'precio_asc':
            eventos.sort((a, b) => a.precio - b.precio);
            break;

        case 'precio_desc':
            eventos.sort((a, b) => b.precio - a.precio);
            break;

        default:
            alert("No existe este elemento.");
            break;
    }
}

// Función para limpiar los campos HTML.
function limpiarCampos(){
    id.value = null;
    nombre.value = null;
    fecha.value = null;
    descripcion.value = null;
    precio.value = null;
    imagen.value = null;
}