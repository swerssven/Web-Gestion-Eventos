// Función para pintar elementos span (errores).
function muestraError(querySpans, span, campo, correcto, mensaje = "") {
    let errors = querySpans;
    errors.forEach(element => {
        if (element.getAttribute('id') == span && !correcto) {
            element.innerText = mensaje;
            campo.style.boxShadow = "red 0px 0px 5px 2px";
        } else if (element.getAttribute('id') == span && correcto) {
            element.innerText = "";
            campo.style.boxShadow = "";
        }
    });
}

// Función para buscar usuario. Devuelve true si existe en un array de objetos.
function buscaUsuario(usuarios, nombre, password = null) {
    let existe = false;
    usuarios.forEach(element => {
        if(element.nombre == nombre){
            if(password == null){
                existe =  true;
            } else {
                if(element.password == password){
                    existe = true;
                }
            }
        }
    });
    return existe;
}

// Función para comprobar si existe algún mensaje de error.
function compruebaErrores(errorSpans) {
    let correct = true;
    errorSpans.forEach(element => {
        if(element.innerText != ""){
            correct = false;
        }
    });
    return correct;
}

// Función para creacion de cookie.
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

// Funcion para leer Cookie.
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

// Función para comprobar que exite cookie de sesión.
function checkCookie(cname) {
    var resul = false;
    var username = getCookie(cname);
    if (username != "") {
      resul = true;
    }
    return resul;
}

// Función para elimiar una cookie.
function eliminarCookie(cname) {
    return document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// Función para la validación de la fecha de nacimiento.
function compruebaFecha(fecha) {
    let fecha_evento = new Date(fecha);
    let fecha_ahora = Date.now();
    
    if (fecha_evento > fecha_ahora) {
        return true;

    } else {
        return false;
    }
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
    }
}

// Funcion que devuelve número mensajes nuevos según fecha cookie ultima session.
function numMensajesNuevos(cookie, cookieUltimaSesion, mensajes) {
    let numMensajesNuevos = 0;
    mensajes.forEach(element => {
        if(element.destinatario == cookie && parseInt(cookieUltimaSesion) < parseInt(element.fecha)){
            numMensajesNuevos++;
        }
    });
    
    return numMensajesNuevos;
}

// función que devuelve cuantos eventos son futuros.
function numEventosFuturos(eventos){
    let num = 0;
    let date = new Date((new Date()).getFullYear() + "/" + ((new Date()).getMonth()+1) + "/" + (new Date()).getDate());
    eventos.forEach(element => {
        if(new Date(element.fecha) >= date){
            num++;
        }
    });
    return num;
}

// función que devuelve cuantos eventos son pasados.
function numEventosPasados(eventos){
    let num = 0;
    let date = new Date((new Date()).getFullYear() + "/" + ((new Date()).getMonth()+1) + "/" + (new Date()).getDate());
    eventos.forEach(element => {
        if(new Date(element.fecha) < date){
            num++;
        }
    });
    return num;
}