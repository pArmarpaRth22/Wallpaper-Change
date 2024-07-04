// Example background script for Chrome extension

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setWallpaper") {
    setWallpaper(message.url);
  }
});

function setWallpaper(url) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      console.error("No active tabs found.");
      return;
    }

    const tab = tabs[0];
    if (!tab || !tab.id) {
      console.error("Unable to get active tab ID.");
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: (url) => {
          document.body.style.backgroundImage = `url(${url})`;
          document.body.style.backgroundSize = "cover"; // Adjust as needed
          document.body.style.backgroundPosition = "center"; // Adjust as needed
          document.body.style.backgroundRepeat = "no-repeat"; // Adjust as needed
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
