// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ai-answer-gen",
    title: "AI Answer Gen",
    contexts: ["selection"]
  });
});

let latestAIResponse = "";

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getAnswer") {
    sendResponse({ answer: latestAIResponse });
  }
});

async function getAIResponse(text) {
  try {
    console.log("Sending request to Ollama (LLaMA model)...");

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama2",
        messages: [
          { role: "user", content: text }
        ],
        stream: false
      })
    });

    const data = await response.json();
    console.log("Ollama Response:", data);

    if (data.message && data.message.content) {
      return data.message.content;
    } else {
      return "No response from Ollama.";
    }
  } catch (err) {
    console.error("Error contacting Ollama:", err);
    return "Error contacting Ollama: " + err.message;
  }
}
