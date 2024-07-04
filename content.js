// Example content script for Chrome extension

// Assuming you have a button or trigger in your popup.html to set the wallpaper
document.addEventListener("DOMContentLoaded", function () {
  const setWallpaperButton = document.getElementById("set-wallpaper-button");

  setWallpaperButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "setWallpaper",
      url: "YOUR_WALLPAPER_URL_HERE",
    });
  });
});
