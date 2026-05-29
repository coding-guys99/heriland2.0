function applySavedTheme() {
  const savedTheme = localStorage.getItem("heriland-theme") || "dark";

  document.body.classList.toggle("theme-light", savedTheme === "light");
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("theme-light");
  localStorage.setItem("heriland-theme", isLight ? "light" : "dark");
}

document.addEventListener("DOMContentLoaded", applySavedTheme);