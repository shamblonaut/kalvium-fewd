/**
 * WeatherApp Constructor
 * @param {string} apiKey - OpenWeatherMap API Key
 */
function WeatherApp(apiKey) {
  this.apiKey = apiKey;

  this.apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  this.forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

  this.searchBtn = document.getElementById("search-btn");
  this.cityInput = document.getElementById("city-input");
  this.weatherDisplay = document.getElementById("weather-display");

  this.init();
}

/**
 * Initialize the application
 */
WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

  this.cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      this.handleSearch();
    }
  });

  this.showWelcome();
};

/**
 * Display welcome message
 */
WeatherApp.prototype.showWelcome = function () {
  const welcomeHTML = `
    <div class="welcome-message">
      <h3>🌍 Welcome to SkyFetch</h3>
      <p>Enter a city name to get started!</p>
    </div>
  `;

  this.weatherDisplay.innerHTML = welcomeHTML;
};

/**
 * Handle the search logic
 */
WeatherApp.prototype.handleSearch = function () {
  const city = this.cityInput.value.trim();

  if (!city) {
    this.showError("Please enter a city name.");
    return;
  }

  if (city.length < 2) {
    this.showError("City name is too short.");
    return;
  }

  this.getWeather(city);
};

/**
 * Fetch weather data (current and forecast)
 */
WeatherApp.prototype.getWeather = async function (city) {
  this.showLoading();

  this.searchBtn.disabled = true;
  this.searchBtn.textContent = "Searching...";

  try {
    const [currentResponse, forecastData] = await Promise.all([
      axios.get(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`),
      this.getForecast(city),
    ]);

    this.displayWeather(currentResponse.data);
    this.displayForecast(forecastData);
  } catch (error) {
    console.error("Error:", error);
    if (error.response && error.response.status === 404) {
      this.showError("City not found. Please check the spelling.");
    } else {
      this.showError("Something went wrong. Please try again.");
    }
  } finally {
    this.searchBtn.disabled = false;
    this.searchBtn.textContent = "🔍";
  }
};

/**
 * Fetch 5-day forecast data
 */
WeatherApp.prototype.getForecast = async function (city) {
  const url = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

/**
 * Filter 40 data points to get one per day at noon
 */
WeatherApp.prototype.processForecastData = function (data) {
  const dailyForecasts = data.list.filter((item) => {
    return item.dt_txt.includes("12:00:00");
  });
  return dailyForecasts.slice(0, 5);
};

/**
 * Display current weather result
 */
WeatherApp.prototype.displayWeather = function (data) {
  const cityName = data.name;
  const temperature = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const weatherHTML = `
    <div class="weather-info">
      <h2 class="city-name">${cityName}</h2>
      <img src="${iconUrl}" alt="${description}" class="weather-icon">
      <div class="temperature">${temperature}°C</div>
      <p class="description">${description}</p>
    </div>
  `;

  this.weatherDisplay.innerHTML = weatherHTML;
  this.cityInput.focus();
};

/**
 * Display 5-day forecast
 */
WeatherApp.prototype.displayForecast = function (data) {
  const dailyForecasts = this.processForecastData(data);

  const forecastHTML = dailyForecasts
    .map((day) => {
      const date = new Date(day.dt * 1000);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const temp = Math.round(day.main.temp);
      const description = day.weather[0].description;
      const icon = day.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      return `
            <div class="forecast-card">
                <p class="forecast-day">${dayName}</p>
                <img src="${iconUrl}" alt="${description}" class="forecast-icon">
                <p class="forecast-temp">${temp}°C</p>
                <p class="forecast-desc">${description}</p>
            </div>
        `;
    })
    .join("");

  const forecastSection = `
        <div class="forecast-section">
            <h3 class="forecast-title">5-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastHTML}
            </div>
        </div>
    `;

  this.weatherDisplay.innerHTML += forecastSection;
};

/**
 * Show loading state
 */
WeatherApp.prototype.showLoading = function () {
  const loadingHTML = `
    <div class="loading-container">
        <div class="spinner"></div>
        <p>Fetching weather data...</p>
    </div>
  `;

  this.weatherDisplay.innerHTML = loadingHTML;
};

/**
 * Show error message
 */
WeatherApp.prototype.showError = function (message) {
  const errorHTML = `
    <div class="error-message">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Weather Unavailable</h3>
        <p class="error-text">${message}</p>
    </div>
  `;

  this.weatherDisplay.innerHTML = errorHTML;
};

// Application Initialization
const API_KEY = "a33b646573a0a4df91c35565f3f60efa";
const app = new WeatherApp(API_KEY);
