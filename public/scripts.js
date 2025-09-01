let placewoeid = 44418;
const ciudadParams = { lat: 4.7110053, lon: -74.0720857 };
let info;

/* Variables de API */
const API_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=es';
const API_GEOCODING_URL = 'http://api.openweathermap.org/geo/1.0/direct?limit=1';
const API_IMAGES_URL = 'https://openweathermap.org/img/wn';

let content = document.querySelector('.content');
let leftImgs = document.querySelector('.left-imgs');
let leftInfo = document.querySelector('.left-info');
let weekCards = document.querySelector('.week-temp');
let todaysSec = document.querySelector('.todays-temp');

const leftInfoTempl = (temp, weather, time, place, country) => {
  return `
        <h2>${temp}<span>℃</span></h2>
        <p class="left-time">${weather}</p>
        <div class="down-left">
          <p>
            Today
            <span> • </span>
            ${time}
          </p>
          <p>
            <i class="fas fa-map-marker-alt"></i>
            ${place}. ${country}
          </p>
        </div>
        `;
};

const weekCardTempl = (daysArr) => {
  let weekDays = [];
  const opciones = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  };
  daysArr.forEach((element, index) => {
    let weatherImg = `${API_IMAGES_URL}/${element.weather[0].icon}.png`;
    let weatherInfo = element.weather[0].description;
    let maxTemp = Math.floor(element.main.temp_max);
    let minTemp = Math.floor(element.main.temp_min);
    let fechaFt = new Date(element.dt * 1000);
    let date = index == 0 ? 'Tomorrow' : fechaFt.toLocaleDateString('en-EN', opciones);
    weekDays.push(
      `
            <div class="week-day-card">
                <p class="day">${date}</p>
                <img src="${weatherImg}" alt="${weatherInfo}">
                <div class="day-temps">
                    <p>${maxTemp}°C</p>
                    <p>${minTemp}°C</p>
                </div>
            </div>
            `
    );
  });
  return weekDays.join('');
};

function direccionViento(deg) {
  const direcciones = [
    'Norte',
    'Noreste',
    'Este',
    'Sureste',
    'Sur',
    'Suroeste',
    'Oeste',
    'Noroeste',
  ];

  // Cada sector cubre 45° (360/8)
  const indice = Math.round(deg / 45) % 8;
  return direcciones[indice];
}

const todaysHighlights = (todayObj) => {
  return `
        <div class="todays-temp-cards">
            <div class="todays-temps-card ttc-tl">
                <p class="ttc-title">Wind status</p>
                <h4 class="ttc-number">
                    ${todayObj.wind.speed}<span>m/s</span>
                </h4>
                <div class="todays-card-air-dir">
                    <i class="fas fa-location-arrow" id="direction-icon"></i>
                    <span>${direccionViento(todayObj.wind.deg)}</span>
                </div>
            </div>
            <div class="todays-temps-card ttc-tr">
                <p class="ttc-title">Humidity</p>
                <h4 class="ttc-number">
                    ${todayObj.main.humidity}<span>%</span>
                </h4>
                <div class="humidity-graph">
                    <span class="graph-span gs-tl">0</span>
                    <span class="graph-span gs-c">50</span>
                    <span class="graph-span gs-tr">100</span>
                    <div id="graph-fill"></div>
                    <span class="graph-span gs-br">%</span>
                </div>
            </div>
            <div class="todays-temps-card ttc-bl">
                <p class="ttc-title">Visibility</p>
                <h4 class="ttc-number">
                    ${todayObj.visibility / 1000}<span> Kilometers</span>
                </h4>
            </div>
            <div class="todays-temps-card ttc-tr">
                <p class="ttc-title">Air presure</p>
                <h4 class="ttc-number">
                    ${todayObj.main.pressure}<span>hPa</span>
                </h4>
            </div>
        </div>
        `;
};

