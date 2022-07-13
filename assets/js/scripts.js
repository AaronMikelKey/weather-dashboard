/* 
Acceptance Criteria

GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/

let lat, lon, areaQuery, /*query params */ weather //weather objects
const appId = '&limit=5&appid=5929c2bed7052947ef72a623c4f08aa3'

areaQuery = 'London'
// API url to find area ID so we can get the latitude and longitude
let areaIdUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + areaQuery + appId

// API url for weather data
let baseUrl = 'https://api.openweathermap.org/data/2.5/onecall?'

// Convert K to F, remove trailing zeroes
let tempConvert = (kelvin) => {
	return ((1.8*(kelvin-273) + 32).toFixed(0))
	}

// Gets weather with provided lat & lon
const getWeather = (lat, lon) => {
	fetch(baseUrl + 'lat=' + lat + '&lon=' + lon + appId) 
		.then((response) => {
			return response.json()
		}).then((data) => {
			weather = {
			'current': data.current,
			'daily': data.daily
		}
		showWeather(weather.current, weather.daily)
		console.log(weather)
		})
}

// get area ID to append to baseUrl
const getArea = () => {
	fetch(areaIdUrl)
		.then((response) => {
			return response.json()
		})
		.then((data) => {
			console.log(data[0].lat,data[0].lon)
			lat = data[0].lat
			lon = data[0].lon
			return getWeather(data[0].lat, data[0].lon)
		})
	}


getArea()
// append data to page

const showWeather = (current, daily) => {
	let cityName = document.getElementById('cityName')
	let currentTemp = document.getElementById('currentTemp')
	let currentWind = document.getElementById('currentWind')
	let currentHumidity = document.getElementById('currentHumidity')
	let currentUV = document.getElementById('currentUV')
	let dailyDivs = document.getElementsByClassName('days')
	cityName.textContent = areaQuery
	currentTemp.textContent = 'Temp: ' + tempConvert(current.temp)
	currentWind.textContent = 'Wind: ' + current.wind_speed
	currentHumidity.textContent = 'Humidity: ' + current.humidity
	currentUV.textContent = 'UV Index: ' + current.uvi
	for (let i=0;i<5;i++) {
		dailyDivs[i].append(tempConvert(daily[i].temp.max))
	}
}