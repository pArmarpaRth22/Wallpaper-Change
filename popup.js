document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("searchButton");
  const randomizeButton = document.getElementById("randomize");
  const searchInput = document.getElementById("search");
  const wallpapersDiv = document.getElementById("wallpapers");
  const categories = document.querySelectorAll(".category");

  const API_KEY = "7UyOihbPrpGM94gs7wfLvgRaEl7QlL23PDfllWokMPbB13kk9YezSLZ9";

  async function fetchWallpapers(query) {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=10`,
      {
        headers: {
          Authorization: API_KEY,
        },
      }
    );
    const data = await response.json();
    return data.photos;
  }

  function displayWallpapers(wallpapers) {
    wallpapersDiv.innerHTML = "";
    wallpapers.forEach((wallpaper) => {
      const img = document.createElement("img");
      img.src = wallpaper.src.medium;
      img.className = "wallpaper";
      img.onclick = () => setWallpaper(wallpaper.src.original);
      wallpapersDiv.appendChild(img);
    });
  }

  async function searchWallpapers() {
    const query = searchInput.value;
    const wallpapers = await fetchWallpapers(query);
    displayWallpapers(wallpapers);
  }

  async function fetchWallpapersByCategory(category) {
    const wallpapers = await fetchWallpapers(category);
    displayWallpapers(wallpapers);
  }

  async function randomizeWallpaper() {
    const wallpapers = await fetchWallpapers("random");
    const randomWallpaper =
      wallpapers[Math.floor(Math.random() * wallpapers.length)];
    setWallpaper(randomWallpaper.src.original);
  }

  function setWallpaper(url) {
    chrome.storage.sync.set({ wallpaper: url }, function () {
      console.log("Wallpaper set to " + url);
      // Apply the wallpaper to the background (can be customized based on the use case)
      document.body.style.backgroundImage = `url(${url})`;
    });
  }

  searchButton.addEventListener("click", searchWallpapers);
  randomizeButton.addEventListener("click", randomizeWallpaper);

  categories.forEach((category) => {
    category.addEventListener("click", () => {
      fetchWallpapersByCategory(category.dataset.category);
    });
  });
});
