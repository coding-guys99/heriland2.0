let currentWeatherCity =
  localStorage.getItem("heriland-weather-city") || "Kuching";

const WEATHER_CITIES = [
  "Kuching",
  "Sibu",
  "Miri",
  "Bintulu",
  "Mukah",
  "Sarikei",
  "Sri Aman",
  "Kapit",
  "Limbang",
  "Lawas",
  "Serian"
];

async function loadWeather(city = currentWeatherCity) {
  currentWeatherCity = city;
  localStorage.setItem("heriland-weather-city", city);

  const API_KEY = "2bf2a548cb076cf7ea251d5cc6d4d8db";

  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city},MY&units=metric&appid=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || !data.main) {
      console.error("Weather API error:", data);
      return;
    }

    const temp = Math.round(data.main.temp);
    const icon = data.weather?.[0]?.main || "Clear";

    renderWeather(temp, icon, city);
  } catch (err) {
    console.error("Weather error:", err);
  }
}

function renderWeather(temp, icon, city) {
  const weatherBox = document.getElementById("weather-box");
  if (!weatherBox) return;

  let emoji = "☀️";
  if (icon.includes("Rain")) emoji = "🌧️";
  if (icon.includes("Cloud")) emoji = "☁️";
  if (icon.includes("Thunder")) emoji = "⛈️";

  weatherBox.innerHTML = `
    <button class="weather-main" onclick="toggleWeatherCities(event)">
      <div class="weather-temp">${emoji} ${temp}°</div>
      <div class="weather-city">${city} ▾</div>
    </button>

    <div class="weather-dropdown" id="weather-dropdown">
      ${WEATHER_CITIES.map(item => `
        <button onclick="selectWeatherCity('${item}')">
          ${item}
        </button>
      `).join("")}
    </div>
  `;
}

function toggleWeatherCities(event) {
  event.stopPropagation();

  const dropdown = document.getElementById("weather-dropdown");
  if (!dropdown) return;

  dropdown.classList.toggle("active");
}

function selectWeatherCity(city) {
  loadWeather(city);
}

document.addEventListener("click", function () {
  document
    .getElementById("weather-dropdown")
    ?.classList.remove("active");
});