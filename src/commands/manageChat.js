import { readData, writeData, setData, formatDate } from '../utils/data';
import { embedChat } from './embedChat';
// Default chat history for new chats
const defaultHistory = [
  {
    role: "user", // Role of the sender
    parts: [{ text: "Hi, I am on my $(uname -o) terminal and I have a few requests" }], // Text of the message
  },
  {
    role: "model", // Role of the sender
    parts: [{ text: "Always ready to help, I will make sure to provide the best possible answer" }], // Text of the message
  },
];

// Create a new chat session
async function createChat(initialMessage) {
  // Read the existing chat data from the database
  const data = readData();

  // Create a new chat object
  const newChat = {
    id: data.length ? data[data.length - 1].id + 1 : 1, // Assign a unique ID to the chat
    created_at: new Date().toISOString(), // Set the creation date
    history: [...defaultHistory], // Initialize the chat history with the default messages
  };

  // If an initial message is provided, save it to the chat history
  if (initialMessage) {
    await saveChat(newChat.id, 'user', initialMessage);
  }

  // Add the new chat to the database
  data.push(newChat);
  writeData(data);

  // Update the environment variable to set the current chat ID
  setData('CHATID', newChat.id);

  // Return the ID of the newly created chat
  return newChat.id;
}

// Save a message to a chat session
async function saveChat(chatId, role, text) {
  // Read the existing chat data from the database
  const data = readData();

  // Find the chat with the specified ID
  const chat = data.find(c => c.id === chatId);

  // If the chat exists, add the new message to the history
  if (chat) {
    // Generate an embedding for the message text
    const embedding = await embedChat(text);

    // Add the message to the chat history
    chat.history.push({ role, parts: [{ text, embedding }] });

    // Write the updated chat data to the database
    writeData(data);
  }
  return chat;
}

  // Set the current chat session
function setChat(chatId) {
  // Read the existing chat data from the database
  const data = readData();

  // Find the chat with the specified ID
  const chat = data.find(c => c.id === chatId);

  // If the chat exists, update the environment variable to set the current chat ID and return the chat history
  if (chat) {
    setData('CHATID', chatId);
    return chat.history;
  }

  // Otherwise, return null
  return null;
}

// List all chat sessions
function listChats() {
  // Read the existing chat data from the database
  const data = readData();

  // Map the chat data into a list of chat summaries
  return data.map(chat => ({
    id: chat.id, // Chat ID
    created_at: formatDate(chat.created_at), // Chat creation date
    latest_message: chat.history.length ? chat.history[chat.history.length - 1].parts[0].text : '', // Text of the latest message in the chat
  }));
}


export { createChat, saveChat, setChat, listChats };
