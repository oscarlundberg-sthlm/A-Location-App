let viewHeight = window.innerHeight;
let viewWidth = window.innerWidth;

let bgImage = document.getElementById("bg-image");
let preloader = document.getElementById("preloader");

let contentBox = document.getElementById("content-box");

let currentAreaOutput = document.getElementById("current-area-output");
let currentTempOutput = document.getElementById("current-temp-output");
let feelsLikeOutput = document.getElementById("feels-like-output");
let weatherDescriptionOutput = document.getElementById("weather-description-output");
let weatherIconOutput = document.getElementById("weather-icon-output");

let currentLocation;
let latitude;
let longitude;

$(contentBox).hide();
$(bgImage).hide();
$(preloader).hide();

let locationSelector = document.getElementById("location-selector");
let locationOptions = locationSelector.options;

locationSelector.addEventListener("change", () => {
    let chosenIndex = locationSelector.selectedIndex;
    if (chosenIndex === 0) {
        $(preloader).fadeOut();
        return;
    } else {
        let selectedLocation = locationOptions[chosenIndex].text;
        $(contentBox).hide();
        $(bgImage).hide();
        $(preloader).fadeIn();
        
        loadContent(selectedLocation);
    }
});

async function loadContent(selectedLocation) {
    try {
        switch (selectedLocation) {
            case "Din plats ➤":
                currentLocation = await getLocation();
                latitude = currentLocation.coords.latitude;
                longitude = currentLocation.coords.longitude;
                break;
            case "New York":
                latitude = 40.714272;
                longitude = -74.005966;
                break;
            case "Engelberg":
                latitude = 46.820047;
                longitude = 8.402868;
                break;
            case "Buenos Aires":
                latitude = -34.613152;
                longitude = -58.377232;
                break; 
            default:
                break;
        }
        
        let openWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&cnt=1&units=metric&lang=sv&appid=5a39bada217f9211d605a4f5bca8967a`);
        let openWeatherData = await openWeatherResponse.json();
        currentAreaOutput.innerHTML = openWeatherData.list[0].name.toLowerCase();
        currentTempOutput.innerHTML = `${Math.round(openWeatherData.list[0].main.temp)}°`;
        feelsLikeOutput.innerHTML = `${Math.round(openWeatherData.list[0].main.feels_like)}°`;
        
        let mapResponse = await fetch(`https://www.mapquestapi.com/staticmap/v5/map?key=BUxi0PpSE6qtGnPR8YMpoFDq3fNU7iLA&center=${latitude},${longitude}&type=light&zoom=13&size=${viewWidth},${viewHeight}`);
        let mapData = await mapResponse.blob();
        let mapURL = await URL.createObjectURL(mapData);
        bgImage.style.backgroundImage = `url(${mapURL})`;
        
        let weatherType = openWeatherData.list[0].weather[0].main;
        let weatherIcon = selectWeatherIcon(weatherType);
        weatherIconOutput.src = weatherIcon;
        
        $(preloader).fadeOut("slow", () => {
            $(bgImage).fadeIn("slow", () => {
                $(contentBox).show("drop");
            });
        });
    } catch (error) {
        console.log(error);
    }
}

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