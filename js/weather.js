async function loadWeather(city = "Kuching") {

  const API_KEY = "2bf2a548cb076cf7ea251d5cc6d4d8db";

  const url = `
    https://api.openweathermap.org/data/2.5/weather
    ?q=${city},MY
    &units=metric
    &appid=${API_KEY}
  `;

  try {

    const res = await fetch(url);
    const data = await res.json();

    const temp =
      Math.round(data.main.temp);

    const icon =
      data.weather[0].main;

    renderWeather(temp, icon, city);

  } catch (err) {

    console.error(err);
  }
}

function renderWeather(temp, icon, city) {

  const weatherBox =
    document.getElementById("weather-box");

  if (!weatherBox) return;

  let emoji = "☀️";

  if (icon.includes("Rain")) emoji = "🌧️";
  if (icon.includes("Cloud")) emoji = "☁️";
  if (icon.includes("Thunder")) emoji = "⛈️";

  weatherBox.innerHTML = `
    <div class="weather-temp">
      ${emoji} ${temp}°
    </div>

    <div class="weather-city">
      ${city}
    </div>
  `;
}