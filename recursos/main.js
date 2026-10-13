const form = document.querySelector('#weather-form');
const input = document.querySelector('#search');
const message = document.querySelector('#message');
const card = document.querySelector('#weather-card');

const weatherLabels = {
  0: 'Despejado',
  1: 'Mayormente despejado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Niebla',
  48: 'Niebla con escarcha',
  51: 'Llovizna ligera',
  53: 'Llovizna moderada',
  55: 'Llovizna intensa',
  61: 'Lluvia ligera',
  63: 'Lluvia moderada',
  65: 'Lluvia intensa',
  71: 'Nieve ligera',
  73: 'Nieve moderada',
  75: 'Nieve intensa',
  80: 'Chaparrones ligeros',
  81: 'Chaparrones moderados',
  82: 'Chaparrones intensos',
  95: 'Tormenta',
  96: 'Tormenta con granizo',
  99: 'Tormenta intensa',
};

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('error', isError);
}

function renderWeather(place, current) {
  const label = weatherLabels[current.weather_code] || 'Condiciones variables';
  card.classList.remove('is-empty');
  card.innerHTML = `
    <div class="weather-header">
      <div><p class="section-label">Condiciones actuales</p><h2>${place.name}, ${place.country_code}</h2><p>${label}</p></div>
      <span class="placeholder-icon" aria-hidden="true">☼</span>
    </div>
    <div class="temperature">${Math.round(current.temperature_2m)}<span>°C</span></div>
    <div class="weather-details">
      <div class="metric"><strong>${Math.round(current.apparent_temperature)}°C</strong><p>Sensación térmica</p></div>
      <div class="metric"><strong>${current.relative_humidity_2m}%</strong><p>Humedad</p></div>
      <div class="metric"><strong>${Math.round(current.wind_speed_10m)} km/h</strong><p>Viento</p></div>
    </div>`;
}

async function findWeather(city) {
  setMessage('Buscando ubicación…');
  const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`);
  if (!locationResponse.ok) throw new Error('No se pudo encontrar la ubicación.');
  const location = await locationResponse.json();
  if (!location.results?.length) throw new Error('No encontramos esa ciudad. Probá con otro nombre.');

  const place = location.results[0];
  const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`);
  if (!weatherResponse.ok) throw new Error('No se pudo consultar el clima.');
  const weather = await weatherResponse.json();
  renderWeather(place, weather.current);
  setMessage(`Actualizado para ${new Date(weather.current.time).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}.`);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = input.value.trim();
  if (!city) return;
  try {
    await findWeather(city);
  } catch (error) {
    setMessage(error.message, true);
  }
});
