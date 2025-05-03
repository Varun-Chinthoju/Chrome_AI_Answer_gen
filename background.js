chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ai-answer-gen",
    title: "AI Answer Gen",
    contexts: ["selection"]
  });
});

let latestAIResponse = "";

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "ai-answer-gen" && info.selectionText) {
    const selectedText = info.selectionText;
    latestAIResponse = await getAIResponse(selectedText);

    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 400,
      height: 300
    });
  }
});

// Provide the AI response to the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getAnswer") {
    sendResponse({ answer: latestAIResponse });
  }
});

// Updated to go through a CORS-friendly proxy at http://localhost:3000/ask
async function getAIResponse(text) {
  try {
    console.log("Sending request to proxy server...");

    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: text })
    });

    const responseText = await response.text(); // Raw response
    console.log("Proxy raw response:", responseText);

    if (responseText.trim()) {
      try {
        const data = JSON.parse(responseText);
        console.log("Proxy parsed response:", data);

        if (data.message && data.message.content) {
          return data.message.content;
        } else {
          return "No valid content returned from Ollama.";
        }
      } catch (err) {
        console.error("Error parsing response:", err);
        return "Error parsing response.";
      }
    } else {
      return "No response from proxy.";
    }
  } catch (err) {
    console.error("Error contacting proxy server:", err);
    return "Error contacting proxy server: " + err.message;
  }
}
