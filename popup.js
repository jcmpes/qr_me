function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m${remainingSeconds}s`;
  }
  
  async function getCurrentTab() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }
  
  async function getYouTubeTime() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const video = document.querySelector("video");
        if (video) {
          return video.currentTime;
        }
        return null;
      }
    });
  
    return results[0].result;
  }
  
  async function generateQR() {
    const tab = await getCurrentTab();
    let url = tab.url;
    const title = tab.title;

    // Mostrar título
    document.querySelector(".label-title").textContent = title;
  
    // Si es YouTube, añadir timestamp
    if (url.includes("youtube.com/watch")) {
      const currentTime = await getYouTubeTime();
      if (currentTime !== null) {
        const formatted = formatTime(currentTime);
        const separator = url.includes("?") ? "&" : "?";
        url += `${separator}t=${formatted}`;
      }
    }
  
    document.getElementById("url").textContent = url;
  
    new QRCode(document.getElementById("qrcode"), {
      text: url,
      width: 256,
      height: 256
    });
  }
  
  generateQR();