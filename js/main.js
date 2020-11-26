let bgImage = document.getElementById("bg-image");
let viewHeight = window.innerHeight;
let viewWidth = window.innerWidth;
let preloader = document.getElementById("preloader");
let contentBox = document.getElementById("content-box");
let currentAreaOutput = document.getElementById("current-area-output");
let altitudeOutput = document.getElementById("altitude-output");
let currentTempOutput = document.getElementById("current-temp-output");
let feelsLikeOutput = document.getElementById("feels-like-output");
let weatherDescriptionOutput = document.getElementById("weather-description-output");
let weatherIconOutput = document.getElementById("weather-icon-output");


(async function() {
    try {
        let location = await getLocation();

        let geocodeResponse = await fetch(`https://geocode.xyz/${location.coords.latitude},${location.coords.longitude}?json=1`);
        let geocodeData = await geocodeResponse.json();
        
        let openWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&lang=sv&appid=5a39bada217f9211d605a4f5bca8967a`);
        let openWeatherData = await openWeatherResponse.json();

        let weatherType = openWeatherData.weather[0].main;
        let weatherIcon = selectWeatherIcon(weatherType);
        
        let mapResponse = await fetch(`https://www.mapquestapi.com/staticmap/v5/map?key=BUxi0PpSE6qtGnPR8YMpoFDq3fNU7iLA&center=${location.coords.latitude},${location.coords.longitude}&type=light&zoom=13&size=${viewWidth},${viewHeight}`);
        let mapURL = await mapResponse.url;
        bgImage.style.backgroundImage = `url(${mapURL})`;
        
        currentAreaOutput.innerHTML = geocodeData.city.toLowerCase();
        altitudeOutput.innerHTML = geocodeData.elevation;
        currentTempOutput.innerHTML = `${Math.round(openWeatherData.main.temp)}°`;
        feelsLikeOutput.innerHTML = `${Math.round(openWeatherData.main.feels_like)}°`;
        weatherIconOutput.src = weatherIcon;

        preloader.classList.toggle("hide");
        contentBox.classList.toggle("hide");
    } catch (error) {
        console.log(error);
    }
})(getLocation, selectWeatherIcon);

function getLocation() {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve(position);
        });
    })
}

function selectWeatherIcon(weatherType) {
    switch (weatherType) {
        case "Clouds":
            return "http://openweathermap.org/img/wn/03d@2x.png";
        case "Clear":
            return "http://openweathermap.org/img/wn/01d@2x.png";
        case "Fog":
            return "http://openweathermap.org/img/wn/50d@2x.png";
        case "Haze":
            return "http://openweathermap.org/img/wn/50d@2x.png";
        case "Mist":
            return "http://openweathermap.org/img/wn/50d@2x.png";
        case "Snow":
            return "http://openweathermap.org/img/wn/13d@2x.png";
        case "Rain":
            return "http://openweathermap.org/img/wn/10d@2x.png";
        case "Drizzle":
            return "http://openweathermap.org/img/wn/09d@2x.png";
        case "Thunderstorm":
            return "http://openweathermap.org/img/wn/11d@2x.png";
    
        default:
            return "";
    }
}