"use strict";
let selectUsuarios = document.getElementById('select-usuarios');
let textMensaje = document.getElementById('mensaje');
let errorMensaje = document.getElementById('error_mensaje');

let cookie;
let cookieUltimaSesion;

let eventos = new Array();
let mensajes = new Array();
let usuarios = new Array();

// Al cargar página cargamos eventos.
window.addEventListener('load', e => {
    cookie = getCookie("sesion");//document.cookie.valueOf("sesion").replace("sesion=", "");
    if(checkCookie("sesion")){
        if(checkCookie('visto-mensajes-' + cookie)){
            cookieUltimaSesion = getCookie('visto-mensajes-' + cookie);
        }
        if(localStorage.getItem(cookie)){
            eventos = JSON.parse(localStorage.getItem(cookie));
        }
        if(localStorage.getItem("mensajes")){
            mensajes = JSON.parse(localStorage.getItem("mensajes"));
            muestramensajes(mensajes, document.getElementById('mensajes-enviados'), "enviado");
            muestramensajes(mensajes, document.getElementById('mensajes-entrantes'), "recibido");
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
        // Creamos otra cookie para guardar la fecha a la cual se han visto los mensajes por ultima vez.
        setCookie('visto-mensajes-' + cookie, Date.now(), 365);

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

// Evento para borrar errores del textarea.
textMensaje.addEventListener('keyup', e => {
    errorMensaje.innerText = "";
    textMensaje.style.boxShadow = "";
});

// Evento para enviar mensaje a destinatorio seleccionado.
document.getElementById('enviar').addEventListener('click', e => {
    if(textMensaje.value != ""){
        let objMensaje = new Object;
        objMensaje.id = Math.random();
        objMensaje.destinatario = selectUsuarios.options[selectUsuarios.selectedIndex].value;
        objMensaje.origen = cookie;
        objMensaje.fecha = Date.now();
        objMensaje.mensaje = textMensaje.value;

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
        muestramensajes(mensajes, document.getElementById('mensajes-enviados'), "enviado");

        let jsonMensajes = JSON.stringify(mensajes);
        localStorage.setItem("mensajes", jsonMensajes);
        
        document.getElementById('mensaje').value = "";
    } else {
        errorMensaje.innerText = "Introduzca un mensaje";
        textMensaje.style.boxShadow = "red 0px 0px 5px 2px";
    }
});

// Evento botón descarga mensajes enviados.
document.getElementById('dl-enviados').addEventListener('click', e => {
    let strMensajes = "Mensajes Enviados de " + cookie + "\n";
    let cont = 1;
    mensajes.forEach(element => {
        if(element.origen == cookie){
            strMensajes += "\nMensaje " + cont + "\n" + 
                        "\nId: " + element.id +
                        "\nDestinatario: " + element.destinatario + 
                        "\nOrigen: " + element.origen +
                        "\nFecha: " + (new Date(element.fecha)).toLocaleString('es-ES') + 
                        "\nMensaje: " + element.mensaje + 
                        "\n\n";
            cont++;
        }
    });
    if(strMensajes != "Mensajes Enviados de " + cookie + "\n"){
        download("Mensajes_Enviados_"+cookie+".txt", strMensajes);
    }else{
        alert("No hay mensajes Enviados de " + cookie);
    }
});

// Evento botón descarga mensajes recibidos.
document.getElementById('dl-recibidos').addEventListener('click', e => {
    let strMensajes = "Mensajes Recibidos de " + cookie + "\n";
    let cont = 1;
    mensajes.forEach(element => {
        if(element.destinatario == cookie){
            strMensajes += "\nMensaje " + cont + "\n" + 
                        "\nId: " + element.id +
                        "\nDestinatario: " + element.destinatario + 
                        "\nOrigen: " + element.origen +
                        "\nFecha: " + (new Date(element.fecha)).toLocaleString('es-ES') + 
                        "\nMensaje: " + element.mensaje + 
                        "\n\n";
            cont++;
        }
    });
    if(strMensajes != "Mensajes Recibidos de " + cookie + "\n"){
        download("Mensajes_Recibidos_"+cookie+".txt", strMensajes);
    }else{
        alert("No hay mensajes Recibidos de " + cookie);
    }
});

// Evento botón descarga de todos los mensajes.
document.getElementById('dl-todos').addEventListener('click', e => {
    let strMensajes = "Todos los mensajes de " + cookie + "\n";
    let cont = 1;
    mensajes.forEach(element => {
        if(element.origen == cookie || element.destinatario == cookie){
            strMensajes += "\nMensaje " + cont + "\n" + 
                        "\nId: " + element.id +
                        "\nDestinatario: " + element.destinatario + 
                        "\nOrigen: " + element.origen +
                        "\nFecha: " + (new Date(element.fecha)).toLocaleString('es-ES') + 
                        "\nMensaje: " + element.mensaje + 
                        "\n\n";
            cont++;
        }
    });
    if(strMensajes != "Todos los mensajes de " + cookie + "\n"){
        download("Mensajes_"+cookie+".txt", strMensajes);
    }else{
        alert("No hay mensajes de " + cookie);
    }
});

// Función de descarga de archivos txt.
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

// Función para mostrar mensajes en un elemento HTML, recibe parametros; array mensajes, elemento HTML.
function muestramensajes(mensajes, elementoHTML, isEnviadoOrRecibido){
    let fecha_ahora = new Date((new Date()).getFullYear() + "/" + ((new Date()).getMonth()+1) + "/" + (new Date()).getDate());
    
    elementoHTML.innerHTML = null;
    mensajes.forEach(element => {
            let divMensaje = document.createElement('div');
            divMensaje.setAttribute('id','div-mensaje');

            let div = document.createElement('div');
            div.setAttribute('id', 'destin-fecha');
            div.setAttribute('style', 'width: 50px');

            let origen = document.createElement('h4');
            origen.innerText = element.origen;

            let destinatario = document.createElement('h4');
            destinatario.innerText = element.destinatario;

            let fecha = document.createElement('date');
            let fecha_mensaje = (new Date(element.fecha)).toLocaleString('es-ES');
            fecha.innerText = fecha_mensaje;

            let mensaje = document.createElement('p');
            mensaje.innerText = element.mensaje;

            var btn_borrar = document.createElement('button');
            btn_borrar.innerText = "Eliminar";
            btn_borrar.setAttribute('id', element.id);
            btn_borrar.setAttribute('type', 'button');
            btn_borrar.setAttribute('class', 'btn btn-primary botton-mensaje');
            btn_borrar.setAttribute('style', 'width: 100px');

            // EventListeners de botones borrar de cada mensaje.
            mensajeBorrar(btn_borrar);


            switch (isEnviadoOrRecibido) {
                case "enviado":
                    div.append(destinatario, fecha);
                    divMensaje.append(div, mensaje, btn_borrar);
                    if(element.origen == cookie && element.tipo == null){
                        if(parseInt(cookieUltimaSesion) < parseInt(element.fecha)){
                            divMensaje.style.backgroundColor = "#89cf89"; // Si mensaje es nuevo lo pintamos de verde y actualizamos cookie de ultima sesion.
                            setCookie('visto-mensajes-' + cookie, Date.now(), 365);
                        }
                        elementoHTML.appendChild(divMensaje);
                    }
                    break;
                case "recibido":
                    div.append(origen, fecha);
                    if(element.tipo == 'invitacion'){
                        var btn_aceptar = document.createElement('button');
                        btn_aceptar.innerText = "Aceptar";
                        btn_aceptar.setAttribute('id', element.id);
                        btn_aceptar.setAttribute('type', 'button');
                        btn_aceptar.setAttribute('class', 'btn btn-primary botton-mensaje');
                        btn_aceptar.setAttribute('style', 'width: 100px');

                        // EventListener de boton aceptar invitacion.
                        aceptarInvitacion(btn_aceptar);

                        var div_botones = document.createElement('div');
                        div_botones.setAttribute('class', 'div_botones_invitacion');
                        div_botones.append(btn_aceptar, btn_borrar);
                        divMensaje.append(div, mensaje, div_botones);
                    }else{
                        divMensaje.append(div, mensaje, btn_borrar);
                    }
                    if(element.destinatario == cookie){
                        if(parseInt(cookieUltimaSesion) < parseInt(element.fecha)){
                            divMensaje.style.backgroundColor = "#89cf89"; // Si mensaje es nuevo lo pintamos de verde y actualizamos cookie de ultima sesion.
                            setCookie('visto-mensajes-' + cookie, Date.now(), 365);
                        }
                        elementoHTML.appendChild(divMensaje);
                    }
                    break;
            
                default:
                    break;
            }
    }); 
}

// Función para aceptar invitacion de evento de otro usuario.
function aceptarInvitacion(boton){
    boton.addEventListener('click', e => {
        e.stopPropagation();

        mensajes.forEach(element => {
            if(element.id == boton.getAttribute('id')){
                element.evento.nombre += " *Invitado por " + element.origen;
                element.evento.tipo = 'invitacion';
                element.evento.id += Date.now();
                eventos.push(element.evento);

                element.tipo = "aceptado";

                let jsonEventos = JSON.stringify(eventos);
                localStorage.setItem(cookie, jsonEventos);

                let jsonMensajes = JSON.stringify(mensajes);
                localStorage.setItem("mensajes", jsonMensajes);

                alert("Invitación aceptada y evento añadido correctamente!");

                muestramensajes(mensajes, document.getElementById('mensajes-enviados'), "enviado");
                muestramensajes(mensajes, document.getElementById('mensajes-entrantes'), "recibido");
            }
        });

    });
}

// Función para crear eventListener boton 'eliminar' evento.
function mensajeBorrar(boton){

    boton.addEventListener('click', e => {
                
        document.getElementById('ventana-eliminar').showModal();
        document.getElementById('ok').addEventListener('click', e => {
            mensajes.forEach(element => {
                if(element.id == boton.getAttribute('id')){
                    delete mensajes[mensajes.indexOf(element)];
                    var filtered = mensajes.filter(function (el) {
                        return el != null; // Eliminamos los valores null del array.
                    });
                    mensajes = filtered;
                    let jsonMensajes = JSON.stringify(mensajes);
                    localStorage.setItem("mensajes", jsonMensajes);
                    
                    muestramensajes(mensajes, document.getElementById('mensajes-enviados'), "enviado");
                    muestramensajes(mensajes, document.getElementById('mensajes-entrantes'), "recibido");
                }
            });
            document.getElementById('ventana-eliminar').close();
        });
        
        document.getElementById('cancel').addEventListener('click', e => {
            document.getElementById('ventana-eliminar').close();
        })
    });
}
