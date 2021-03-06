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
	return ((1.8 * (kelvin - 273) + 32).toFixed(0))
}

// Gets weather with provided lat & lon
const getWeather = (lat, lon, areaQuery) => {
	fetch(baseUrl + 'lat=' + lat + '&lon=' + lon + appId + '&exclude=minutely,hourly')
		.then((response) => {
			return response.json()
		}).then((data) => {
			weather = {
				'current': data.current,
				'daily': data.daily
			}
			showCurrentWeather(weather.current, areaQuery)
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
			return getWeather(data[0].lat, data[0].lon, areaQuery)
		})
}

// append current weather data to page
const showCurrentWeather = (current, areaQuery) => {
	
	let cityInfo = document.getElementById('cityName')
	while(cityInfo.firstChild) {
		cityInfo.removeChild(cityInfo.firstChild)
	}
	let cityName = document.createElement('p')
	let date = new Date(current.dt * 1000)
	date = date.toDateString()
	let icon = document.createElement('img')
	let currentTemp = document.getElementById('currentTemp')
	let currentWind = document.getElementById('currentWind')
	let currentHumidity = document.getElementById('currentHumidity')
	let currentUV = document.getElementById('currentUV')

	cityName.textContent = areaQuery + ' ' + date
	icon.setAttribute('src', iconUrl + current.weather[0].icon + '.png')
	currentTemp.textContent = 'Temp: ' + tempConvert(current.temp)
	currentWind.textContent = 'Wind: ' + current.wind_speed
	currentHumidity.textContent = 'Humidity: ' + current.humidity
	currentUV.textContent = current.uvi

	// Add background color based on UV Index rating
	if (current.uvi < 4) {
		currentUV.style.backgroundColor = 'rgb(1, 175, 1)'
	} else if (current.uvi > 4 && current.uvi < 8) {
		currentUV.style.backgroundColor = 'yellow'
	} else {
		currentUV.style.backgroundColor = 'rgb(255, 37, 37)'
	}
	// replace old nodes if there was a previous search
	
		cityInfo.append(cityName, icon)
	
}

// Append daily foreast weather to page
const showDailyWeather = (daily) => {
	for (let i = 0; i < 5; i++) {
		let dailyCard = document.createElement('div')
		let dateEl = document.createElement('div')
		let date = new Date(daily[i].dt * 1000)
		date = date.toDateString()
		let icon = document.createElement('img')
		let temp = document.createElement('div')
		let wind = document.createElement('div')
		let humidity = document.createElement('div')
		let days = document.getElementById('days')

		dateEl.textContent = date
		icon.setAttribute('src', iconUrl + daily[i].weather[0].icon + '.png')
		temp.textContent = 'Temp: ' + tempConvert(daily[i].temp.max)
		wind.textContent = 'Wind: ' + daily[i].wind_speed
		humidity.textContent = 'Humidity: ' + daily[i].humidity
		dailyCard.append(dateEl, icon, temp, wind, humidity)
		dailyCard.setAttribute('class', 'day' + i.toString())

		// replace old nodes if there was a previous search
		if (days.childElementCount == 5) {
			days.replaceChild(dailyCard, days.children[i])
			// else, append new nodes
		} else {
			days.append(dailyCard)
		}

	}
}

// Save user search to localStorage
const saveToLocal = (city) => {
	let pastSearches
	if (!localStorage.getItem('pastSearches')) {
		pastSearches = []
	} else {
		pastSearches = localStorage.getItem('pastSearches').split(',')
	}
	if (pastSearches.indexOf(city) == -1) {
		pastSearches.push(city)
	}
	if (pastSearches.length > 5) {
		pastSearches.shift()
	}
	localStorage.setItem('pastSearches', pastSearches)
}
// Show recent searches from items in localStorage
const showPastSearches = () => {
	if (localStorage.getItem('pastSearches')) {
		let pastSearchEl = document.getElementsByTagName('ul')[0]
		let pastSearches = localStorage.getItem('pastSearches').split(',')
		for (let i = 0; i < pastSearches.length; i++) {
			let listItem = document.createElement('li')
			let link = document.createElement('a')
			listItem.append(link)
			link.textContent = pastSearches[i]
			link.setAttribute('href', '#')
			pastSearchEl.appendChild(listItem)
		}

	}
}
// Run getArea() when recent search items are clicked
const getPastSearch = () => {
	let linksList = document.getElementsByTagName('a')
	for (let i = 0; i < linksList.length; i++) {
		let searchTerm = linksList[i].textContent
		linksList[i].addEventListener('click', () => {
			getArea(searchTerm)
		})
	}
}

// Show past searches once document is loaded
document.onreadystatechange = () => {
	if (document.readyState === 'complete') {
		showPastSearches()
		getPastSearch()
	}
}

// Start the API calls once user presses submit
const form = document.getElementById('form')
const inputWord = document.querySelector('input[type="text"]')

form.addEventListener('submit', (e) => {
	e.preventDefault()
	areaQuery = inputWord.value
	getArea(areaQuery)
	saveToLocal(areaQuery)
}
)