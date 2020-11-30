let body = document.querySelector("body");

let viewHeight = window.innerHeight;
let viewWidth = window.innerWidth;

let locationSelector = document.getElementById("location-selector");
let locationOptions = locationSelector.options;

let bgImage = document.getElementById("bg-image");
let preloader = document.getElementById("preloader");
let arrow = document.getElementById("arrow");

let contentBox = document.getElementById("content-box");

let currentAreaOutput = document.getElementById("current-area-output");
let currentTempOutput = document.getElementById("current-temp-output");
let feelsLikeOutput = document.getElementById("feels-like-output");
let weatherDescriptionOutput = document.getElementById("weather-description-output");
let weatherIconOutput = document.getElementById("weather-icon-output");
let placesNearbyOutput = document.getElementById("places-nearby");

let currentLocation, latitude, longitude;



$(contentBox).hide();
$(bgImage).hide();
$(preloader).hide();

locationSelector.addEventListener("change", () => {
    let chosenIndex = locationSelector.selectedIndex;
    if (chosenIndex === 0) {
        $(preloader).fadeOut();
        return;
    } else {
        let selectedLocation = locationOptions[chosenIndex].value;
        $(arrow).hide();
        $(contentBox).hide();
        $(bgImage).hide();
        $(preloader).fadeIn();

        loadContent(selectedLocation);
    }
});

async function loadContent(selectedLocation) {
    try {
        switch (selectedLocation) {
            case "current-location":
                currentLocation = await getLocation();
                latitude = currentLocation.coords.latitude;
                longitude = currentLocation.coords.longitude;
                break;
            case "new-york":
                latitude = 40.714272;
                longitude = -74.005966;
                break;
            case "engelberg":
                latitude = 46.820047;
                longitude = 8.402868;
                break;
            case "buenos-aires":
                latitude = -34.613152;
                longitude = -58.377232;
                break; 
            default:
                break;
        }

        const promise1 = wikipedia(latitude, longitude);
        const promise2 = generateMap(latitude, longitude);
        const promise3 = weather(latitude, longitude);
        await promise1;
        await promise2;
        await promise3;

        body.style.backgroundColor = `hsl(${backgroundHue},100%,50%)`;
        
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

async function wikipedia(latitude, longitude) {
    try {
        let wikiResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${latitude}|${longitude}&format=json&origin=*`);
        let wikiData = await wikiResponse.json();
        let placesNearbyArray = wikiData.query.geosearch;
        let placesTextAndImageHTML = "";
        let wikiImageDiv = "";
        let wikiImageUrl = "";
        for (place of placesNearbyArray) {
            let wikiTextResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&exlimit=1&titles=${place.title}&explaintext=1&formatversion=2&format=json&origin=*`);
            let wikiTextData = await wikiTextResponse.json();
            let wikiText = wikiTextData.query.pages[0].extract;
            let checkForImagesResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${place.title}&pithumbsize=150&format=json&origin=*`);
            let checkForImagesData = await checkForImagesResponse.json();
            let imagesArray = Object.values(checkForImagesData.query.pages);
            if (typeof imagesArray[0].thumbnail !== "undefined") {
                wikiImageUrl = imagesArray[0].thumbnail.source;
                wikiImageDiv = `<img src="${wikiImageUrl}" alt="${place.title}">`;
            } else {
                wikiImageUrl = "";
                wikiImageDiv = "";
            }
            placesTextAndImageHTML += `
            <div class="a-place-nearby">
                <h3>${place.title.toLowerCase()}</h3>
                <div>
                    <p>${wikiText}</p>
                    ${wikiImageDiv}
                </div>
            </div>
            `;
        }
        placesNearbyOutput.innerHTML = placesTextAndImageHTML;
    } catch (error) {
        console.log(error);
    }
};

async function generateMap(latitude, longitude) {
    try {
        let mapResponse = await fetch(`https://www.mapquestapi.com/staticmap/v5/map?key=BUxi0PpSE6qtGnPR8YMpoFDq3fNU7iLA&center=${latitude},${longitude}&type=light&zoom=13&size=${viewWidth},${viewHeight}`);
        let mapData = await mapResponse.blob();
        let mapURL = await URL.createObjectURL(mapData);
        bgImage.style.backgroundImage = `url(${mapURL})`;
    } catch (error) {
        console.log(error);
    }
}

async function weather(latitude, longitude) {
    try {
        let openWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&cnt=1&units=metric&lang=sv&appid=5a39bada217f9211d605a4f5bca8967a`);
        let openWeatherData = await openWeatherResponse.json();
        currentAreaOutput.innerHTML = openWeatherData.list[0].name.toLowerCase();
        let currentTemp = Math.round(openWeatherData.list[0].main.temp);
        let feelsLike = Math.round(openWeatherData.list[0].main.feels_like);
        currentTempOutput.innerHTML = `${currentTemp}°c`;
        feelsLikeOutput.innerHTML = `${feelsLike}°c`;
        
        calcHue (currentTemp);
        
        let weatherType = openWeatherData.list[0].weather[0].main;
        let weatherIcon = selectWeatherIcon(weatherType);
        weatherIconOutput.src = weatherIcon;
    } catch (error) {
        console.log(error);
    }
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

let backgroundHue;
function calcHue (temp) {
    if (temp > 30) {
        backgroundHue = 0;
    } else if (temp < -10) {
        backgroundHue = 230;
    } else {
        backgroundHue = (-5.75 * temp) + 172.5;
    }
}