chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "ai-answer-gen",
      title: "AI Answer Gen",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "ai-answer-gen") {
      const selectedText = info.selectionText;
      
      // Get the AI response
      const aiResponse = await getAIResponse(selectedText);
      
      // Open the popup immediately (no delay here)
      chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 400,
        height: 300
      }, (newWindow) => {
        // Send the AI response to the popup immediately after opening
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
          if (message.action === "getAnswer") {
            sendResponse(aiResponse);  // Send the AI response directly to the popup
          }
        });
      });
    }
  });
  
  async function getAIResponse(text) {
    const apiKey = "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";  // <-- Replace with your OpenAI API key
    
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
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      return "Sorry, no response from AI.";
    }
  }
  