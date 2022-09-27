function date() {
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  let date = now.getDate();
  if (date <= 9) {
    date = "0" + date;
  }

  let year = now.getFullYear();
  let hours = now.getHours();
  let minute = now.getMinutes();
  if (minute <= 9) {
    minute = "0" + minute;
  }
  let todaysDate = document.querySelector("#todaysDate");
  todaysDate.innerHTML = `Last updated: ${day}, ${date} ${month} ${year}, ${hours}.${minute}`;
}
date();

function forecastMonth(timestamp) {
  let days = new Date(timestamp * 1000);
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[days.getMonth()];
  return month;
}
function forecastDate(timestamp) {
  let days = new Date(timestamp * 1000);
  let day = days.getDay();
  let daysAbbreviated = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return daysAbbreviated[day];
}
function forecastDays(timestamp) {
  let days = new Date(timestamp * 1000);
  let day = days.getDate();
  return day;
}
function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=hourly,current,minutely,alerts&units=metric&appid=535cacbb3f8a0df0aeb4790235b9541f`;
  axios.get(apiUrl).then(displayForecast);
}
function showCurrentlyWeather(response) {
  let cityCurrentlyTemp = Math.round(response.data.main.temp);
  let currentlyTemperature = document.querySelector("#currentlyTemperature");
  currentlyTemperature.innerHTML = `${cityCurrentlyTemp}°C`;
  let wind = Math.round(response.data.wind.speed);
  let currentlyWind = document.querySelector("#wind");
  currentlyWind.innerHTML = `Wind: ${wind} m/s`;
  let description = response.data.weather[0].description;
  let currentlyDescription = document.querySelector("#description");
  currentlyDescription.innerHTML = `${description}`;
  let mainImg = document.querySelector("#mainImg");
  mainImg.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
}

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  let currentlyCity = document.querySelector("#currentlyCity");
  currentlyCity.innerHTML = `${searchInput.value}`;

  let currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&units=metric&appid=1d45b6c902947dbfd4192037ee19cf1a`;
  axios.get(currentApiUrl).then(showCurrentlyWeather);
}
let form = document.querySelector("#searching-form");
form.addEventListener("submit", search);

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiGeoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1d45b6c902947dbfd4192037ee19cf1a&units=metric`;
  axios.get(apiGeoUrl).then(showPositionWeatherInformation);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}
let geolocation = document.querySelector("#geolocation");
geolocation.addEventListener("click", getCurrentPosition);

function showPositionWeatherInformation(response) {
  let cityName = response.data.name;
  let currentlyCity = document.querySelector("#currentlyCity");
  currentlyCity.innerHTML = `${cityName}`;
  showCurrentlyWeather(response);
}
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
              <div class="days">
                <div id="forecastTodaysDay">${forecastDate(
                  forecastDay.dt
                )}</div>
                <div class="date" id="forecastTodaysDate">${forecastDays(
                  forecastDay.dt
                )} ${forecastMonth(forecastDay.dt)}</div>
                <span class="temperature" id="temperature-max">${Math.round(
                  forecastDay.temp.max
                )}</span>
                <span class="temperature" id="temperature-min">- ${Math.round(
                  forecastDay.temp.min
                )} °C</span>
                <div class="img">
                  <img
                    id="forecastImg"
                    src="http://openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon
                    }@2x.png"
                    width="90"
                    height="96"
                  />
                </div>
                <div class="information" id="forecastInformation">${
                  forecastDay.weather[0].description
                }</div>
              </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
