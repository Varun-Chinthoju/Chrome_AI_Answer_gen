// popup.js

document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ action: "getAnswer" }, (response) => {
    const answerDiv = document.getElementById("answer");
    if (response && response.answer) {
      answerDiv.textContent = response.answer;
    } else {
      answerDiv.textContent = "No response received.";
    }
  });
});
