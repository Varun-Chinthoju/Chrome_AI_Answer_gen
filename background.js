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

async function getAIResponse(text) {
  try {
    console.log("Sending request to Ollama...");

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama2",
        messages: [{ role: "user", content: text }],
        stream: false
      })
    });

    // Log the response to check its content
    const responseText = await response.text();  // Get raw response
    console.log("Ollama raw response:", responseText);

    // Try to parse the response only if it's not empty
    if (responseText.trim()) {
      try {
        const data = JSON.parse(responseText);
        console.log("Ollama parsed response:", data);

        if (data.message && data.message.content) {
          return data.message.content;
        } else {
          return "No valid content returned from Ollama.";
        }
      } catch (err) {
        console.error("Error parsing Ollama response:", err);
        return "Error parsing response.";
      }
    } else {
      return "No response from Ollama.";
    }
  } catch (err) {
    console.error("Error contacting Ollama:", err);
    return "Error contacting Ollama: " + err.message;
  }
}
