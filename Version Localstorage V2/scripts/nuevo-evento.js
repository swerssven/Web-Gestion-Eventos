"use strict";

let id = document.getElementById('id');
let nombre = document.getElementById('nombre');
let fecha = document.getElementById('fecha');
let descripcion = document.getElementById('descripcion');
let precio = document.getElementById('precio');
let imagen = document.getElementById('imagen');
let vistaImagen = document.getElementById("vistaImagen");
let errorSpans = document.querySelectorAll('.error');
let enviar = document.getElementById('enviar');

let cookie; 

let eventos = new Array();

const expresiones = {
    id: /^([A-Z][a-z]{5}[0-9]{4}[+\-*/])$/m, //(1 letra mayúscula – 5 letras minúsculas – 4 dígitos – 1 carácter especial (+ - * /).
    nombre: /^[A-Za-z0-9\s-_/]+$/m, //Mayusculas, minusculas, digitos y carácteres especiales (-_/).
    precio: /^[\d]+(\.|,)?([\d]{0,2})?$/m, //Número con 2 decimales máximo.
    imagen: /.(gif|jpeg|jpg|png)$/i //Accepta solo extensiones gif, jpeg. jpg y png.
}

// Comprobamos si hay datos en localstorage, si los hay los cargamos.
window.addEventListener('load', e => {
    cookie = getCookie("sesion");
    if(checkCookie("sesion")){
        if(localStorage.getItem(cookie) != null){
            eventos = JSON.parse(localStorage.getItem(cookie));
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

// Comprobación del campo ID.
id.addEventListener('keyup', e => {

    if (id.value.trim() != "" && !expresiones.id.test(id.value.trim())) {
        muestraError(errorSpans, "error_id", id, false, "Debe de tener el siguiente formato (1 mayúscula – 5 minúsculas – 4 dígitos – 1 carácter especial (+ - * /)");
    } else if (eventos.find(e => e.id === id.value.trim())){
        muestraError(errorSpans, "error_id", id, false, "Este id ya existe, intente con otro distinto.");
    } else {
        muestraError(errorSpans, "error_id", id, true);
    }
});

// Comprobación del campo nombre.
nombre.addEventListener('keyup', e => {
    if (nombre.value.trim() != "" && !expresiones.nombre.test(nombre.value.trim())) {
        muestraError(errorSpans, "error_nombre", nombre, false, "Solo puede contener letras, espacios y dígitos.");
    } else {
        muestraError(errorSpans, "error_nombre", nombre, true);
    }
});

// Comprobación del campo fecha.
fecha.addEventListener('change', e => {
    if (!compruebaFecha(fecha.value)) {
        muestraError(errorSpans, "error_fecha", fecha, false, "Tiene que introducir una fecha futura");
    } else {
        muestraError(errorSpans, "error_fecha", fecha, true);
    }
});

descripcion.addEventListener('keyup', e => {
    if (descripcion.value != "") {
        muestraError(errorSpans, "error_descripcion", descripcion, true);
    }
});

// Comprobación del campo precio.
precio.addEventListener('keyup', e => {
    if (precio.value != "" && isNaN((precio.value).replace(',', '.'))) {
        muestraError(errorSpans, "error_precio", precio, false, "Solo se puede introducir dígitos.");
    } else if (precio.value != "" && !expresiones.precio.test(precio.value)) {
        muestraError(errorSpans, "error_precio", precio, false, "Formato incorrecto, el precio solo puede tener 2 decimales.");
    } else {
        muestraError(errorSpans, "error_precio", precio, true);
    }
});

// Comprobación del campo imagen.
imagen.addEventListener("change", e => {
    if (imagen.value != "" && !expresiones.imagen.test(imagen.value)) {
        muestraError(errorSpans, "error_imagen", imagen, false, "Solo se acceptan imágenes con extension gif/jpeg/jpg/png");
        vistaImagen.src = "";
    } else if (imagen.value == ""){
        vistaImagen.src = "";
    } else {
        muestraError(errorSpans, "error_imagen", imagen, true);
        let file = imagen.files[0];
        cargarImagen(file);
    }
});

// Evento del boton de creación de evento.
enviar.addEventListener('click', e => {
    if(id.value.trim() == ""){
        muestraError(errorSpans, "error_id", id, false, "Campo obligatorio");
    }
    if(nombre.value.trim() == ""){
        muestraError(errorSpans, "error_nombre", nombre, false, "Campo obligatorio");
    }
    if(fecha.value.trim() == ""){
        muestraError(errorSpans, "error_fecha", fecha, false, "Campo obligatorio");
    }
    if(descripcion.value.trim() == ""){
        muestraError(errorSpans, "error_descripcion", descripcion, false, "Campo obligatorio");
    }
    if(precio.value.trim() == ""){
        muestraError(errorSpans, "error_precio", precio, false, "Campo obligatorio");
    }
    if(imagen.value.trim() == ""){
        muestraError(errorSpans, "error_imagen", imagen, false, "Campo obligatorio");
        vistaImagen.src = "";
    }

    // Comprobamos si existe algún mensaje de error.
    let correct = true;
    errorSpans.forEach(element => {
        if(element.innerText != ""){
            correct = false;
        }
    });
    
    // Si no hay mensajes de error, guardamos datos en localstorage.
    if(correct){
        let evento = new Object();

        evento.id = id.value;
        evento.nombre = nombre.value;
        evento.fecha = new Date(fecha.value);
        evento.descripcion = descripcion.value;
        evento.precio = parseInt(precio.value);
        evento.imagen = vistaImagen.src;

        eventos.push(evento);
        let jsonEventos = JSON.stringify(eventos);
        localStorage.setItem(cookie, jsonEventos);
        limpiarCampos();
        alert("Evento Guardado");
    }
});

// Función para pasar archivo a base64.
function cargarImagen(img) {
    let reader = new FileReader();
    reader.readAsDataURL(img);

    reader.addEventListener('load', e => {
        vistaImagen.src = reader.result;
    });
}

// Función para limpiar los campos HTML.
function limpiarCampos(){
    id.value = null;
    nombre.value = null;
    fecha.value = null;
    descripcion.value = null;
    precio.value = null;
    imagen.value = null;
    vistaImagen.src = null;
}
