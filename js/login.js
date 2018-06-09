"use strict";

var categorias = ['hats', 'space', 'funny', 'sunglasses', 'boxes', 'caturday', 'ties', 'dream', 'kittens', 'sinks', 'clothes'];
var urlCats = 'http://thecatapi.com/api/images/get?format=xml&results_per_page=10';
var xmlData;

window.onload = function(){
    if(document.getElementById('select-categorias')) {
        listaCategorias();
        controlador();       
    }
    
};


//--------------------BUSCADOR DE CATEGORIAS---------------------//
async function controlador(){
    xmlData = await datos_XML();  
   //imprimir(); 
}

function datos_XML(){
    console.log('Funcion datos_XML');
    return new Promise(function(carga, nocarga) {
        //hacemos la petición del xml
        var xhttp = new XMLHttpRequest();
        //creamos un escuchador de eventos que llama a la función manageResponse
        xhttp.addEventListener('readystatechange', function() {
            if (this.readyState == 4 && this.status == 200) {
                //guardo el xml en la variable global xmlData
                xmlData = this.responseXML;
                carga(xmlData); 
                //lo meto en el else if porque si no me salta al else todo el rato ya que va pasando por diferentes estados la llamada
            } else if(this.readyState == 4) {
                //en el catch devolvemos el mensaje 'Error al cargar XML!'
                nocarga('Error al cargar XML!');
            }
        });
        //abrimos la url
        xhttp.open("GET", urlCats, true);
        //mandamos la peticion
        xhttp.send();
    });  
}

function listaCategorias() {
    console.log('Funcion crear categorias');
    var lista = '<option value="" selected>Ver todas las categorias</option>';
    for(var i = 0, c = categorias.length; i < c; i++) {
        lista += '<option value="' + categorias[i] + '">' + categorias[i] + '</option>';
    }
    var select = document.getElementById('select-categorias');
    select.innerHTML = lista;
    select.addEventListener('change', function() {
        var option = this.options[this.selectedIndex].value;
        var urlChange = urlCats + '&category=' + option + '&size=small';
        console.log('cambio categoria en la url ' + urlChange);
        controlador(urlChange);
    });
}

/*function imprimir() {
    console.log('Funcion imprimir');
    var content = document.getElementById('search-content');
    var images = xmlData.getElementsByTagName("image");
    content.innerHTML = '';
    for(var i = 0; i < images.length; i++){
        var elemento = document.createElement('div');
        //var enlace = document.createElement('a');
        var img = document.createElement('img');
        //var title = document.createElement('p');

        img.setAttribute('src', images[i].getElementsByTagName('url')[0].textContent);
        img.setAttribute('height', '50%');
        //enlace.appendChild(img);
        //enlace.appendChild(title);
        //elemento.appendChild(enlace);
        //elemento.classList.add('cat-content');
        elemento.appendChild(img);
        //content.appendChild(elemento);
        content.appendChild(elemento);
    }
    console.log(xmlData);
}*/

//-------------------------LOGIN-----------------------------------//
function load_JSON() {
    return new Promise(function(carga, nocarga) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "../json/usuarios.json", true);
        xhttp.responseType = "json";
        xhttp.onload = function(){
             var status = xhttp.status;
            if(status == 200){
                carga(xhttp.response);
            }else{
                nocarga(status);
                alert("Algo fue mal");
            }
        }
       xhttp.send();
          
        });    
}

document.getElementById('btn-send-login').addEventListener('click', function() {
    var nombre = document.getElementById('name-input').value;
    var pass = document.getElementById('pass-input').value;
    login(nombre, pass);
    
});



async function login(nombre, pass) {
    var obj = await load_JSON();
    var encontrado = false;
    for(var i = 0; i < obj.usuarios.length; i++) {
        if(obj.usuarios[i].nombre == nombre.trim() && obj.usuarios[i].password == pass.trim()) {
           setCookie(obj.usuarios[i].id);
           encontrado = true;
        }
    }
    if(encontrado) {
        alert('Válidado correctamente');
        window.location.href = '../index.html';
    } else {
        alert('Lo siento!! Debe registrarse.');
    }
}

function setCookie(id){
    document.cookie = "idUsu=" + id + "; max-age=3600; path=/";
}
