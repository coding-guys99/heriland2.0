document.addEventListener("DOMContentLoaded", async function () {
  applyLanguage();

  await loadFoodsFromSupabase();

  renderFoodCards();
  renderTrailFilters();
  renderTrailList();
  bindSheetSwipe();
  
  loadWeather();
});

function lockBodyScroll() {
  document.documentElement.classList.add("no-scroll");
  document.body.classList.add("no-scroll");
}

function unlockBodyScroll() {
  document.documentElement.classList.remove("no-scroll");
  document.body.classList.remove("no-scroll");
}

function closeAllSheets() {
  closeSheet?.(true);
  closeSearch?.(true);
  closeFeedbackSheet?.(true);
  closeShopMenu?.(true);
  closeMiniMap?.(true);
  closeAddShop?.(true);
  closeCreateMenu?.(true);
  closeAddItem?.(true);

  unlockBodyScroll();
}