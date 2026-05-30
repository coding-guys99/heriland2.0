let currentTrailFilter = "all";
let currentPage = 1;
const itemsPerPage = 18;

function normalizeFilter(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function getDynamicFilters() {
  const filters = new Map();

  foods.forEach(item => {
    if (item.type) {
      filters.set(normalizeFilter(item.type), item.type);
    }

    if (item.recommends) {
      item.recommends.forEach(shop => {
        if (shop.category) {
          filters.set(normalizeFilter(shop.category), shop.category);
        }
      });
    }
  });

  return filters;
}

function getFilterLabel(key, fallback) {
  const i18nKey = `filter_${key}`;

  if (typeof t === "function") {
    return t(i18nKey) || fallback;
  }

  return fallback;
}

function renderTrailFilters() {
  const filterBox = document.getElementById("trail-filters");
  if (!filterBox) return;

  const filters = getDynamicFilters();

  filterBox.innerHTML = `
    <button
      class="trail-filter ${currentTrailFilter === "all" ? "active" : ""}"
      onclick="setTrailFilter('all', event)"
    >
      ${t("all")}
    </button>

    ${Array.from(filters.entries()).map(([key, label]) => `
      <button
        class="trail-filter ${currentTrailFilter === key ? "active" : ""}"
        onclick="setTrailFilter('${key}', event)"
      >
        ${getFilterLabel(key, label)}
      </button>
    `).join("")}
  `;
}

function setTrailFilter(type, event) {
  
  currentTrailFilter = type;
  currentPage = 1;

  document
    .querySelectorAll(".trail-filter")
    .forEach(btn => btn.classList.remove("active"));

  if (event) {
    event.currentTarget.classList.add("active");
  }

  renderTrailList();
}

function renderFoodCards() {
  const foodScroll = document.getElementById("food-scroll");
  if (!foodScroll) return;

  const featuredFoods = foods
    .map((food, index) => ({
      ...food,
      realIndex: index
    }))
    .filter(food => food.featured);

  foodScroll.innerHTML = featuredFoods.map((food, cardIndex) => `
    <div class="food-card" onclick="openSheet(${food.realIndex})">
      <span class="card-number">${String(cardIndex + 1).padStart(2, "0")}</span>

      <div class="food-card-img card-bg-${(cardIndex % 6) + 1}">
        ${food.image}
      </div>

      <div class="food-card-body">
        <div class="food-name">${food.name}</div>
        <div class="food-city">📍 ${food.city}</div>
        <div class="food-desc">${food.shortDesc}</div>
      </div>
    </div>
  `).join("");
}

function itemMatchesFilter(item) {
  if (currentTrailFilter === "all") return true;

  if (normalizeFilter(item.type) === currentTrailFilter) {
    return true;
  }

  return item.recommends?.some(shop =>
    normalizeFilter(shop.category) === currentTrailFilter
  );
}

function injectAds(items) {
  const result = [];

  let lastWasAd = false;

  items.forEach(item => {

    result.push({
      type: "item",
      data: item
    });

    const shouldInsertAd =
      !lastWasAd &&
      Math.random() < 0.08;

    if (shouldInsertAd) {

      const randomAd =
        ads[Math.floor(Math.random() * ads.length)];

      result.push({
        type: "ad",
        data: randomAd
      });

      lastWasAd = true;

    } else {

      lastWasAd = false;
    }
  });

  return result;
}

function renderTrailList() {
  const trailList = document.getElementById("trail-list");
  if (!trailList) return;

  const filteredItems = foods.filter(itemMatchesFilter);

  const start = (currentPage - 1) * itemsPerPage;
  const pagedItems = filteredItems.slice(start, start + itemsPerPage);

  const mixedItems = injectAds(pagedItems);

  let itemNumber = start;

  trailList.innerHTML = mixedItems.map((entry, index) => {
    if (entry.type === "ad") {
      const ad = entry.data;

      return `
        <li
          class="trail-ad-card fade-in"
          style="animation-delay:${index * 0.05}s"
        >
          <div class="trail-ad-badge">
            Sponsored
          </div>

          <div class="trail-ad-emoji">
            ${ad.image}
          </div>

          <div class="trail-ad-title">
            ${ad.title}
          </div>

          <div class="trail-ad-desc">
            ${ad.desc}
          </div>
        </li>
      `;
    }

    const item = entry.data;
    const realIndex = foods.indexOf(item);

    itemNumber++;

    return `
      <li
        class="trail-item fade-in"
        onclick="openSheet(${realIndex})"
        style="animation-delay:${index * 0.05}s"
      >
        <span class="trail-num">
          ${String(itemNumber).padStart(2, "0")}
        </span>

        <div class="trail-info">
          <div class="trail-name">${item.name}</div>
          <div class="trail-meta">${item.city} · ${item.heritage}</div>
        </div>

        <span class="trail-emoji">${item.emoji}</span>
      </li>
    `;
  }).join("");

  renderPagination(filteredItems.length);
}

function renderPagination(totalItems) {
  const box = document.getElementById("pagination");
  if (!box) return;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = `
    <button onclick="changePage(-1)" ${currentPage === 1 ? "disabled" : ""}>
      Prev
    </button>

    <span>${currentPage} / ${totalPages}</span>

    <button onclick="changePage(1)" ${currentPage === totalPages ? "disabled" : ""}>
      Next
    </button>
  `;
}

function changePage(step) {
  currentPage += step;
  renderTrailList();
}