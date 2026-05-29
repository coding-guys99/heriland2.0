const foods = [
  {
    emoji: "🍜",
    image: "🍜",
    name: "Sarawak Laksa",
    city: "Kuching, Sarawak",
    heritage: "Malay-Chinese",
    shortDesc: "Creamy, spicy, utterly unforgettable.",
    desc: "A rich coconut and sambal broth with rice vermicelli, prawns, chicken, egg and fresh herbs. Sarawak Laksa is one of the most iconic breakfast dishes in Kuching.",
    tags: ["Breakfast", "Spicy", "Coconut", "Must Try"],
    recommends: [
      {
        name: "Chong Choon Café",
        area: "Kuching",
        note: "Popular local breakfast spot.",
        map: "https://www.google.com/maps/search/?api=1&query=Chong+Choon+Cafe+Kuching",
        phone: "+6082"
      },
      {
        name: "Mom's Laksa",
        area: "Kuching",
        note: "Known for rich Sarawak laksa broth.",
        map: "https://www.google.com/maps/search/?api=1&query=Mom%27s+Laksa+Kuching",
        phone: "+6082"
      }
    ]
  },
  {
    emoji: "🍝",
    image: "🍝",
    name: "Kolo Mee",
    city: "Kuching, Sarawak",
    heritage: "Chinese Hakka",
    shortDesc: "Dry tossed noodles, a Kuching morning ritual.",
    desc: "Springy egg noodles tossed with fragrant oil and seasoning, usually served with minced meat and char siu. Simple, local, and deeply comforting.",
    tags: ["Noodles", "Breakfast", "Local Classic", "Dry Mee"],
    recommends: [
      {
        name: "Oriental Park Kolo Mee",
        area: "Kuching",
        note: "Classic old-school kolo mee.",
        map: "https://www.google.com/maps/search/?api=1&query=Oriental+Park+Kolo+Mee+Kuching",
        phone: "+6082"
      },
      {
        name: "Noodle Descendants",
        area: "Kuching",
        note: "Famous local noodle shop.",
        map: "https://www.google.com/maps/search/?api=1&query=Noodle+Descendants+Kuching",
        phone: "+6082"
      }
    ]
  },
  {
    emoji: "🍖",
    image: "🍖",
    name: "Manok Pansoh",
    city: "Interior Sarawak",
    heritage: "Iban",
    shortDesc: "Chicken cooked inside bamboo over fire.",
    desc: "Chicken cooked with lemongrass, ginger and tapioca leaves inside bamboo. The bamboo gives the dish a soft smoky aroma that feels very traditional.",
    tags: ["Iban", "Bamboo Cooked", "Traditional", "Smoky"],
    recommends: [
      {
        name: "Sarawak Cultural Village",
        area: "Kuching",
        note: "Good place to experience traditional food culture.",
        map: "https://www.google.com/maps/search/?api=1&query=Sarawak+Cultural+Village",
        phone: "+6082"
      }
    ]
  },
  {
    emoji: "🦈",
    image: "🦈",
    name: "Umai",
    city: "Miri / Mukah, Sarawak",
    heritage: "Melanau",
    shortDesc: "Raw fish salad with lime, chilli and onion.",
    desc: "Umai is a Melanau raw fish dish cured with lime juice, sliced shallots, chilli and salt. Fresh, sharp and perfect for coastal food lovers.",
    tags: ["Melanau", "Seafood", "Fresh", "Coastal"],
    recommends: [
      {
        name: "Mukah Local Food Stalls",
        area: "Mukah",
        note: "Best explored through local markets and coastal stalls.",
        map: "https://www.google.com/maps/search/?api=1&query=Umai+Mukah+Sarawak",
        phone: "+6084"
      }
    ]
  },
  {
    emoji: "🌿",
    image: "🌿",
    name: "Midin",
    city: "Kuching, Sarawak",
    heritage: "Borneo Jungle Fern",
    shortDesc: "Wild jungle fern stir-fried with belacan.",
    desc: "Midin is a crunchy jungle fern commonly stir-fried with garlic, belacan or red wine. It is one of the vegetables that feels truly Sarawakian.",
    tags: ["Vegetable", "Jungle Fern", "Belacan", "Local Favourite"],
    recommends: [
      {
        name: "Top Spot Food Court",
        area: "Kuching",
        note: "Good place for seafood and local vegetable dishes.",
        map: "https://www.google.com/maps/search/?api=1&query=Top+Spot+Food+Court+Kuching",
        phone: "+6082"
      }
    ]
  },
  {
    emoji: "🍚",
    image: "🍚",
    name: "Nasi Lemak Sarawak",
    city: "Sibu, Sarawak",
    heritage: "Malay",
    shortDesc: "Coconut rice wrapped in banana leaf.",
    desc: "Fragrant coconut rice served with sambal, egg, cucumber and anchovies. In Sarawak, the banana leaf version feels especially nostalgic and local.",
    tags: ["Halal", "Rice", "Sambal", "Banana Leaf"],
    recommends: [
      {
        name: "Sibu Night Market",
        area: "Sibu",
        note: "Good place to discover casual local food.",
        map: "https://www.google.com/maps/search/?api=1&query=Sibu+Night+Market",
        phone: "+6084"
      }
    ]
  },
  {
    emoji: "🐛",
    image: "🐛",
    name: "Sago Worm",
    city: "Mukah / Interior Sarawak",
    heritage: "Melanau",
    shortDesc: "A bold traditional delicacy.",
    desc: "Sago worm is a traditional delicacy connected to the sago palm culture. It can be eaten raw, fried or cooked, depending on local preparation.",
    tags: ["Traditional", "Adventurous", "Melanau", "Sago"],
    recommends: [
      {
        name: "Mukah Market",
        area: "Mukah",
        note: "Best explored with local guidance.",
        map: "https://www.google.com/maps/search/?api=1&query=Mukah+Market+Sarawak",
        phone: "+6084"
      }
    ]
  },
  {
    emoji: "🍪",
    image: "🍪",
    name: "Tebaloi",
    city: "Mukah, Sarawak",
    heritage: "Melanau",
    shortDesc: "Thin crispy sago biscuit.",
    desc: "Tebaloi is a traditional Melanau sago biscuit. Light, crispy and often eaten as a snack or brought home as a local souvenir.",
    tags: ["Snack", "Sago", "Souvenir", "Melanau"],
    recommends: [
      {
        name: "Mukah Local Shops",
        area: "Mukah",
        note: "Usually found in local markets and souvenir shops.",
        map: "https://www.google.com/maps/search/?api=1&query=Tebaloi+Mukah",
        phone: "+6084"
      }
    ]
  },
  {
    emoji: "🥗",
    image: "🥗",
    name: "Rojak Sarawak",
    city: "Kuching, Sarawak",
    heritage: "Street Food",
    shortDesc: "Sweet, savoury and messy in the best way.",
    desc: "A local rojak mix with fruit, vegetables, sauce and crunchy toppings. It is casual, affordable and very street-food friendly.",
    tags: ["Street Food", "Sweet", "Savoury", "Snack"],
    recommends: [
      {
        name: "Open Air Market Kuching",
        area: "Kuching",
        note: "Good area to explore local street food.",
        map: "https://www.google.com/maps/search/?api=1&query=Open+Air+Market+Kuching",
        phone: "+6082"
      }
    ]
  },
  {
    emoji: "🥢",
    image: "🥢",
    name: "Kueh Chap",
    city: "Kuching, Sarawak",
    heritage: "Teochew",
    shortDesc: "Flat rice sheets in herbal soy broth.",
    desc: "Kueh Chap is a comforting bowl of flat rice sheets served in a dark herbal soy broth, often with pork parts, tofu and egg.",
    tags: ["Teochew", "Soup", "Comfort Food", "Local"],
    recommends: [
      {
        name: "Lau Ya Keng Food Court",
        area: "Kuching",
        note: "Classic food court with local favourites.",
        map: "https://www.google.com/maps/search/?api=1&query=Lau+Ya+Keng+Kuching",
        phone: "+6082"
      }
    ]
  },
  {
    emoji: "🍮",
    image: "🍮",
    name: "Pengat",
    city: "Sarawak",
    heritage: "Malay Dessert",
    shortDesc: "Sweet coconut dessert with banana or yam.",
    desc: "Pengat is a warm dessert made with coconut milk, palm sugar and ingredients like banana, yam or sago. Soft, sweet and homely.",
    tags: ["Dessert", "Coconut", "Sweet", "Malay"],
    recommends: [
      {
        name: "Local Malay Food Stalls",
        area: "Sarawak",
        note: "Usually found at local markets and festive food stalls.",
        map: "https://www.google.com/maps/search/?api=1&query=Pengat+Sarawak",
        phone: "+6082"
      }
    ]
  },
  {
    emoji: "🫙",
    image: "🫙",
    name: "Ambuyat",
    city: "Limbang, Sarawak",
    heritage: "Bruneian-Sarawak",
    shortDesc: "Sticky sago starch eaten with dipping sauce.",
    desc: "Ambuyat is made from sago starch and eaten by rolling it around bamboo sticks, then dipping it into sour or spicy sauces.",
    tags: ["Sago", "Traditional", "Limbang", "Sharing Food"],
    recommends: [
      {
        name: "Limbang Local Restaurants",
        area: "Limbang",
        note: "Best searched locally when visiting Limbang.",
        map: "https://www.google.com/maps/search/?api=1&query=Ambuyat+Limbang+Sarawak",
        phone: "+6085"
      }
    ]
  }
];

