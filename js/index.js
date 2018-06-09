"use strict";

var categorias = ['hats', 'space', 'funny', 'sunglasses', 'boxes', 'caturday', 'ties', 'dream', 'kittens', 'sinks', 'clothes'];

var urlCats = 'http://thecatapi.com/api/images/get?format=xml&results_per_page=20';
var xmlData;

var urlChange = urlCats;
var id;

window.onload = function(){
    id = getCookie('idUsu');
    controlador();
};

async function controlador(){
    xmlData = await datos_XML(urlCats);
    listaCategorias();
    imprimir(); 
}

function datos_XML(url){
    console.log('Funcion datos_XML');
    return new Promise(resolve => {
        var  xhttp = new XMLHttpRequest();
        xhttp.addEventListener('readystatechange', function() {
            if(this.readyState == 4 && this.status == 200) {
                resolve(this.responseXML);
            }
        });
        xhttp.open("GET", url, true);
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
        if(option == "Todas las categorías") {
            urlChange = urlCats;
        } else{
            urlChange = urlCats + '&category=' + option + '&size=small';
        }
        console.log('cambio categoria en la url ' + urlChange);
        updateGallery(urlChange); 
    });
}


function imprimir(){
    console.log('Funcion imprimir');

    var content = document.getElementById('search-content');
    //    content.innerHTML = '';
    var imagenes = xmlData.getElementsByTagName('image');

    var tabla = document.createElement('table');
    tabla.classList.add('tabla');
    
    for (var i = 0; i < imagenes.length; i++){

        var fila = document.createElement('tr');
        tabla.appendChild(fila);

        for(var j =0; j < 4; j++){

            var celda = document.createElement('td');

            var img = document.createElement('img');
            img.classList.add('fotos');

            var contentIcons = document.createElement('div');
            contentIcons.setAttribute('style', 'display:none');

            if(document.cookie){
                contentIcons.setAttribute('style', 'display:block');

                //-------------------CLICK FAVORITOS-------------
                var fav = document.createElement('img');

                fav.setAttribute('src', 'img/favorites.png');

                fav.setAttribute('id', imagenes[i].getElementsByTagName('url')[0].textContent);

                fav.classList.add('fav');
                eventoFavoritos(fav);

                contentIcons.appendChild(fav);

                //-------------------CLICK LIKES-------------
                var like = document.createElement('img');

                like.setAttribute('src', 'img/likes.png');

                like.setAttribute('id', imagenes[i].getElementsByTagName('url')[0].textContent);

                like.classList.add('like');
                eventoLikes(like);  
                contentIcons.appendChild(like);
            }

            img.setAttribute('src', imagenes[i].getElementsByTagName('url')[0].textContent);
            img.setAttribute('alt', imagenes[i].getElementsByTagName('id')[0].textContent);


            celda.appendChild(img);
            celda.appendChild(contentIcons);

            fila.appendChild(celda);
            if(j != 3){
                i++;  
            } 
        }
    }
    content.appendChild(tabla);
}

//------------------------ACTUALIZAR GALERIA FOTOS -----------
async function updateGallery(url){
    console.log('Funcion actualizar fotos');
    xmlData = await datos_XML(url);
    //controlador(url);
    var content = document.getElementById('search-content');
    var images = xmlData.getElementsByTagName("image");
    var imagenes = content.getElementsByClassName("fotos");

    console.log(images.length, imagenes.length);

 //---------------ACTUALIZA LOS LIKES Y ME GUSTA-------------------  
    var likes = content.getElementsByClassName('like');
    console.log(likes);
    for(var a = 0; a < likes.length; a++){

        if(likes[a].getAttribute('src') == 'img/likes2.png'){
            likes[a].setAttribute('src', 'img/likes.png')
        }
    }

    var favoritos = content.getElementsByClassName('fav');
    for(var b = 0; b < favoritos.length; b++){
        if(favoritos[b].getAttribute('src') == 'img/favorites2.png'){
            favoritos[b].setAttribute('src', 'img/favorites.png')
        }
    }
 //-------------------------------------------------   
    for(let i=0;i<imagenes.length;i++){    
        var src = images[i].getElementsByTagName("url")[0].textContent;
        imagenes[i].setAttribute("src", src);
    }
}

//--------------------CARGA DEL JSON--------------------------
function load_JSON() {
    return new Promise(function(carga, nocarga) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("get", '../json/usuarios.json', true);
        xhttp.responseType = "json";
        xhttp.onload = function() {
            var status = xhttp.status;
            if (status == 200) {
                carga(xhttp.response);
                console.log('ok')
                console.log(xhttp.response);
            } else {
                nocarga(status);
                alert("Algo fue mal.");
            }
        };
        xhr.send();
    });
}

//----------------EVENTOS BOTONES LIKES Y FAVORITOS-------------
function eventoFavoritos(btn){
    btn.addEventListener('click', function(){
        var urlImg = this.getAttribute('id');

        if(this.getAttribute('src') == 'img/favorites2.png'){
            this.setAttribute('src', 'img/favorites.png');
            let id = this.getAttribute('id-json');
            borrarFavoritos(id);
        } else {
            this.setAttribute('src', 'img/favorites2.png');
            aniadirFav(urlImg, this);
        }
    });
}

function eventoLikes(btn){
    btn.addEventListener('click', function(){
        var urlImg = this.getAttribute('id');

        if(this.getAttribute('src') == 'img/likes2.png'){
            this.setAttribute('src', 'img/likes.png');
            let id = this.getAttribute('id-json');
            borrarLikes(id);
        } else {
            this.setAttribute('src', 'img/likes2.png');
            aniadirLikes(urlImg, this);
        }
    });
}

function aniadirFav(url, self){
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener('readystatechange', function() {
        if(this.readyState == 4 && this.status == 201) {
            var json_back = JSON.parse(this.response);
            self.setAttribute('id-json', json_back.id)
        }
    });
    xhttp.open("post", 'http://localhost:3000/favoritos', true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({url: url, idUsu: id}));
}

function aniadirLikes(url, self){
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener('readystatechange', function() {
        if(this.readyState == 4 && this.status == 201) {
            var json_back = JSON.parse(this.response);
            self.setAttribute('id-json', json_back.id);
        }
    });
    xhttp.open("post", 'http://localhost:3000/likes', true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({url: url, ideUsu: id}));
}

//---------------CREA LA COOKIE DEL USUARIO LOGEADO

//function getCookie(cname, days)
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//-----------------BORRAR LOS EVENTOS FAVORITOS Y LIKES DEL JSON----------

function borrarFavoritos(id){
    var xhttp = new XMLHttpRequest();
    xhttp.open("delete", 'http://localhost:3000/favoritos' + '/' + id, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}

function borrarLikes(id){
    var xhttp = new XMLHttpRequest();
    xhttp.open("delete", 'http://localhost:3000/likes' + '/' + id, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}



