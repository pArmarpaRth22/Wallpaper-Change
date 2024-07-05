chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("wallpaper", ({ wallpaper }) => {
    if (wallpaper) {
      setWallpaper(wallpaper);
    }
  });
});

function setWallpaper(url) {
  document.body.style.backgroundImage = `url(${url})`;
}
