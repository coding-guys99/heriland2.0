function openCreateMenu() {
  closeAllSheets();
  lockBodyScroll();

  const menu = document.createElement("div");
  menu.className = "shop-menu active";
  menu.id = "create-menu";

  menu.innerHTML = `
    <div class="shop-menu-card">
      <div class="shop-menu-handle"></div>

      <div class="shop-menu-title">
        ${t("addContent")}
      </div>

      <button onclick="openAddShop()">
        ${t("addShop")}
      </button>

      <button onclick="openAddItem()">
        ${t("addItem")}
      </button>

      <button onclick="closeCreateMenu()">
        ${t("cancel")}
      </button>
    </div>
  `;

  document.body.appendChild(menu);
}

function closeCreateMenu(force = false) {
  const menu = document.getElementById("create-menu");

  if (menu) {
    menu.remove();
  }

  if (!force) {
    unlockBodyScroll();
  }
}

function openAddItem() {
  closeAllSheets();
  lockBodyScroll();

  const menu = document.createElement("div");
  menu.className = "shop-menu active";
  menu.id = "add-item-menu";

  menu.innerHTML = `
    <div class="shop-menu-card">
      <div class="shop-menu-handle"></div>

      <div class="shop-menu-title">
        ${t("addItem")}
      </div>

      <select id="item-type" onchange="renderItemCategoryOptions()">
        <option value="food">${t("filter_food")}</option>
        <option value="attraction">${t("filter_attraction")}</option>
        <option value="business">${t("filter_business")}</option>
        <option value="event">${t("filter_event")}</option>
      </select>

      <select id="item-category"></select>

      <input id="item-name" placeholder="${t("itemName")}">

      <select id="item-city">
        <option value="">${t("selectCity")}</option>
        <option value="Kuching">Kuching</option>
        <option value="Sibu">Sibu</option>
        <option value="Miri">Miri</option>
        <option value="Bintulu">Bintulu</option>
        <option value="Mukah">Mukah</option>
        <option value="Sarikei">Sarikei</option>
        <option value="Sri Aman">Sri Aman</option>
        <option value="Kapit">Kapit</option>
        <option value="Limbang">Limbang</option>
        <option value="Lawas">Lawas</option>
        <option value="Serian">Serian</option>
        <option value="Whole Sarawak">Whole Sarawak</option>
        <option value="Other">${t("filter_other")}</option>
      </select>

      <input id="item-heritage" placeholder="${t("itemHeritage")}">
      <input id="item-emoji" placeholder="${t("itemEmoji")}">
      <input id="item-short-desc" placeholder="${t("itemShortDesc")}">

      <textarea id="item-desc" placeholder="${t("itemDesc")}"></textarea>

      <input id="item-tags" placeholder="${t("itemTags")}">

      <button class="shop-save-btn" onclick="saveItem()">
        ${t("saveItem")}
      </button>

      <button onclick="closeAddItem()">
        ${t("cancel")}
      </button>
    </div>
  `;

  document.body.appendChild(menu);

  renderItemCategoryOptions();
}

function renderItemCategoryOptions() {
  const typeSelect = document.getElementById("item-type");
  const categorySelect = document.getElementById("item-category");

  if (!typeSelect || !categorySelect) return;

  const type = typeSelect.value;

  const categories = {
    food: [
      ["signature-food", t("category_signature_food")],
      ["local-breakfast", t("category_local_breakfast")],
      ["seafood", t("category_seafood")],
      ["dessert", t("category_dessert")],
      ["traditional", t("category_traditional")],
      ["fruit", t("category_fruit")]
    ],

    attraction: [
      ["nature", t("category_nature")],
      ["beach", t("category_beach")],
      ["heritage", t("category_heritage")],
      ["museum", t("category_museum")],
      ["market", t("category_market")],
      ["viewpoint", t("category_viewpoint")]
    ],

    business: [
      ["kopitiam", t("category_kopitiam")],
      ["florist", t("category_florist")],
      ["supermarket", t("category_supermarket")],
      ["pharmacy", t("category_pharmacy")],
      ["bakery", t("category_bakery")],
      ["market", t("category_market")]
    ],

    event: [
      ["festival", t("category_festival")],
      ["market-event", t("category_market_event")],
      ["cultural-event", t("category_cultural_event")],
      ["food-event", t("category_food_event")]
    ]
  };

  categorySelect.innerHTML = categories[type]
    .map(([value, label]) => `
      <option value="${value}">
        ${label}
      </option>
    `)
    .join("");
}

function closeAddItem(force = false) {
  const menu = document.getElementById("add-item-menu");

  if (menu) {
    menu.remove();
  }

  if (!force) {
    unlockBodyScroll();
  }
}

async function saveItem() {
  const type = document.getElementById("item-type").value;
  const category = document.getElementById("item-category").value;

  const name = document.getElementById("item-name").value.trim();
  const city = document.getElementById("item-city").value.trim();
  const heritage = document.getElementById("item-heritage").value.trim();
  const emoji = document.getElementById("item-emoji").value.trim() || "📍";
  const shortDesc = document.getElementById("item-short-desc").value.trim();
  const desc = document.getElementById("item-desc").value.trim();

  const tags = document
    .getElementById("item-tags")
    .value
    .split(",")
    .map(tag => tag.trim())
    .filter(Boolean);

  if (!name) {
    alert(t("alertEnterItemName"));
    return;
  }

  if (!city) {
    alert(t("alertSelectCity"));
    return;
  }

  const { error } = await supabaseClient
    .from("items")
    .insert({
      type,
      category,
      name,
      city,
      heritage,
      emoji,
      image: emoji,
      short_desc: shortDesc,
      description: desc,
      tags,
      featured: false,
      status: "pending"
    });

  if (error) {
    console.error("Save item error:", error);
    alert(t("submitItemFailed"));
    return;
  }

  alert(t("submitItemSuccess"));

  closeAddItem();
}