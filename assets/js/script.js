let cities = [];

let cityFormEl = document.getElementById('city-search-form');
let cityInputEl = document.getElementById('city');
let weatherContainer = document.getElementById('current-weather');
let searchInputEl = document.getElementById('searched-city');
let forecastTitle = document.getElementById('forecast');
let forecastContainerEl = document.getElementById('future-five-container');
let pastSearchBtnEl = document.getElementById('past-search-buttons');

let formHandler = function(event) {
    event.preventDefault();
    let city = cityInputEl.value.trim();
    if(city){
        cityWeather(city);
        Day5(city);
        cities.unshift({city});
        cityInputEl.value = '';
    } else {
        alert('Please enter a city')
    }
    saveSearch();
    oldSearch(city);
};

let saveSearch = function() {
    localStorage.setItem('cities', JSON.stringify(cities));
};

let cityWeather = function(city) {
    let key = '968c4dcdc6c9e0ccb847bf83940c5522'
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

    fetch(apiUrl)
    .then(function(response) {
        response.json().then(function(data) {
            renderWeather(data, city);
        });
    });
};

let renderWeather = function(weather, searchedCity) {
    weatherContainer.textContent = '';
    searchInputEl.textContent = searchedCity;

    let currentDate = document.createElement('span');
    currentDate.textContent = " (" + moment(weather.dt.value).format('MMM D, YYYY') + ") ";
    searchInputEl.appendChild(currentDate);

    let weatherImg = document.createElement('img');
    weatherImg.setAttribute('src', `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    searchInputEl.appendChild(weatherImg);

    let tempEl = document.createElement('span');
    tempEl.textContent = `Temperature: ${weather.main.temp}°F`;
    tempEl.classList = 'list-group-item';

    let humidity = document.createElement('span');
    humidity.textContent = `Humidity: ${weather.main.humidity}%`;
    humidity.classList = 'list-group-item';

    let windMPH = document.createElement('span');
    windMPH.textContent = `Wind Speed: ${weather.wind.speed} MPH`;
    windMPH.classList = 'list-group-item';

    weatherContainer.appendChild(tempEl);
    weatherContainer.appendChild(humidity);
    weatherContainer.appendChild(windMPH);

    let lat = weather.coord.lat;
    let lon = weather.coord.lon;
    getOneCallIndex(lat, lon);
};

let getOneCallIndex = function(lat, lon) {
    let key = '968c4dcdc6c9e0ccb847bf83940c5522'
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?&lat=${lat}&lon=${lon}&appid=${key}`

    fetch(apiUrl)
    .then(function(response) {
        response.json()
        .then(function(data) {
            displayUV(data);
        })
    })
};

let displayUV = function(index) {
    let UVIndex = document.createElement('div');
    UVIndex.textContent = 'UV Index: ';
    UVIndex.classList = 'list-group-item';

    UVIndexValue = document.createElement('span');
    UVIndexValue.textContent = index.value;

    if (index.value <= 2) {
        UVIndexValue.classList = 'favorable';
    } else if(index.value >2 && index.value <= 8) {
        UVIndexValue.classList = 'moderate';
    } else if (index.value > 8) {
        UVIndexValue.classList = 'unfavorable';
    };

    UVIndex.appendChild(UVIndexValue);

    weatherContainer.appendChild(UVIndexValue);
};

let Day5 = function(city) {
    let key = '968c4dcdc6c9e0ccb847bf83940c5522';
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}`;

    fetch(apiUrl)
    .then(function(response) {
        response.json().then(function(data) {
            displayDay5(data);
        });
    });
};

let displayDay5 = function(weather) {
    forecastContainerEl.textContent = '';
    forecastTitle.textContent = 'Forecast for the next 5 days';

    let forecast = weather.list;
    for (let i = 5; i < forecast.length; i=i+8) {
        let dailyForecast = forecast[i];

        let forecastEl = document.createElement('div');
        forecastEl.classList = 'card bg-primary text-light m-2';

        console.log(dailyForecast);

        let forecastDate = document.createElement('h5');
        forecastDate.textContent = moment.unix(dailyForecast.dt).format('MMM D, YYYY');
        forecastDate.classList = 'card-header text-center';
        forecastEl.appendChild(forecastDate);

        let weatherImg = document.createElement('img');
        weatherImg.classList = 'card-body text-center';
        weatherImg.setAttribute('src', `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);
        forecastEl.appendChild(weatherImg);

        let tempEl = document.createElement('span');
        tempEl.classList = 'card-body text-center';
        tempEl.textContent = dailyForecast.main.temp + '°F';
        forecastEl.appendChild(tempEl);

        let humidity = document.createElement('span');
        humidity.classList = 'card-body text-center';
        humidity.textContent = dailyForecast.main.humidity + '%';
        forecastEl.appendChild(humidity);

        console.log(humidity);

        forecastContainerEl.appendChild(forecastEl);
    }
};

let oldSearch = function(oldSearch) {
    console.log(oldSearch);

    oldSearchEl = document.createElement('button');
    oldSearchEl.textContent = oldSearch;
    oldSearchEl.classList = 'd-flex w-100 btn-light border p-2';
    oldSearchEl.setAttribute('data-city', oldSearch);
    oldSearchEl.setAttribute('type', 'submit');

    pastSearchBtnEl.prepend(oldSearchEl);
};

let oldSearchHandler = function(event) {
    let city = event.target.getAttribute('data-city');
    if(city) {
        cityWeather(city);
        Day5(city);
    }
};

cityFormEl.addEventListener('submit', formHandler);
pastSearchBtnEl.addEventListener('click', oldSearchHandler);