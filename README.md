# AI Answer Generator Chrome Extension

This Chrome extension allows you to right-click selected text on any webpage and generate an AI-powered response using OpenAI's GPT model.

---

## 🚀 Features

- Right-click selected text
- Choose **"AI Answer Gen"** from the context menu
- Get an AI-generated answer via an alert popup

---

## 🧠 Requirements

- A valid [OpenAI API Key](https://platform.openai.com/account/api-keys)
- Google Chrome (latest version)

---

## 🛠️ Setup Instructions

1. **Download and unzip** the extension folder.
2. Open `background.js` and find the line:
   ```js
   const apiKey = "YOUR_API_KEY_HERE";
   ```
   Replace it with your actual OpenAI API key:
   ```js
   const apiKey = "sk-...your_real_key_here...";
   ```
3. In Chrome, go to `chrome://extensions`
4. Enable **Developer mode** (top right)
5. Click **Load unpacked**
6. Select the folder you just unzipped

---

## 🧪 How to Use

1. Select any text on a webpage
2. Right-click and choose **"AI Answer Gen"**
3. Wait a few seconds and an alert will show the AI's response

---

## 🔒 Security Note

This extension contains your OpenAI API key in plain text. Do **NOT** use this version in production or publish it without securing the key via a backend proxy.

---

## 📄 License

MIT License
