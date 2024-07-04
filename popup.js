document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-button");
  const randomButton = document.getElementById("random-button");
  const wallpaperContainer = document.getElementById("wallpaper-container");

  const pexelsApiKey =
    "7UyOihbPrpGM94gs7wfLvgRaEl7QlL23PDfllWokMPbB13kk9YezSLZ9"; // Replace with your actual Pexels API key

  searchButton.addEventListener("click", () => {
    const query = document.getElementById("search").value;
    searchWallpapers(query);
  });

  randomButton.addEventListener("click", () => {
    getRandomWallpaper();
  });

  async function searchWallpapers(query) {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=10`,
        {
          headers: {
            Authorization: pexelsApiKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      displayWallpapers(data.photos);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load wallpapers. Please try again later.");
    }
  }

  async function getRandomWallpaper() {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/curated?per_page=1`,
        {
          headers: {
            Authorization: pexelsApiKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      displayWallpapers(data.photos);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load wallpaper. Please try again later.");
    }
  }

  function displayWallpapers(wallpapers) {
    wallpaperContainer.innerHTML = "";
    wallpapers.forEach((wallpaper) => {
      const img = document.createElement("img");
      img.src = wallpaper.src.medium; // Adjust according to Pexels API response structure
      img.addEventListener("click", () => {
        setWallpaper(wallpaper.src.original); // Adjust according to Pexels API response structure
        saveWallpaper(wallpaper.src.original); // Save selected wallpaper URL
      });
      wallpaperContainer.appendChild(img);
    });
  }

  function setWallpaper(url) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) {
        console.error("Unable to get active tab ID.");
        return;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: (url) => {
            document.body.style.backgroundImage = `url(${url})`;
            document.body.style.backgroundSize = "cover"; // Optional: Adjust background size as needed
            document.body.style.backgroundPosition = "center"; // Optional: Adjust background position as needed
            document.body.style.backgroundRepeat = "no-repeat"; // Optional: Adjust background repeat as needed
          },
          args: [url],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Execution error:", chrome.runtime.lastError.message);
            alert("Failed to set wallpaper. Please try again later.");
          }
        }
      );
    });
  }

  function saveWallpaper(url) {
    chrome.storage.sync.set({ wallpaperUrl: url }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error saving wallpaper:",
          chrome.runtime.lastError.message
        );
      } else {
        console.log("Wallpaper saved successfully:", url);
      }
    });
  }

  // Load saved wallpaper on popup load
  chrome.storage.sync.get("wallpaperUrl", (data) => {
    if (data.wallpaperUrl) {
      setWallpaper(data.wallpaperUrl);
    }
  });
});
