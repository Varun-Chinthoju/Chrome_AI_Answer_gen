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
      sendResponse({ answer: latestAIResponse });
    }
  });
  
  // Get OpenAI API key from storage
  async function getAPIKey() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["openai_api_key"], (result) => {
        resolve(result.openai_api_key);
      });
    });
  }
  
  // Get AI response using OpenAI API
  async function getAIResponse(text) {
    const apiKey = await getAPIKey();
    if (!apiKey) return "API key not set. Please set it in the extension options.";
  
    try {
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
      return data.choices?.[0]?.message?.content || "No response from AI.";
    } catch (err) {
      return "Error contacting OpenAI: " + err.message;
    }
  }
  