function renderFoodCards() {
  const foodScroll = document.getElementById("food-scroll");
  if (!foodScroll) return;

  foodScroll.innerHTML = foods.map((food, index) => {
    return `
      <div class="food-card" onclick="openSheet(${index})">
        <span class="card-number">${String(index + 1).padStart(2, "0")}</span>

        <div class="food-card-img card-bg-${(index % 6) + 1}">
          ${food.image}
        </div>

        <div class="food-card-body">
          <div class="food-name">${food.name}</div>
          <div class="food-city">📍 ${food.city}</div>
          <div class="food-desc">${food.shortDesc}</div>
        </div>
      </div>
    `;
  }).join("");
}

function renderTrailList() {
  const trailList = document.getElementById("trail-list");
  if (!trailList) return;

  trailList.innerHTML = foods.map((food, index) => {
    return `
      <li
        class="trail-item fade-in"
        onclick="openSheet(${index})"
        style="animation-delay:${index * 0.05}s"
      >
        <span class="trail-num">${String(index + 1).padStart(2, "0")}</span>

        <div class="trail-info">
          <div class="trail-name">${food.name}</div>
          <div class="trail-meta">${food.city} · ${food.heritage}</div>
        </div>

        <span class="trail-emoji">${food.emoji}</span>
      </li>
    `;
  }).join("");
}

