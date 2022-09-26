window.onload = function () {
    //Carga de ciudades
    carga_ciudades();

};

function carga_ciudades() {
    let ciudad = document.getElementById("ciudad")
    fetch("españa.json")
        .then(respuesta => respuesta.json())
        .then(ciudades => {
            ciudades.sort();
            ciudades.reverse();
            let fragmento = document.createDocumentFragment();
            ciudades.forEach((ciudad) => {
                let opcion = document.createElement("option");
                opcion.value = ciudad.coord.lat + "," + ciudad.coord.lon;
                opcion.text = ciudad.name;
                fragmento.appendChild(opcion);
            })
            ciudad.appendChild(fragmento);
            console.log(ciudad.options[0]);
            cambia_ciudad(ciudad.options[0].text, ciudad.options[0].value);
        })
}

document.getElementById("ciudad").addEventListener("change", () => {
    let ciudad = document.getElementById("ciudad")
    cambia_ciudad(ciudad.options[ciudad.selectedIndex].text, ciudad.options[ciudad.selectedIndex].value);
});

function cambia_ciudad(nomciudad, lonlat) {
    let vector = lonlat.split(',');
    document.getElementById("eleccion").innerHTML = nomciudad;
    document.getElementById("longitud").innerHTML = vector[0];
    document.getElementById("latitud").innerHTML = vector[1];

    //Aqui tenemos que poner la conexión con Weathermap para el clima del lugar
    let clave = '425cca1e8df28e4963dcc36cb497a33e';
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + nomciudad + ',ES&units=metric&APPID=' + clave + '&lang=es';
    console.log(url);
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            //Creo un fragmento para los datos meteorologicos
            let fragmento = document.createDocumentFragment();

            //Añado la temperatura
            let division = document.createElement("div");
            let titulo_temperatura = document.createElement("label");
            titulo_temperatura.innerHTML = "Temperatura: ";
            division.appendChild(titulo_temperatura);

            let temperatura = document.createElement("span");
            temperatura.innerHTML = datos.main.temp + " ºC";
            division.appendChild(temperatura);

            fragmento.appendChild(division);

            //Añado la humedad
            let division1 = document.createElement("div");
            let titulo_humedad = document.createElement("label");
            titulo_humedad.innerHTML = "Humedad: ";
            division1.appendChild(titulo_humedad);

            let humedad = document.createElement("span");
            humedad.innerHTML = datos.main.humidity + "%";
            division1.appendChild(humedad);

            fragmento.appendChild(division1);

            //Añado la presion
            let division2 = document.createElement("div");
            let titulo_presion = document.createElement("label");
            titulo_presion.innerHTML = "Presión: ";
            division2.appendChild(titulo_presion);

            let presion= document.createElement("span");
            presion.innerHTML = (datos.main.pressure*0.00131579).toFixed(2) + " atm";
            division2.appendChild(presion);
            Math.round(presion, 2)

            fragmento.appendChild(division2);

            //Añado la pronostico
            let division3 = document.createElement("div");
            let titulo_pronostico = document.createElement("label");
            titulo_pronostico.innerHTML = "Pronóstico: ";
            division3.appendChild(titulo_pronostico);

            let pronostico= document.createElement("span");
            pronostico.innerHTML = datos.weather[0].description;
            division3.appendChild(pronostico);

            fragmento.appendChild(division3);

            //Añado el icono del pronostico
            let icono = document.createElement("img");
            icono.src = "http://openweathermap.org/img/w/" + datos.weather[0].icon + ".png"
            document.getElementById("icono").appendChild(icono);

            //Vacio y cargo los datos meteorologicos de la ciudad vigente
            document.getElementById("clima").innerHTML = "";
            document.getElementById("clima").appendChild(fragmento)
            console.log(datos.main);
        })

    //Aqui cargamos el mapa
    document.getElementById('weathermap').innerHTML = "<div id='mapa'></div>";
    var map = L.map('mapa').

        setView(vector, 30);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);

    //Agrega el control de escala al mapa
    L.control.scale().addTo(map);

    //Herramienta para mostrar una chincheta en una posicion dada por longitud latitud
    L.marker(vector, { draggable: true }).addTo(map);
    console.log(vector);
    console.log(nomciudad);
}