"use strict"

let usuario_login = document.getElementById('usuario-login');
let password_login = document.getElementById('password-login');

let usuario_registro = document.getElementById('usuario-registro');
let password_registro = document.getElementById('password-registro');

let errorSpans_login = document.querySelectorAll('.error_login');
let errorSpans_registro = document.querySelectorAll('.error_registro');

let cookie;
let cookieUltimaSesion;

let eventos = new Array();
let usuarios = new Array();
let mensajes = new Array();

window.addEventListener('load', e => {
    if(!checkCookie("sesion")){
        document.getElementById('registro').style.display = "none";
        document.getElementById('div-index').style.display = "none";
        document.getElementById('cierre-sesion').style.display = "none";
        if(localStorage.getItem("usuarios") != null){
            usuarios = JSON.parse(localStorage.getItem("usuarios"));
        }
    } else {
        cookie = getCookie("sesion");
        if(checkCookie('visto-mensajes-' + cookie)){
            cookieUltimaSesion = getCookie('visto-mensajes-' + cookie);
        }
        if(localStorage.getItem(cookie)){
            eventos = JSON.parse(localStorage.getItem(cookie));
        }
        if(localStorage.getItem("mensajes")){
            mensajes = JSON.parse(localStorage.getItem("mensajes"));
        }
        let divBienvenida = document.getElementById('bienvenido');
        divBienvenida.innerText = "Hola " + cookie + ", bienvenido!!!";
        let pNumEventos = document.getElementById('num-eventos');
        pNumEventos.innerText = "Tienes un total de " + eventos.length + " evento/s \nEvento/s futuro/s: " + numEventosFuturos(eventos) + " \nEvento/s pasado/s: " + numEventosPasados(eventos);
        let pNumMensajes = document.getElementById('num-mensajes');
        pNumMensajes.innerHTML = "Tienes un total de " + numMensajesNuevos(cookie, cookieUltimaSesion, mensajes) + " mensajes sin leer";
        document.getElementById('login').style.display = "none";
        document.getElementById('registro').style.display = "none";
        document.getElementById('cierre-sesion').style.display = "";
        document.getElementById('nombre-usuario').innerText = cookie;
    }
});

// Link de cierre de sesión.
document.getElementById('cierre-sesion').addEventListener('click', e => {
    eliminarCookie("sesion");
    window.location = "index.html";
    divBienvenida.style.display = "none";
});

// Comprobación de campo 'nombre usuario' de ventana login.
usuario_login.addEventListener('keyup', e => {
    if(!buscaUsuario(usuarios, usuario_login.value) && usuario_login.value != ""){
        muestraError(errorSpans_login, "error_nombre_login", usuario_login, false, "Usuario no existe");
    } else {
        muestraError(errorSpans_login, "error_nombre_login", usuario_login, true);
    }
});

// Comprobación de campo 'contrasena' de ventana login.
password_login.addEventListener('keyup', e => {
    if(!buscaUsuario(usuarios, usuario_login.value, password_login.value) && password_login.value != ""){
        muestraError(errorSpans_login, "error_password_login", password_login, false, "Contraseña incorrecta");
    } else {
        muestraError(errorSpans_login, "error_password_login", password_login, true);
    }
});

// Botón login usuario. (creación de cookie de sesion)
document.getElementById('btn_login').addEventListener('click', e => {
    if(usuario_login.value.trim() == ""){
        muestraError(errorSpans_login, "error_nombre_login", usuario_login, false, "Campo obligatorio");
    }
    if(password_login.value.trim() == ""){
        muestraError(errorSpans_login, "error_password_login", password_login, false, "Campo obligatorio");
    }
        
    if(compruebaErrores(errorSpans_login) && buscaUsuario(usuarios, usuario_login.value, password_login.value)){
        setCookie('sesion', usuario_login.value, 1);
        document.getElementById('login').style.display = "none";
        document.getElementById('registro').style.display = "none";
        document.getElementById('div-index').style.display = "";
        document.getElementById('cierre-sesion').style.display = "";
        window.location = "index.html";
    }else{
        muestraError(errorSpans_login, "error_password_login", password_login, false, "Contraseña incorrecta");
    }
});

// Botón que muestra la ventana de registro de usuario.
document.getElementById('btn_registrarse').addEventListener('click', e => {
    document.getElementById('login').style.display = "none";
    document.getElementById('registro').style.display = "";
});

// Comprobación de campo 'nombre usuario' de ventana registro.
usuario_registro.addEventListener('keyup', e => {
    if(buscaUsuario(usuarios, usuario_registro.value)){
        muestraError(errorSpans_registro, "error_nombre_registro", usuario_registro, false, "Usuario ya existe");
    } else {
        muestraError(errorSpans_registro, "error_nombre_registro", usuario_registro, true);
    }
});

// Comprobación de campo 'contrasena' de ventana registro.
password_registro.addEventListener('keyup', e => {
    if(password_registro.value != ""){
        muestraError(errorSpans_registro, "error_password_registro", password_registro, true);
    }
});

// Botón para registrar usuario nuevo.
document.getElementById('btn_registrar').addEventListener('click', e => {
    if(usuario_registro.value.trim() == ""){
        muestraError(errorSpans_registro, "error_nombre_registro", usuario_registro, false, "Campo obligatorio");
    }
    if(password_registro.value.trim() == ""){
        muestraError(errorSpans_registro, "error_password_registro", password_registro, false, "Campo obligatorio");
    }
    
    if(compruebaErrores(errorSpans_registro)){
        let usuario = new Object();
        usuario.nombre = usuario_registro.value;
        usuario.password = password_registro.value;
        usuarios.push(usuario);
        
        let jsonEventos = JSON.stringify(usuarios);
        localStorage.setItem("usuarios", jsonEventos);

        // Añadimos cookie para saber cuando se registro el usuario.
        setCookie('visto-mensajes-' + usuario.nombre, Date.now(), 365);

        limpiarCampos();
        document.getElementById('login').style.display = "";
        document.getElementById('registro').style.display = "none";
        alert("Usuario registrado correctamente");
    }
});

// Función para limpiar los campos HTML.
function limpiarCampos(){
    usuario_login.value = null;
    password_login.value = null;

    usuario_registro.value = null;
    password_registro.value = null;
}

// Función para pasar archivo a base64.
function cargarImagen(img) {
    let reader = new FileReader();
    reader.readAsDataURL(img);

    reader.addEventListener('load', e => {
        vistaImagenModificada.src = reader.result;
    });
}
