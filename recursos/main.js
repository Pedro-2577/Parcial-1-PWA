const API_KEY = '22c53ead81f46f953d5f8619c4cee531'; // INSERTEN SU API KEY ACA!
const URL = 'http://api.openweathermap.org/data/2.5/';

const d = document;
const button = d.getElementById("sendButton");
const main = d.getElementById("main");
const inputElement = d.getElementById("search");
 
button.addEventListener("click", ()=>{
  meteorologo(inputElement.value);
});

if (JSON.parse(localStorage.getItem("datos_clima") != null)){

  console.log("se supone que si sale esto el local tiene algo adentro");

let jClima = JSON.parse(localStorage.getItem("datos_clima"));

var aClima = {
cuidad: jClima.cuidad,
temp: jClima.temp,
temp_feel: jClima.temp_feel,
temp_min: jClima.temp_min,
temp_max: jClima.temp_max,
humedad: jClima.humedad,
presion: jClima.presion,
viento: jClima.viento,
src: jClima.src,
alt: jClima.alt 
};

Impresora();
console.log(jClima);

}
function meteorologo(cuidad){

  const fetchPromise = fetch(`${URL}weather?q=${cuidad}&appid=${API_KEY}&units=metric&lang=es`); 

  fetchPromise.then(response => {
    console.log('result', response);
    return response.json();
  }).then(result => {
    console.log('data', result);

    aClima = {
    cuidad: inputElement.value ,
    temp: result.main.temp ,
    temp_feel: result.main.feels_like ,
    temp_min: result.main.temp_min ,
    temp_max: result.main.temp_max ,
    humedad: result.main.humidity ,
    presion: result.main.pressure ,
    viento: result.wind.speed ,
    src: result.weather[0].icon ,
    alt: result.weather[0].description 
    };

    localStorage.setItem("datos_clima", JSON.stringify(aClima));

    Impresora();
  }).catch(err =>{
    console.log('Ohhh fallo!: ', err);
  });

}

function Impresora(){

console.log(d.querySelector('body'));


if(aClima.src == '01d' || aClima.src == '02d'){  
  d.querySelector('body').style.backgroundImage = "url('recursos/fotos/dia.jpg')"; 
}
if(aClima.src == '01n' || aClima.src == '02n'){  
  d.querySelector('body').style.backgroundImage = "url('recursos/fotos/noche.jpg')"; 
}
if(aClima.src == '03d' || aClima.src == '03n' || aClima.src == '04d' || aClima.src == '04n'){  
  d.querySelector('body').style.backgroundImage = "url('recursos/fotos/nubes.jpg')"; 
}
if(aClima.src == '10d' || aClima.src == '10n' || aClima.src == '09d' || aClima.src == '09n' || aClima.src == '11d' || aClima.src == '11n'){  
  d.querySelector('body').style.backgroundImage = "url('recursos/fotos/rain.jpg')"; 
}
if(aClima.src == '13d' || aClima.src == '13n' || aClima.src == '50d' || aClima.src == '50n'){  
  d.querySelector('body').style.backgroundImage = "url('recursos/fotos/snow.jpg')"; 
}

for (let cuidad of d.getElementsByClassName("cuidad")) {
    cuidad.innerHTML =  aClima.cuidad;
}

for (let temp of d.getElementsByClassName("temp")) {
  
    temp.innerHTML = aClima.temp;
  }


for (let temp_feel of d.getElementsByClassName("temp_feel")) {
  
    temp_feel.innerHTML = aClima.temp_feel;
  }


for (let temp_min of d.getElementsByClassName("temp_min")) {
  
    temp_min.innerHTML = aClima.temp_min;
  }


for (let temp_max of d.getElementsByClassName("temp_max")) {
  
    temp_max.innerHTML = aClima.temp_max;
  }


for (let humedad of d.getElementsByClassName("humedad")) {
  
    humedad.innerHTML = aClima.humedad;
  }


for (let presion of d.getElementsByClassName("presion")) {
  
    presion.innerHTML = aClima.presion;
  }


for (let viento of d.getElementsByClassName("viento")) {
  
    viento.innerHTML = aClima.viento;
  }


  d.querySelector("img").src = `http://openweathermap.org/img/wn/${aClima.src}.png`;
  d.querySelector("img").alt = aClima.alt;

}
