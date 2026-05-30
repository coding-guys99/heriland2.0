function openShopMenu(foodIndex, shopIndex, event) {
  event.stopPropagation();

  closeShopMenu();

  const food = foods[foodIndex];
  const shop = food.recommends[shopIndex];

  const menu = document.createElement("div");

  menu.className = "shop-menu";
  menu.id = "shop-menu";

  menu.innerHTML = `
    <div class="shop-menu-card">

      <div class="shop-menu-handle"></div>

      <div class="shop-menu-title">
        ${shop.name}
      </div>

      <div class="shop-menu-area">
        📍 ${shop.area}
      </div>

      <p class="shop-menu-note">
        ${shop.note || ""}
      </p>

      <p class="shop-menu-note">
        ${renderShopHours(shop)}
      </p>

      <button onclick="openMap('${shop.map}')">
        ${t("openMap")}
      </button>

      <button onclick="callShop('${shop.phone}')">
        ${t("call")}
      </button>

      <button onclick="closeShopMenu()">
        ${t("close")}
      </button>

    </div>
  `;

  document.body.appendChild(menu);

  setTimeout(() => {
    menu.classList.add("active");
  }, 10);
}

function closeShopMenu(force = false) {
  const menu = document.getElementById("shop-menu");

  if (menu) {
    menu.classList.remove("active");

    setTimeout(() => menu.remove(), 250);
  }

  if (!force) {
    unlockBodyScroll();
  }
}

function openAddShop() {
  closeAllSheets();
  lockBodyScroll();

  const menu = document.createElement("div");

  menu.className = "shop-menu active";
  menu.id = "add-shop-menu";

  menu.innerHTML = `
    <div class="shop-menu-card">

      <div class="shop-menu-handle"></div>

      <div class="shop-menu-title">
        ${t("addShop")}
      </div>

      <select id="shop-parent">

        ${foods.map((item, index) => `
          <option value="${index}">
            ${item.name}
          </option>
        `).join("")}

      </select>

<select id="shop-category">

  <option value="Restaurant">
    ${t("filter_restaurant")}
  </option>

  <option value="Cafe">
    ${t("filter_cafe")}
  </option>

  <option value="Kopitiam">
    ${t("category_kopitiam")}
  </option>

  <option value="Hawker Stall">
    ${t("filter_hawker_stall")}
  </option>

  <option value="Food Court">
    ${t("filter_food_court")}
  </option>

  <option value="Market">
    ${t("filter_market")}
  </option>

  <option value="Florist">
    ${t("category_florist")}
  </option>

  <option value="Supermarket">
    ${t("category_supermarket")}
  </option>

  <option value="Pharmacy">
    ${t("category_pharmacy")}
  </option>

  <option value="Bakery">
    ${t("category_bakery")}
  </option>

  <option value="Other">
    ${t("filter_other")}
  </option>

</select>

      <input
        id="shop-name"
        placeholder="${t("shopName")}"
      >

      <select id="shop-area">

        <option value="">
          ${t("selectCity")}
        </option>

        <option value="Kuching">Kuching</option>
        <option value="Sibu">Sibu</option>
        <option value="Miri">Miri</option>
        <option value="Bintulu">Bintulu</option>
        <option value="Mukah">Mukah</option>
        <option value="Limbang">Limbang</option>
        <option value="Other">${t("filter_other")}</option>

      </select>

      <div class="address-picker-row">

        <input
          id="shop-address"
          placeholder="${t("address")}"
        >

        <button
          type="button"
          onclick="openMiniMap()"
          class="address-map-btn"
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11z"/>
            <circle cx="12" cy="10" r="2.4"/>
          </svg>
        </button>

      </div>

      <input
        id="shop-phone"
        placeholder="${t("phone")}"
      >

      <div class="simple-hours-box">

        <div class="shop-hours-editor-title">
          ${t("openingHours")}
        </div>

        <select id="hours-type">

          <option value="everyday">
            ${t("everyday")}
          </option>

          <option value="weekdays">
            ${t("weekdaysOnly")}
          </option>

          <option value="weekend">
            ${t("weekendOnly")}
          </option>

        </select>

        <div class="simple-hours-time">
          <input id="hours-open" type="time" value="07:00">
          <span>—</span>
          <input id="hours-close" type="time" value="19:00">
        </div>

        <div class="closed-days-title">
          ${t("closedOn")}
        </div>

        <div class="closed-days">
          ${renderClosedDayChips()}
        </div>

      </div>

      <textarea
        id="shop-note"
        placeholder="${t("notePlaceholder")}"
      ></textarea>

      <button
        class="shop-save-btn"
        onclick="saveShop()"
      >
        ${t("saveShop")}
      </button>

      <button onclick="closeAddShop()">
        ${t("cancel")}
      </button>

    </div>
  `;

  document.body.appendChild(menu);
}

