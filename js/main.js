document.addEventListener("DOMContentLoaded", async function () {
  applyLanguage();

  await loadFoodsFromSupabase();

  renderFoodCards();
  renderTrailFilters();
  renderTrailList();
  bindSheetSwipe();
});

function lockBodyScroll() {
  document.body.classList.add("no-scroll");
}

function unlockBodyScroll() {
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

  unlockBodyScroll();
}