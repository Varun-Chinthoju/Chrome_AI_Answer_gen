
# 🧠 AI Answer Generator Chrome Extension (Ollama + LLaMA2)

This Chrome extension allows you to right-click selected text on any webpage and get a response from a locally running LLaMA2 model using [Ollama](https://ollama.com).

---

## 🚀 Features

- Right-click any selected text on a webpage
- Choose **"AI Answer Gen"** from the context menu
- View AI response in a popup powered by Ollama + LLaMA2

---

## 🧠 Requirements

- [Ollama](https://ollama.com) installed and running locally
- A downloaded model such as `llama2`
  ```bash
  ollama run llama2
  ```
- Google Chrome or any Chromium-based browser (e.g., Brave, Edge)

---

## 🛠️ Setup Instructions

1. **Install and run Ollama**
   ```bash
   brew install ollama
   ollama run llama2
   ```

2. **Download and unzip** this extension folder.

3. In Chrome, navigate to `chrome://extensions`.

4. Enable **Developer Mode** (top right).

5. Click **Load unpacked** and select the unzipped extension folder.

---

## 🧪 How to Use

1. Select text on any website.
2. Right-click and choose **"AI Answer Gen"**.
3. A popup window will display the AI's response from your local LLaMA2 model.

---

## ⚠️ Notes

- This extension sends your prompt to `http://localhost:11434`, which is the default Ollama API port.
- Make sure `ollama run llama2` is active before using the extension.
- No OpenAI key is needed—everything runs locally.

---

## 📄 License

MIT License
