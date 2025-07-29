
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  function updateBulbIcon() {
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "💤" : "💡";
  }
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    updateBulbIcon();
  });
  updateBulbIcon();
});
