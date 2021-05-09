let placewoeid = 44418;
let info;
// let loading = false;

let content = document.querySelector('.content');
let leftImgs = document.querySelector('.left-imgs');
let leftInfo = document.querySelector('.left-info');
let weekCards = document.querySelector('.week-temp');
let todaysSec = document.querySelector('.todays-temp');

const leftInfoTempl = (temp, weather, time, place) =>{
    return (
        `
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
            ${place}
          </p>
        </div>
        ` 
    )
}

const weekCardTempl = (daysArr) =>{
    let weekDays = []
    weekDays.push(
        `
        <div class="week-day-card">
            <p class="day">Tomorrow</p>
            <img src="./${(daysArr[1].weather_state_name).replace(/\s/g,'')}.png" alt="heavy rain image">
            <div class="day-temps">
                <p>${Math.trunc(daysArr[1].max_temp)}°C</p>
                <p>${Math.trunc(daysArr[1].min_temp)}°C</p>
            </div>
        </div>
        `
    )
    for(i=2; i<6; i++){
        let weatherImg = (daysArr[i].weather_state_name).replace(/\s/g,'');
        let maxTemp = Math.trunc(daysArr[i].max_temp);
        let minTemp = Math.trunc(daysArr[i].min_temp);
        let date = parseToDate(new Date(daysArr[i].applicable_date));
        weekDays.push(
            `
            <div class="week-day-card">
                <p class="day">${date}</p>
                <img src="./${weatherImg}.png" alt="heavy rain image">
                <div class="day-temps">
                    <p>${maxTemp}°C</p>
                    <p>${minTemp}°C</p>
                </div>
            </div>
            `
        )
    }
    return weekDays.join('');
}

const todaysHighlights = (todayObj) =>{
    return (
        `
        <div class="todays-temp-cards">
            <div class="todays-temps-card ttc-tl">
                <p class="ttc-title">Wind status</p>
                <h4 class="ttc-number">
                    ${Math.trunc(todayObj.wind_speed)}<span>mph</span>
                </h4>
                <div class="todays-card-air-dir">
                    <i class="fas fa-location-arrow" id="direction-icon"></i>
                    <span>${todayObj.wind_direction_compass}</span>
                </div>
            </div>
            <div class="todays-temps-card ttc-tr">
                <p class="ttc-title">Humidity</p>
                <h4 class="ttc-number">
                    ${todayObj.humidity}<span>%</span>
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
                    ${(todayObj.visibility).toFixed(1)}<span>miles</span>
                </h4>
            </div>
            <div class="todays-temps-card ttc-tr">
                <p class="ttc-title">Air presure</p>
                <h4 class="ttc-number">
                    ${todayObj.air_pressure}<span>mb</span>
                </h4>
            </div>
        </div>
        `
    )
}

function parseToDate(date){
    month = date.getMonth();
    day = date.getDay();
    number = date.getDate();
    return (
        `${getStrDay(day)}, ${number} ${getStrMonth(month)}`
    )
}

function getStrDay(day){
    switch (day) {
        case 0:
            return 'Sun';
        case 1:
            return 'Mon';
        case 2:
            return 'Tue';
        case 3:
            return 'Wed';
        case 4:
            return 'Thu';
        case 5:
            return 'Fri';
        case 6:
            return 'Sat';
        default:
            break;
    }
}

function getStrMonth(month){
    switch (month) {
        case 0:
            return 'Jan';
        case 1:
            return 'Feb';
        case 2:
            return 'Mar';
        case 3:
            return 'Apr';
        case 4:
            return 'May';
        case 5:
            return 'Jun';
        case 6:
            return 'Jul';
        case 7:
            return 'Aug';
        case 8:
            return 'Sep';
        case 9:
            return 'Oct';
        case 10:
            return 'Nov';
        case 11:
            return 'Dec';
        default:
            break;
    }
}

const getInfo = () =>{
    leftImgs.innerHTML =`
    <div class="loader1">
        <div class="fill"></div>
    </div>
    `;
    todaysSec.innerHTML += `
    <div class="loader2">
      <div class="fill"></div>
    </div>
    `;
    fetch(
        `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${placewoeid}`
    )
    .then(response => response.json())
    .then(response =>{
        document.querySelector('.loader1').remove();
        document.querySelector('.loader2').remove();
        if(response.detail == 'Not found.'){
            todaysSec.innerHTML=
            `
            <div class="not-found">
                <h1>WOEID not found, sorry</h1>
            </div>
            `;
            leftImgs.innerHTML = 
            `
            <img class="error-image" src="errorImage.png">
            `
            leftInfo.innerHTML = '';
        }else{

            //left info fill
            temperatureToday = Math.trunc(parseInt(response.consolidated_weather[0].the_temp, 10)); 
            weather = response.consolidated_weather[0].weather_state_name;
            time = parseToDate(new Date(response.time));
            place = response.title;
            leftImgs.innerHTML = `
            <img src="./${weather.replace(/\s/g,'')}.png" alt="weather image">
            <img src="./Cloud-background.png" alt="cloud background"></img>`;
            leftInfo.innerHTML = leftInfoTempl(temperatureToday, weather, time, place);
            console.log('hecho')
            //content fill
            daysArr = response.consolidated_weather;
            weekCards.innerHTML = weekCardTempl(daysArr);
            todaysSec.innerHTML += todaysHighlights(response.consolidated_weather[0]);
            document.getElementById('graph-fill').style.width = `${daysArr[0].humidity}%`;
            airDirection = Math.trunc(daysArr[0].wind_direction);
            document.getElementById('direction-icon').style.transform = `rotate(${airDirection-45}deg)`;
        }
    })
}

//search by place funcionality

let searchBtn = document.querySelector('.search-place-btn');
let searchSec = document.querySelector('.search-place');

let closeBtn = document.querySelector('.close-search');

searchBtn.addEventListener("click", function(){
    searchSec.style.left = '0%';
})

closeBtn.addEventListener("click", function(){
    searchSec.style.left = '-100%';
})

const changePlace = (woeid) =>{
    searchSec.style.left = '-100%';
    placewoeid = woeid;
    leftImgs.innerHTML = '';
    leftInfo.innerHTML = '';
    weekCards.innerHTML = '';
    todaysSec.innerHTML = '<h3>Today’s Hightlights</h3>';
    getInfo();
}

const searchByWoeid = () =>{
    placewoeid = document.getElementById('woeid-input').value;
    leftImgs.innerHTML = '';
    leftInfo.innerHTML = '';
    weekCards.innerHTML = '';
    todaysSec.innerHTML = '<h3>Today’s Hightlights</h3>';
    searchSec.style.left = '-100%';
    getInfo();
}

//search with location by coordinates

function success(ubicacion){
    fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?lattlong=${ubicacion.coords.latitude},${ubicacion.coords.longitude}`)
    .then(response => response.json())
    .then(response => {
        placewoeid = response[0].woeid;
        getInfo();
    })
}

function error(){
    console.log('gps negado');
    getInfo();
}

const options = {
    enableHighAccuracy: true, 
    maximumAge: 0, 
    timeout: 5000
};

navigator.geolocation.getCurrentPosition(success, error);