function closeAddShop(force = false) {
  const menu = document.getElementById("add-shop-menu");

  if (menu) {
    menu.remove();
  }

  if (!force) {
    unlockBodyScroll();
  }
}

async function saveShop() {
  const foodIndex = Number(document.getElementById("shop-parent").value);
  const parentItem = foods[foodIndex];

  const category = document.getElementById("shop-category").value;
  const name = document.getElementById("shop-name").value.trim();
  const area = document.getElementById("shop-area").value.trim();

  const addressInput = document.getElementById("shop-address");
  const address = addressInput.value.trim();
  const lat = addressInput.dataset.lat || "";
  const lng = addressInput.dataset.lng || "";

  const phone = document.getElementById("shop-phone").value.trim();
  const note = document.getElementById("shop-note").value.trim();
  const hours = getHoursFromForm();

  if (!name) {
    alert(t("alertEnterShopName"));
    return;
  }

  if (!area) {
    alert(t("alertSelectCity"));
    return;
  }

  const { error } = await supabaseClient
    .from("shops")
    .insert({
      item_id: parentItem.id,
      category,
      name,
      area,
      address,
      lat,
      lng,
      phone,
      note,
      hours,
      status: "pending"
    });

  if (error) {
    console.error("Save shop error:", error);
    alert(t("submitShopFailed"));
    return;
  }

  alert(t("submitShopSuccess"));

  closeAddShop();

  await loadFoodsFromSupabase();

  renderFoodCards();
  renderTrailFilters();
  renderTrailList();
}

function callShop(phone) {
  window.location.href = `tel:${phone}`;
}

function getTodayKey() {
  return [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ][new Date().getDay()];
}

function getTodayHours(shop) {
  const today = getTodayKey();

  if (!shop.hours || !shop.hours[today]) {
    return `${today} · ${t("hoursNotSet")}`;
  }

  return `${today} · ${shop.hours[today]}`;
}

function renderShopHours(shop) {
  if (!shop.hours) return "";

  return `
    <details class="shop-hours">

      <summary>
        ${getTodayHours(shop)}
      </summary>

      <div class="shop-hours-list">

        ${Object.entries(shop.hours).map(([day, time]) => `
          <div class="shop-hours-row">
            <span>${day}</span>
            <span>${time}</span>
          </div>
        `).join("")}

      </div>

    </details>
  `;
}

function getHoursFromForm() {
  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ];

  const type =
    document.getElementById("hours-type").value;

  const open =
    document.getElementById("hours-open").value;

  const close =
    document.getElementById("hours-close").value;

  const range = `${open}-${close}`;

  const hours = {};

  days.forEach(day => {

    if (type === "everyday") {
      hours[day] = range;
    }

    if (type === "weekdays") {
      hours[day] =
        ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day)
          ? range
          : "Closed";
    }

    if (type === "weekend") {
      hours[day] =
        ["Sat", "Sun"].includes(day)
          ? range
          : "Closed";
    }

  });

  document
    .querySelectorAll(".closed-day-chip input:checked")
    .forEach(input => {
      hours[input.value] = "Closed";
    });

  return hours;
}

function renderClosedDayChips() {
  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ];

  return days.map(day => `
    <label class="closed-day-chip">
      <input type="checkbox" value="${day}">
      <span>${day}</span>
    </label>
  `).join("");
}