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
  this.recentSearchesSection = document.getElementById(
    "recent-searches-section",
  );
  this.recentSearchesContainer = document.getElementById(
    "recent-searches-container",
  );

  this.recentSearches = [];
  this.maxRecentSearches = 5;

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

  const clearBtn = document.getElementById("clear-history-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", this.clearHistory.bind(this));
  }

  this.loadRecentSearches();
  this.loadLastCity();
};

/**
 * Display welcome message
 */
WeatherApp.prototype.showWelcome = function () {
  const welcomeHTML = `
    <div class="welcome-message">
      <h3>🌍 Welcome to SkyFetch</h3>
      <p>Search for a city to get started!</p>
      <p style="font-size: 0.9rem; color: #888; margin-top: 10px;">
        Try: London, Paris, Tokyo, or New York
      </p>
    </div>
  `;

  this.weatherDisplay.innerHTML = welcomeHTML;
};

/**
 * Load recent searches from localStorage
 */
WeatherApp.prototype.loadRecentSearches = function () {
  const saved = localStorage.getItem("recentSearches");

  if (saved) {
    try {
      this.recentSearches = JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing recent searches:", e);
      this.recentSearches = [];
    }
  }

  this.displayRecentSearches();
};

/**
 * Save a new search to the list
 * @param {string} city - The city name to save
 */
WeatherApp.prototype.saveRecentSearch = function (city) {
  const cityName = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  const index = this.recentSearches.indexOf(cityName);
  if (index > -1) {
    this.recentSearches.splice(index, 1);
  }

  this.recentSearches.unshift(cityName);

  if (this.recentSearches.length > this.maxRecentSearches) {
    this.recentSearches.pop();
  }

  localStorage.setItem("recentSearches", JSON.stringify(this.recentSearches));

  this.displayRecentSearches();
};

/**
 * Display recent searches as buttons
 */
WeatherApp.prototype.displayRecentSearches = function () {
  this.recentSearchesContainer.innerHTML = "";

  if (this.recentSearches.length === 0) {
    this.recentSearchesSection.style.display = "none";
    return;
  }
  this.recentSearchesSection.style.display = "block";

  this.recentSearches.forEach((city) => {
    const btn = document.createElement("button");
    btn.className = "recent-search-btn";
    btn.textContent = city;

    btn.addEventListener("click", () => {
      this.cityInput.value = city;
      this.getWeather(city);
    });

    this.recentSearchesContainer.appendChild(btn);
  });
};

/**
 * Load the last searched city on startup
 */
WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    this.getWeather(lastCity);
  } else {
    this.showWelcome();
  }
};

/**
 * Clear search history
 */
WeatherApp.prototype.clearHistory = function () {
  if (confirm("Clear all recent searches?")) {
    this.recentSearches = [];
    localStorage.removeItem("recentSearches");
    this.displayRecentSearches();
  }
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

    this.saveRecentSearch(city);
    localStorage.setItem("lastCity", city);
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

const app = new WeatherApp(CONFIG.API_KEY);
