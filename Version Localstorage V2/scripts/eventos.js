"use strict";

let divEventos = document.getElementById('div_eventos');
let select = document.getElementById('ordenar');
let id = document.getElementById('id');
let nombre = document.getElementById('nombre');
let fecha = document.getElementById('fecha');
let descripcion = document.getElementById('descripcion');
let precio = document.getElementById('precio');
let imagen = document.getElementById('imagen');
let vistaImagenModificada = document.getElementById("vistaImagenModificada");
let errorSpans = document.querySelectorAll('.error');
let enviar = document.getElementById('enviar');

let selectUsuarios = document.getElementById('select-usuarios');

let idEvento;
let cookie;

let eventos = new Array();
let mensajes = new Array();
let usuarios = new Array();

const expresiones = {
    nombre: /^[A-Za-z0-9\s-_/]+$/m, //Mayusculas, minusculas, digitos y carácteres especiales (-_/).
    precio: /^[\d]+(\.|,)?([\d]{0,2})?$/m, //Número con 2 decimales máximo.
    imagen: /.(gif|jpeg|jpg|png)$/i //Accepta solo extensiones gif, jpeg. jpg y png.
}

// Al cargar página cargamos eventos.
window.addEventListener('load', e => {
    cookie = getCookie("sesion");
    if(checkCookie("sesion")){
        if(localStorage.getItem(cookie)){
            eventos = JSON.parse(localStorage.getItem(cookie));
            ordenaEventos(eventos, 'nombre');
            muestraEventos(eventos, divEventos);
        }
        if(localStorage.getItem("mensajes")){
            mensajes = JSON.parse(localStorage.getItem("mensajes"));
        }
        if(localStorage.getItem("usuarios")){
            usuarios = JSON.parse(localStorage.getItem("usuarios"));
            usuarios.forEach(element => {
                if(element.nombre != cookie){
                let option = document.createElement('option');
                option.innerText = element.nombre;
                option.setAttribute('value', element.nombre);
                selectUsuarios.append(option);
                selectUsuarios.value = selectUsuarios[0].value;
                }
            });
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
        if (new Date(element.fecha) >= fecha_ahora){
            let divEvento = document.createElement('div');

            let img_mod = document.createElement('img');
            img_mod.setAttribute('alt', 'Imagen');
            img_mod.src = element.imagen;

            let nombre_mod = document.createElement('h3');
            nombre_mod.innerText = element.nombre;

            let descripcion_mod = document.createElement('p');
            descripcion_mod.innerText = element.descripcion;

            let fecha_precio_mod = document.createElement('div');
            fecha_precio_mod.setAttribute('id', 'div-fecha-precio');

            let fecha_mod = document.createElement('date');
            let fecha_evento = new Date(element.fecha);
            fecha_mod.innerText = fecha_evento.getDate() + "/" + (fecha_evento.getMonth()+1) + "/" + fecha_evento.getFullYear();

            let precio_mod = document.createElement('precio');
            precio_mod.innerText = element.precio + "€";

            fecha_precio_mod.append(fecha_mod, precio_mod);

            var btn_borrar = document.createElement('button');
            btn_borrar.innerText = "Eliminar";
            btn_borrar.setAttribute('id', element.id);
            btn_borrar.setAttribute('type', 'button');
            btn_borrar.setAttribute('class', 'btn btn-primary pdf');
            
            var btn_modificar = document.createElement('button');
            btn_modificar.innerText = "Modificar";
            btn_modificar.setAttribute('id', element.id);
            btn_modificar.setAttribute('type', 'button');
            btn_modificar.setAttribute('class', 'btn btn-primary pdf');

            var btn_invitar = document.createElement('button');
            btn_invitar.innerText = "Invitar a ...";
            btn_invitar.setAttribute('id', element.id);
            btn_invitar.setAttribute('type', 'button');
            btn_invitar.setAttribute('class', 'btn btn-primary pdf');

            // EventListeners de botones borrar y modificar de cada evento.
            eventoBorrar(btn_borrar);
            eventoModificar(btn_modificar);
            eventoInvitar(btn_invitar);
            if(element.tipo != null){
                divEvento.append(img_mod, nombre_mod, descripcion_mod, fecha_precio_mod, btn_borrar, btn_invitar);
            } else {
                divEvento.append(img_mod, nombre_mod, descripcion_mod, fecha_precio_mod, btn_borrar, btn_modificar, btn_invitar);
            }
            elementoHTML.appendChild(divEvento);
        }
    }); 
}

// Función para crear eventListener boton 'eliminar' evento.
function eventoBorrar(boton){

    boton.addEventListener('click', e => {
        
                
        document.getElementById('ventana-eliminar').showModal();
        document.getElementById('ok').addEventListener('click', e => {
            eventos.forEach(element => {
                if(element.id == boton.getAttribute('id')){
                    delete eventos[eventos.indexOf(element)];
                    var filtered = eventos.filter(function (el) {
                        return el != null; // Eliminamos los valores null del array.
                    });
                    eventos = filtered;
                    let jsonEventos = JSON.stringify(eventos);
                    localStorage.setItem(cookie, jsonEventos);
                    divEventos.innerHTML = null;
                    muestraEventos(eventos, divEventos);
                }
            });
            document.getElementById('ventana-eliminar').close();
        });
        
        document.getElementById('cancel').addEventListener('click', e => {
            document.getElementById('ventana-eliminar').close();
        })
    });
}

// Función para crear eventListener boton 'modificar' evento.
function eventoModificar(boton){
    errorSpans.forEach(element => {
        element.innerText = null;
    });
    boton.addEventListener('click', e => {
        e.stopPropagation();
        limpiarCampos();
        document.getElementById('ventana-modificar').showModal();
        idEvento = boton.getAttribute('id');
        // Rellenamos campos formulario modificación.
        id.setAttribute('disabled','');
        eventos.forEach(element => {
            if(element.id == idEvento){
                id.value = element.id;
                nombre.value = element.nombre;
                var fecha_evento = new Date(element.fecha);
                var aux = fecha_evento.getFullYear()+ "-" + (fecha_evento.getMonth()+1) + "-";
                if(parseInt(fecha_evento.getDate()) < 10){
                    aux += "0" + fecha_evento.getDate();
                }else{
                    aux += fecha_evento.getDate();
                }
                fecha.value = aux;
                precio.value = element.precio;
                descripcion.value = element.descripcion;
                vistaImagenModificada.src = element.imagen;
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
                vistaImagenModificada.src = "";
            } else if (imagen.value == ""){
                vistaImagenModificada.src = "";
            } else {
                muestraError(errorSpans, "error_imagen", imagen, true);
                let file = imagen.files[0];
                cargarImagen(file);
            }
        });

        // Evento del boton para modificar evento.
        document.getElementById('enviar').addEventListener('click', e => {
            
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
            if(imagen.value.trim() == "" && vistaImagenModificada.src == ""){
                muestraError(errorSpans, "error_imagen", imagen, false, "Campo obligatorio");
                vistaImagenModificada.src = "";
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
                eventos.forEach(element => {
                    if(element.id == idEvento){
                        element.nombre = nombre.value;
                        element.fecha = new Date(fecha.value);
                        element.descripcion = descripcion.value;
                        element.precio = parseInt(precio.value);
                        element.imagen = vistaImagenModificada.src;
                    }
                });
                limpiarCampos();
                let jsonEventos = JSON.stringify(eventos);
                localStorage.setItem(cookie, jsonEventos);
                alert("Evento Modificado");
                
                divEventos.innerHTML = null;
                ordenaEventos(eventos, 'nombre');
                muestraEventos(eventos, divEventos);
                document.getElementById('ventana-modificar').close();
            }
        });

        // Evento del boton cancelar del form de modificación de eventos.
        document.getElementById('cancelar').addEventListener('click', e => {
            
            document.getElementById('ventana-modificar').close();
        });
    });
}

// Función evento del boton invitar usuarios.
function eventoInvitar(boton){
    boton.addEventListener('click', e => {
        e.stopPropagation();
        document.getElementById('ventana-invitar').showModal();
        idEvento = boton.getAttribute('id');
    
        // Evento del boton invitar del form de invitación de eventos.
        document.getElementById('invitar').addEventListener('click', e => {
            e.stopPropagation();
            let objMensaje = new Object;
            objMensaje.id = Math.random();
            objMensaje.tipo = 'invitacion';
            objMensaje.destinatario = selectUsuarios.options[selectUsuarios.selectedIndex].value;
            objMensaje.origen = cookie;
            objMensaje.fecha = Date.now();

            eventos.forEach(element => {
                if(element.id == idEvento){
                    objMensaje.evento = element;
                    objMensaje.mensaje = cookie + " le ha invitado al evento: " + element.nombre;
                }
            });

            // Comprobamos si ya hay un mensaje con este id.
            if(mensajes.length != 0){
                let correct = false;
                do {
                    mensajes.forEach(element => {
                        if(element.id == objMensaje.id){
                            objMensaje.id = Math.random();
                        } else {
                            correct = true;
                        }
                    });
                } while (!correct);
            }

            mensajes.splice(0, 0, objMensaje);
            let jsonMensajes = JSON.stringify(mensajes);
            localStorage.setItem("mensajes", jsonMensajes);

            document.getElementById('ventana-invitar').close();
            alert("Invitación enviada correctamente");
            return false;
        });

        document.getElementById('volver').addEventListener('click', e => {
            e.stopPropagation();
            document.getElementById('ventana-invitar').close();
        });
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
    document.getElementById('vistaImagenModificada').src = null;
    
    id.style.boxShadow = "";
    nombre.style.boxShadow = "";
    fecha.style.boxShadow = "";
    descripcion.style.boxShadow = "";
    precio.style.boxShadow = "";
    imagen.style.boxShadow = "";
    document.getElementById('vistaImagenModificada').style.boxShadow = "";
    errorSpans.forEach(element => {
        element.innerText = "";
    });
}

// Función para pasar archivo a base64.
function cargarImagen(img) {
    let reader = new FileReader();
    reader.readAsDataURL(img);

    reader.addEventListener('load', e => {
        document.getElementById('vistaImagenModificada').src = reader.result;
    });
}