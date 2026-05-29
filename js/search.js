function openSearch() {
  closeAllSheets();
  lockBodyScroll();

  const sheet = document.createElement("div");

  sheet.className = "shop-menu active";
  sheet.id = "search-sheet";

  sheet.innerHTML = `
    <div class="shop-menu-card search-card">

      <div class="shop-menu-handle"></div>

      <div class="search-header">
        <div class="shop-menu-title">
          ${t("search")}
        </div>

        <button onclick="closeSearch()">
          ${t("close")}
        </button>
      </div>

      <input
        id="search-input"
        class="search-input"
        placeholder="${t("searchPlaceholder")}"
        oninput="handleSearchInput(this.value)"
        autofocus
      >

      <div class="search-chips">

        <button onclick="quickSearch('Kuching', event)">
          Kuching
        </button>

        <button onclick="quickSearch('Laksa', event)">
          Laksa
        </button>

        <button onclick="quickSearch('Cafe', event)">
          Cafe
        </button>

        <button onclick="quickSearch('Breakfast', event)">
          Breakfast
        </button>

      </div>

      <div
        id="search-results"
        class="search-results"
      ></div>

    </div>
  `;

  document.body.appendChild(sheet);

  setTimeout(() => {
    document.getElementById("search-input")?.focus();

    document
      .querySelectorAll(".search-chips button")
      .forEach(btn => btn.classList.remove("active"));

    renderSearchResults("");
  }, 50);
}

function closeSearch(force = false) {
  const sheet = document.getElementById("search-sheet");

  if (sheet) {
    sheet.remove();
  }

  if (!force) {
    unlockBodyScroll();
  }
}

function quickSearch(keyword, event) {
  const input = document.getElementById("search-input");
  if (!input) return;

  input.value = keyword;

  document
    .querySelectorAll(".search-chips button")
    .forEach(btn => btn.classList.remove("active"));

  if (event) {
    event.currentTarget.classList.add("active");
  }

  renderSearchResults(keyword);
}

function handleSearchInput(value) {
  document
    .querySelectorAll(".search-chips button")
    .forEach(btn => btn.classList.remove("active"));

  renderSearchResults(value);
}

function renderSearchResults(keyword) {
  const box = document.getElementById("search-results");
  if (!box) return;

  const query = keyword.trim().toLowerCase();

  const results = foods
    .map((item, index) => ({
      ...item,
      realIndex: index
    }))
    .filter(item => {
      if (!query) return true;

      const shopText = item.recommends
        ? item.recommends
            .map(shop => `
              ${shop.name}
              ${shop.area}
              ${shop.category || ""}
              ${shop.note || ""}
            `)
            .join(" ")
        : "";

      const text = `
        ${item.name}
        ${item.city}
        ${item.heritage}
        ${item.shortDesc}
        ${item.desc}
        ${(item.tags || []).join(" ")}
        ${shopText}
      `.toLowerCase();

      return text.includes(query);
    });

  if (!results.length) {
    box.innerHTML = `
      <div class="search-empty">
        ${t("noResults")}
      </div>
    `;

    return;
  }

  box.innerHTML = results.map(item => `
    <div
      class="search-result-item"
      onclick="openSearchResult(${item.realIndex})"
    >

      <div class="search-result-emoji">
        ${item.emoji}
      </div>

      <div>

        <div class="search-result-title">
          ${item.name}
        </div>

        <div class="search-result-meta">
          ${item.city} · ${item.heritage}
        </div>

        <div class="search-result-tags">
          ${(item.tags || [])
            .slice(0, 3)
            .map(tag => `<span>${tag}</span>`)
            .join("")}
        </div>

      </div>

    </div>
  `).join("");
}

function openSearchResult(index) {
  closeSearch();
  openSheet(index);
}