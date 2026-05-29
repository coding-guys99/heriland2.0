let startY = 0;

function openSheet(index) {
  closeAllSheets();
  lockBodyScroll();

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
      ${(food.tags || []).map(tag => `
        <span class="tag">${tag}</span>
      `).join("")}
    </div>

    <div class="recommend-header">
      <div class="recommend-title">
        ${t("recommendedShops")}
      </div>
    </div>

    <div class="recommend-list">
      ${(food.recommends || []).map((shop, shopIndex) => `
        <div
          class="recommend-item"
          onclick="openShopMenu(${index}, ${shopIndex}, event)"
        >
          <div>
            <div class="recommend-type">
              ${shop.category || t("filter_restaurant")}
            </div>

            <div class="recommend-name">
              ${shop.name}
            </div>

            <div class="recommend-area">
              ${shop.area}
            </div>

            <div class="recommend-hours">
              ${getTodayHours(shop)}
            </div>

            <div class="recommend-note">
              ${shop.note || ""}
            </div>
          </div>

          <div class="recommend-more">⋯</div>
        </div>
      `).join("")}
    </div>
  `;

  backdrop.classList.add("active");
  bottomSheet.classList.add("active");
}

function closeSheet(force = false) {
  document
    .getElementById("backdrop")
    ?.classList.remove("active");

  document
    .getElementById("bottom-sheet")
    ?.classList.remove("active");

  closeShopMenu?.(true);

  if (!force) {
    unlockBodyScroll();
  }
}

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