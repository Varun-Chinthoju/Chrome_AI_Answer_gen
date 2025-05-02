document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ action: "getAnswer" }, (response) => {
    if (response && response.answer) {
      document.getElementById("answer").textContent = response.answer;
    } else {
      document.getElementById("answer").textContent = "Failed to load response.";
    }
  });
});
