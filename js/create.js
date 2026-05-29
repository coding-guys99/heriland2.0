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
  alert("Add Item form next.");
}