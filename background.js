// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "ai-answer-gen",
      title: "AI Answer Gen",
      contexts: ["selection"]
    });
  });
  
  let latestAIResponse = "";  // Stores last AI response
  
  // Handle context menu click
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "ai-answer-gen" && info.selectionText) {
      const selectedText = info.selectionText;
  
      // Get AI response and store it
      latestAIResponse = await getAIResponse(selectedText);
  
      // Open popup window
      chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 400,
        height: 300
      });
    }
  });
  
  // Provide answer to popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getAnswer") {
      console.log("Popup requested answer:", latestAIResponse);
      sendResponse({ answer: latestAIResponse });
    }
  });
  
  
  // Get OpenAI API key from storage
  async function getAPIKey() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["openai_api_key"], (result) => {
        resolve("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");
      });
    });
  }
  
  // Get AI response using OpenAI API
  async function getAIResponse(text) {
    const apiKey = await getAPIKey();
    if (!apiKey) {
      console.log("API key not set.");
      return "API key not set. Please set it in the extension options.";
    }
  
    try {
      console.log("Sending request to OpenAI API...");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: text }],
          temperature: 0.7,
          max_tokens: 200
        })
      });
  
      const data = await response.json();
      console.log("API Response:", data);  // Log the full API response
  
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        return "No response from AI.";
      }
    } catch (err) {
      console.error("Error contacting OpenAI:", err);
      return "Error contacting OpenAI: " + err.message;
    }
  }
  