const getInfo = () => {
  leftImgs.innerHTML = `
    <div class="loader1">
        <div class="fill"></div>
    </div>
    `;
  todaysSec.innerHTML += `
    <div class="loader2">
      <div class="fill"></div>
    </div>
    `;
  let apiUrl = `${API_WEATHER_URL}&lat=${ciudadParams.lat}&lon=${ciudadParams.lon}`;
  fetch(`api?url=${encodeURIComponent(apiUrl)}`)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      document.querySelector('.loader1').remove();
      document.querySelector('.loader2').remove();
      if (response.message == 'wrong latitude') {
        todaysSec.innerHTML = `
            <div class="not-found">
                <h1>WOEID not found, sorry</h1>
            </div>
            `;
        leftImgs.innerHTML = `
            <img class="error-image" src="errorImage.png">
            `;
        leftInfo.innerHTML = '';
      } else {
        let todaysInfo = response.list[0];
        let list3HourForecast = response.list;
        let daysArr = [
          list3HourForecast[11],
          list3HourForecast[19],
          list3HourForecast[27],
          list3HourForecast[35],
        ];
        //left info fill
        let temperatureToday = Math.floor(todaysInfo.main.temp);
        let weather = todaysInfo.weather[0].main;
        const fecha = new Date(todaysInfo.dt * 1000);
        const opciones = {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        };
        let time = fecha.toLocaleDateString('en-EN', opciones);
        let place = response.city.name;
        let country = response.city.country;
        let imgSrc = `${API_IMAGES_URL}/${todaysInfo.weather[0].icon}@4x.png`;
        let weatherInfo = todaysInfo.weather[0].description;
        leftImgs.innerHTML = `
            <img src="${imgSrc}" alt="${weatherInfo}">
            <img src="./img/weather/Cloud-background.png" alt="cloud background"></img>`;
        leftInfo.innerHTML = leftInfoTempl(temperatureToday, weather, time, place, country);
        //content fill
        weekCards.innerHTML = weekCardTempl(daysArr);
        todaysSec.innerHTML += todaysHighlights(todaysInfo);
        document.getElementById('graph-fill').style.width = `${todaysInfo.main.humidity}%`;
        airDirection = Math.trunc(todaysInfo.wind.deg);
        document.getElementById('direction-icon').style.transform = `rotate(${
          airDirection - 45
        }deg)`;
      }
    });
};

//search by place funcionality

let searchBtn = document.querySelector('.search-place-btn');
let searchSec = document.querySelector('.search-place');

let closeBtn = document.querySelector('.close-search');

searchBtn.addEventListener('click', function () {
  searchSec.style.left = '0%';
});

closeBtn.addEventListener('click', function () {
  searchSec.style.left = '-100%';
});

const changePlace = (lat, lon) => {
  searchSec.style.left = '-100%';
  ciudadParams.lat = lat;
  ciudadParams.lon = lon;
  leftImgs.innerHTML = '';
  leftInfo.innerHTML = '';
  weekCards.innerHTML = '';
  todaysSec.innerHTML = '<h3>Today’s Hightlights</h3>';
  getInfo();
};

const searchByWoeid = () => {
  let url = `${API_GEOCODING_URL}&q=${document.getElementById('woeid-input').value}`;
  fetch(`api/?url=${encodeURIComponent(url)}`)
    .then((response) => response.json())
    .then((response) => {
      if (response.length === 0) {
        alert('Location not found, please try again');
      } else {
        ciudadParams.lat = response[0].lat;
        ciudadParams.lon = response[0].lon;
        leftImgs.innerHTML = '';
        leftInfo.innerHTML = '';
        weekCards.innerHTML = '';
        todaysSec.innerHTML = '<h3>Today’s Hightlights</h3>';
        searchSec.style.left = '-100%';
        getInfo();
      }
    });
};

//search with location by coordinates

function success(ubicacion) {
  ciudadParams.lat = ubicacion.coords.latitude;
  ciudadParams.lon = ubicacion.coords.longitude;
  getInfo();
}

function error() {
  alert(
    'Denegaste el acceso a la ubicación. Para visualizar el clima de tu ubicación, por favor acepta el acceso a la ubicación. De lo contrario, se mostrará el clima de Bogotá, Colombia.'
  );
  getInfo();
}

// Cambio de unidades de temperatura
function toggleUnits(unit) {
  const tempElements = document.querySelectorAll('.day-temps p, .left-info h2');
  const celsiusBtn = document.getElementById('celsius-btn');
  const farBtn = document.getElementById('far-btn');

  tempElements.forEach((element) => {
    let tempValue = parseFloat(element.textContent);
    if (unit === 'far') {
      // Convertir a Fahrenheit
      tempValue = (tempValue * 9) / 5 + 32;
      element.innerHTML = `${Math.round(tempValue)}<span>℉</span>`;
      celsiusBtn.classList.remove('active-grade-btn');
      farBtn.classList.add('active-grade-btn');
    } else {
      // Convertir a Celsius
      tempValue = ((tempValue - 32) * 5) / 9;
      element.innerHTML = `${Math.round(tempValue)}<span>℃</span>`;
      farBtn.classList.remove('active-grade-btn');
      celsiusBtn.classList.add('active-grade-btn');
    }
  });
}

// Volver a cargar clima segun ubicacion
function reloadByLocation() {
  leftImgs.innerHTML = '';
  leftInfo.innerHTML = '';
  weekCards.innerHTML = '';
  todaysSec.innerHTML = '<h3>Today’s Hightlights</h3>';
  navigator.geolocation.getCurrentPosition(success, error, options);
}

// opciones para la geolocalización

const options = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 5000,
};

navigator.geolocation.getCurrentPosition(success, error, options);