function openSheet(index) {
  const food = foods[index];
  if (!food) return;

  const sheetContent = document.getElementById("sheet-content");
  const backdrop = document.getElementById("backdrop");
  const bottomSheet = document.getElementById("bottom-sheet");

  sheetContent.innerHTML = `
    <div class="sheet-food-image">
      <span>${food.image}</span>
    </div>

    <div class="sheet-title">${food.name}</div>

    <div class="sheet-location">
      📍 ${food.city} &nbsp;·&nbsp; ${food.heritage}
    </div>

    <p class="sheet-desc">${food.desc}</p>

    <div class="sheet-tags">
      ${food.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
    </div>

<div class="recommend-header">
  <div class="recommend-title">Recommended Shops</div>

  <button
    class="add-shop-btn"
    onclick="openAddShop(${index})"
  >
    +
  </button>
</div>

    <div class="recommend-list">
      ${food.recommends.map((shop, shopIndex) => `
        <div class="recommend-item" onclick="openShopMenu(${index}, ${shopIndex}, event)">
          <div>
            <div class="recommend-name">${shop.name}</div>
            <div class="recommend-area">${shop.area}</div>
            <div class="recommend-note">${shop.note}</div>
          </div>
          <div class="recommend-more">⋯</div>
        </div>
      `).join("")}
    </div>
  `;

  backdrop.classList.add("active");
  bottomSheet.classList.add("active");
}

