import fs from 'fs';
import { readData, setData, formatDate, envPath, dataPath } from '../utils/data';
import { embedChat } from './embedChat';

// const to = swrite data to => the JSON file
const writeChat =(data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}


// Default starter
const defaultHistory = () => { 
  const sysPrompt = process.env.SYSTEM_PROMPT; // Access SYSTEM_PROMPT from environment variables
  return (
    [
      {
        role: "system", 
        parts: [{ text: sysPrompt ? sysPrompt : "You are a helpful assistant named gemini. You will do your best to answer any queries with the appropriate format. here is our conversation so far:" }], 
      },
      {
        role: "me", 
        parts: [{ text: "Hi, I am on my console terminal and I have a few requests" }], 
      },
      {
        role: "gemini", 
        parts: [{ text: "Ready to help the best i can" }], 
      },
    ]
  );
};



// Create a new chat session
async function createChat (initialMessage) {
  const data = readData();
  // Create a new chat object
  const newChat = {
    id: data.length ? data[data.length - 1].id + 1 : 1, 
    created_at: new Date().toISOString(), 
    chat: [...defaultHistory()], 
  };

  if (initialMessage) {
    await saveChat(newChat.id, 'user', initialMessage);
    global.chatHistory = newChat.chat;
  } else {
    global.chatHistory = newChat.chat;
  }

  data.push(newChat);
  writeChat(data);
  setChat(newChat.id);
  return newChat.id;
}
// Save a message to a chat session
async function saveChat(chatId, role, text) {
  const data = readData();
  const chat = data.find(c => c.id === chatId);
  // we embed it first
  if (chat) {
    const embedding = await embedChat(text);
    chat.chat.push({ role, parts: [{ text, embedding }] });
    writeChat(data);
  }
  return chat;
}

 // write the current Chat ID in the env file
const setChat =(chatId) => {
  let envChatID = fs.readFileSync(envPath, 'utf-8');
  envChatID = envChatID.replace(/CHATID=.*$/, `CHATID=${chatId}`);
  fs.writeFileSync(envPath, envChatID);
}

// List all chat sessions
const listChats =() => {
  const data = readData();
  return data.map(chat => ({
    id: chat.id, // Chat ID
    created_at: formatDate(chat.created_at), // Chat creation date
    latest_user_message: chat.history.length > 1 ? chat.history[chat.history.length - 2].parts[0].text : '',
    latest_model_message: chat.history.length ? chat.history[chat.history.length - 1].parts[0].text : '',
    latest_author: chat.history.length ? chat.history[chat.history.length - 1].role : '',
  }));
}

const readChat = (chatId) => {
  const chat = setData(chatId);
  return chat;
}

export { createChat, saveChat, readChat, setChat, listChats };
