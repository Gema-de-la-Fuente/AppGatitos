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
    var xmlRequest = await datos_XML();  
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

//--------------------REGISTRO RESTRICCIONES---------------------//
var form = document.forms["formulario"];

form["nombre"].addEventListener("keyup", function(){
    var expReg = /[A-Za-z]{2,15}/g;
    if(!expReg.test(form["nombre"].value) || form["nombre"].value == ""){
        form["nombre"].setCustomValidity("Introduzca un nombre que contenga entre 2 y 15 caracteres");
    }
    else{
        form["nombre"].setCustomValidity("");
    }
});

form["apellidos"].addEventListener("keyup", function(){
    var expReg = /[A-Za-z]{2,15}/g;
    if(!expReg.test(form["apellidos"].value) || form["apellidos"].value == ""){
        form["apellidos"].setCustomValidity("Introduzca un apellido que contenga entre 2 y 15 caracteres");
    }
    else{
        form["apellidos"].setCustomValidity("");
    }
});

form["email"].addEventListener("keyup", function(){
    var expReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:[a-zA-Z0-9-]+)*(\.{1})([a-z]){2,3}$/g;
    if(!expReg.test(form["email"].value) || form["email"].value == ""){
        form["email"].setCustomValidity("La dirección de email debe tener el patron example@ejemplo.com");
    }
    else{
        form["email"].setCustomValidity("");
    }
});

form["password"].addEventListener("keyup", function(){
    var expReg =/^(\d){3,15}$/g;
    /* /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,15}$/g*/
    var bool = ((!expReg.test(form["password"].value) || form["password"].value == ""));
    console.log(bool)
    if(bool){
        form["password"].setCustomValidity("La contraseña debe incluir una minúscula, una mayúscula, un número, un carácter especial y no tener espacios en blanco");
    }
    else{
        form["password"].setCustomValidity("");
    }
});

form["passwordAgain"].addEventListener("keyup", function(){
    var expReg = /^(\d){3,15}$/g;
    ///^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{,15}$/g
    if(form["password"].value !== form["passwordAgain"].value){
        form["passwordAgain"].setCustomValidity("La contraseñas deben coincidir");
    }
    else{
        form["passwordAgain"].setCustomValidity("");
    }
});

function aniadirUsu(nombreU , passwordU){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/usuarios", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({ nombre: nombreU, password: passwordU }));
}

form["registro"].addEventListener("click", function(e){
    e.preventDefault();
    var nombreU = form['nombre'].value;
    var passwordU = form['password'].value;
    aniadirUsu(nombreU, passwordU);
    alert('Registro añadido');
    window.location.href = '../html/login.html';

});