function closeSheet() {
  const backdrop = document.getElementById("backdrop");
  const bottomSheet = document.getElementById("bottom-sheet");

  backdrop.classList.remove("active");
  bottomSheet.classList.remove("active");

  closeShopMenu();
}

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

      <div class="shop-menu-title">${shop.name}</div>
      <div class="shop-menu-area">📍 ${shop.area}</div>
      <p class="shop-menu-note">${shop.note}</p>

      <button onclick="openMap('${shop.map}')">
        Open Map
      </button>

      <button onclick="callShop('${shop.phone}')">
        Call
      </button>

      <button onclick="closeShopMenu()">
        Close
      </button>
    </div>
  `;

  document.body.appendChild(menu);

  setTimeout(() => {
    menu.classList.add("active");
  }, 10);
}

function closeShopMenu() {
  const menu = document.getElementById("shop-menu");
  if (menu) {
    menu.classList.remove("active");
    setTimeout(() => menu.remove(), 250);
  }
}

function openAddShop(foodIndex) {
  closeShopMenu();

  const menu = document.createElement("div");
  menu.className = "shop-menu active";
  menu.id = "add-shop-menu";

  menu.innerHTML = `
    <div class="shop-menu-card">
      <div class="shop-menu-handle"></div>

      <div class="shop-menu-title">Add Recommended Shop</div>

      <input id="shop-name" placeholder="Shop Name">

      <select id="shop-area">
        <option value="">Select City</option>
        <option value="Kuching">Kuching</option>
        <option value="Sibu">Sibu</option>
        <option value="Miri">Miri</option>
        <option value="Bintulu">Bintulu</option>
        <option value="Mukah">Mukah</option>
        <option value="Limbang">Limbang</option>
        <option value="Other">Other</option>
      </select>

      <div class="address-picker-row">
        <input id="shop-address" placeholder="Address">

        <button type="button" onclick="openMiniMap()" class="address-map-btn">
          <svg viewBox="0 0 24 24">
            <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11z"/>
            <circle cx="12" cy="10" r="2.4"/>
          </svg>
        </button>
      </div>

      <input id="shop-phone" placeholder="Phone">

      <textarea id="shop-note" placeholder="Short note..."></textarea>

      <button onclick="saveShop(${foodIndex})">
        Save Shop
      </button>

      <button onclick="closeAddShop()">
        Cancel
      </button>
    </div>
  `;

  document.body.appendChild(menu);
}

function closeAddShop() {
  const menu = document.getElementById("add-shop-menu");

  if (menu) {
    menu.remove();
  }
}

function saveShop(foodIndex) {
  const name = document.getElementById("shop-name").value.trim();
  const area = document.getElementById("shop-area").value.trim();
  const address = document.getElementById("shop-address").value.trim();
  const phone = document.getElementById("shop-phone").value.trim();
  const note = document.getElementById("shop-note").value.trim();

  if (!name) {
    alert("Please enter shop name");
    return;
  }

  if (!area) {
    alert("Please select city");
    return;
  }

  const mapQuery = `${name} ${address} ${area} Sarawak`;
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  foods[foodIndex].recommends.push({
    name,
    area,
    address,
    phone,
    note,
    map
  });

  closeAddShop();
  openSheet(foodIndex);
}

function openMap(url) {
  window.open(url, "_blank");
}

function pickAddress() {
  const name = document.getElementById("shop-name")?.value || "";
  const area = document.getElementById("shop-area")?.value || "";

  const query = encodeURIComponent(`${name} ${area} Sarawak`);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;

  window.open(url, "_blank");
}

function openMiniMap() {
  closeShopMenu();

  const mapSheet = document.createElement("div");
  mapSheet.className = "shop-menu active";
  mapSheet.id = "mini-map-sheet";

  mapSheet.innerHTML = `
    <div class="shop-menu-card">
      <div class="shop-menu-handle"></div>

      <div class="shop-menu-title">Pick Location</div>

      <div class="mini-map-box">
        <div class="mini-map-grid"></div>

        <button class="mini-map-pin" onclick="selectMiniMapAddress('Kuching Waterfront, Kuching')">
          <svg viewBox="0 0 24 24">
            <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11z"/>
            <circle cx="12" cy="10" r="2.4"/>
          </svg>
        </button>
      </div>

      <button onclick="selectMiniMapAddress('Kuching Waterfront, Kuching')">
        Use This Location
      </button>

      <button onclick="closeMiniMap()">
        Cancel
      </button>
    </div>
  `;

  document.body.appendChild(mapSheet);
}

function selectMiniMapAddress(address) {
  const input = document.getElementById("shop-address");

  if (input) {
    input.value = address;
  }

  closeMiniMap();
}

function closeMiniMap() {
  const sheet = document.getElementById("mini-map-sheet");

  if (sheet) {
    sheet.remove();
  }
}

function callShop(phone) {
  window.location.href = `tel:${phone}`;
}

function scrollToMap() {
  const mapSection = document.getElementById("map-section");
  if (!mapSection) return;

  mapSection.scrollIntoView({
    behavior: "smooth"
  });
}

let startY = 0;

function bindSheetSwipe() {
  const sheet = document.getElementById("bottom-sheet");
  if (!sheet) return;

  sheet.addEventListener("touchstart", function (event) {
    startY = event.touches[0].clientY;
  });

  sheet.addEventListener("touchend", function (event) {
    const endY = event.changedTouches[0].clientY;

    if (endY - startY > 60) {
      closeSheet();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderFoodCards();
  renderTrailList();
  bindSheetSwipe();
});