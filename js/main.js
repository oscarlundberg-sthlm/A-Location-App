let bgImage = document.getElementById("bg-image");
let dynContentElement = document.getElementById("dynamic-content");
let viewHeight = window.innerHeight;
let viewWidth = window.innerWidth;


(async function() {
    try {
        let location = await getLocation();
        let geocodeResponse = await fetch(`https://geocode.xyz/${location.coords.latitude},${location.coords.longitude}?json=1`);
        let geocodeData = await geocodeResponse.json();
        let openWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&lang=sv&appid=5a39bada217f9211d605a4f5bca8967a`);
        let openWeatherData = await openWeatherResponse.json();
        let mapResponse = await fetch(`https://www.mapquestapi.com/staticmap/v5/map?key=BUxi0PpSE6qtGnPR8YMpoFDq3fNU7iLA&center=${location.coords.latitude},${location.coords.longitude}&type=sat&zoom=13&size=${viewWidth},${viewHeight}`);
        let mapURL = await mapResponse.url;
        
        bgImage.style.backgroundImage = `url(${mapURL})`;
        let dynHTML = "";
        dynHTML += `<h1>${geocodeData.city.toLowerCase()}</h1>`;
        dynHTML += `<p>${geocodeData.elevation}m över havet</p>`;
        dynHTML += `<p>Aktuell temperatur: ${openWeatherData.main.temp} celsius</p>`;
        dynHTML += `<p>Känns som: ${openWeatherData.main.feels_like} celsius</p>`;
        dynContentElement.innerHTML = dynHTML;
    } catch (error) {
        console.log(error);
    }
})(getLocation);

function getLocation() {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve(position);
        });
    })
}