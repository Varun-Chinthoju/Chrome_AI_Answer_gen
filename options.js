document.getElementById("options-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const apiKey = document.getElementById("api-key").value;
    chrome.storage.local.set({ openai_api_key: apiKey }, function() {
      alert("API Key saved!");
    });
  });
  