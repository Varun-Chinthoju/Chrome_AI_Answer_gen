document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "getAnswer" }, (response) => {
      const display = document.getElementById("answer");
  
      if (chrome.runtime.lastError) {
        display.textContent = "Error: " + chrome.runtime.lastError.message;
        return;
      }
  
      if (response && response.answer) {
        display.textContent = response.answer;
      } else {
        display.textContent = "Failed to load response.";
      }
    });
  });
  