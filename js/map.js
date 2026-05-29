let pickerMap = null;

let pickerSelected = {
  lat: 1.5533,
  lng: 110.3592,
  address: "Kuching, Sarawak"
};

function openMap(url) {
  window.open(url, "_blank");
}

function openMiniMap() {
  lockBodyScroll();

  const mapSheet = document.createElement("div");

  mapSheet.className = "map-picker-sheet";
  mapSheet.id = "mini-map-sheet";

  mapSheet.innerHTML = `
    <div class="map-picker-top">

      <button onclick="closeMiniMap()">
        ${t("cancel")}
      </button>

      <div>
        ${t("pickLocation")}
      </div>

      <button onclick="confirmMiniMap()">
        ${t("confirm")}
      </button>

    </div>

    <div id="real-map" class="real-map"></div>

    <div class="map-center-pin">
      <svg viewBox="0 0 24 24">
        <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11z"/>
        <circle cx="12" cy="10" r="2.4"/>
      </svg>
    </div>

    <div class="map-address-card">
      <div class="map-address-label">
        ${t("currentLocation")}
      </div>

      <div id="picked-address">
        ${t("moveMapToChoose")}
      </div>
    </div>
  `;

  document.body.appendChild(mapSheet);
  document.body.classList.add("map-open");

  setTimeout(initPickerMap, 100);
}

function initPickerMap() {
  pickerMap = L.map("real-map", {
    zoomControl: false
  }).setView([pickerSelected.lat, pickerSelected.lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(pickerMap);

  pickerMap.on("moveend", async function () {
    const center = pickerMap.getCenter();

    pickerSelected.lat = center.lat;
    pickerSelected.lng = center.lng;

    await reverseGeocode(center.lat, center.lng);
  });

  reverseGeocode(pickerSelected.lat, pickerSelected.lng);
}

async function reverseGeocode(lat, lng) {
  const addressBox = document.getElementById("picked-address");
  if (!addressBox) return;

  addressBox.textContent = t("findingAddress");

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

    const res = await fetch(url);
    const data = await res.json();

    pickerSelected.address =
      data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    addressBox.textContent = pickerSelected.address;
  } catch (err) {
    pickerSelected.address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    addressBox.textContent = pickerSelected.address;
  }
}

function confirmMiniMap() {
  const input = document.getElementById("shop-address");

  if (input) {
    input.value = pickerSelected.address;
    input.dataset.lat = pickerSelected.lat;
    input.dataset.lng = pickerSelected.lng;
  }

  closeMiniMap();
}

function closeMiniMap(force = false) {
  const sheet = document.getElementById("mini-map-sheet");

  if (pickerMap) {
    pickerMap.remove();
    pickerMap = null;
  }

  if (sheet) {
    sheet.remove();
  }

  document.body.classList.remove("map-open");

  if (!force) {
    unlockBodyScroll();
  }
}

function scrollToMap() {
  const mapSection = document.getElementById("map-section");
  if (!mapSection) return;

  mapSection.scrollIntoView({
    behavior: "smooth"
  });
}