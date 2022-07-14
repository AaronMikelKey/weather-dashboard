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

// API url to find area ID so we can get the latitude and longitude
const areaIdUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='

// API url for weather data
const baseUrl = 'https://api.openweathermap.org/data/2.5/onecall?'

// API url for icon
const iconUrl = 'https://openweathermap.org/img/w/'  // url for icons, add .png after icon

// Convert K to F, remove trailing zeroes
let tempConvert = (kelvin) => {
	return ((1.8*(kelvin-273) + 32).toFixed(0))
	}

// Gets weather with provided lat & lon
const getWeather = (lat, lon) => {
	fetch(baseUrl + 'lat=' + lat + '&lon=' + lon + appId + '&exclude=minutely,hourly') 
		.then((response) => {
			return response.json()
		}).then((data) => {
			weather = {
			'current': data.current,
			'daily': data.daily
		}
		showCurrentWeather(weather.current)
		showDailyWeather(weather.daily)
		})
}

// get area ID to append to baseUrl
const getArea = (areaQuery) => {
	fetch(areaIdUrl + areaQuery + appId)
		.then((response) => {
			return response.json()
		})
		.then((data) => {
			lat = data[0].lat
			lon = data[0].lon
			return getWeather(data[0].lat, data[0].lon)
		})
	}

// append current weather data to page
const showCurrentWeather = (current) => {
	let cityName = document.getElementById('cityName')
	let icon = document.createElement('img')
	let currentTemp = document.getElementById('currentTemp')
	let currentWind = document.getElementById('currentWind')
	let currentHumidity = document.getElementById('currentHumidity')
	let currentUV = document.getElementById('currentUV')
	
	cityName.textContent = areaQuery
	cityName.appendChild(icon)
	icon.setAttribute('src', iconUrl + current.weather[0].icon + '.png')
	currentTemp.textContent = 'Temp: ' + tempConvert(current.temp)
	currentWind.textContent = 'Wind: ' + current.wind_speed
	currentHumidity.textContent = 'Humidity: ' + current.humidity
	currentUV.textContent = current.uvi

	// Add background color based on UV Index rating
	if (current.uvi < 4) {
		currentUV.style.backgroundColor = 'rgb(1, 175, 1)'
	} else if (current.uvi > 4 && current.uvi < 8) {
		currentUV.style.backgroundColor =  'yellow'
	} else {
		currentUV.style.backgroundColor = 'rgb(255, 37, 37)'
	}
}

// Append daily foreast weather to page
const showDailyWeather = (daily) => {
	for (let i=0;i<5;i++) {
		let dailyCard = document.createElement('div')
		let icon = document.createElement('img')
		let temp = document.createElement('div')
		let wind = document.createElement('div')
		let humidity = document.createElement('div')
		let days = document.getElementById('days')

		icon.setAttribute('src', iconUrl + daily[i].weather[0].icon + '.png')
		temp.textContent = 'Temp: ' + tempConvert(daily[i].temp.max)
		wind.textContent = 'Wind: ' + daily[i].wind_speed
		humidity.textContent = 'Humidity: ' + daily[i].humidity
		dailyCard.append(icon, temp, wind, humidity)

		// replace old nodes if there was a previous search
		if (days.childElementCount == 5) {
			days.replaceChild(dailyCard, days.children[i])
			// else, append new nodes
			} else {
				days.append(dailyCard)
			} 
		
	}
}

// TODO: Add function to save user search to localStorage
const saveToLocal = (city) => {
	let pastSearches
	if (!localStorage.getItem('pastSearches')) {
		pastSearches = []
	} else {
		pastSearches = Array(localStorage.getItem('pastSearches'))
		console.log(pastSearches)
	}
	if (pastSearches.indexOf(city) == -1) {
		pastSearches.push(city)
	}
	localStorage.setItem('pastSearches', pastSearches)
}
// TODO: Add function to show recent searches from items in localStorage

// TODO: Add function to run getArea() when recent search items are clicked

// Start the process once user presses submit
const form = document.getElementById('form')
const inputWord = document.querySelector('input[type="search"]')

form.addEventListener('submit', (e) => {
	e.preventDefault()
	areaQuery = inputWord.value
	getArea(areaQuery)
	saveToLocal(areaQuery)
}
)