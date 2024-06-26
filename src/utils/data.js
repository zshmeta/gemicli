import fs from 'fs';
import path from 'path';

// Define the paths to the data and environment files
const dataPath = path.join(__dirname, '../data/chats.json');
const envPath = path.join(__dirname, '../data/.env');

// Function to read the data from the JSON file. Takes the DHATID as arg
function readData() {
  // Check if the data file exists
  if (!fs.existsSync(dataPath)) {
    // If it doesn't exist, create it with an empty array
    fs.writeFileSync(dataPath, JSON.stringify([])); // Initialize with an empty array if file doesn't exist
  }

  // Read the data from the file
  const data = fs.readFileSync(dataPath);

  // Parse the data as JSON
  return JSON.parse(data)
}



// Function to read the data corresponding to the chatid
function setData(chatId) {
  // Read the data from the file
  // returns the object corresponding to the chatId
  const data = fs.readFileSync(dataPath, 'utf-8');
  const chats = JSON.parse(data).find(chat => chat.id === chatId);
  const  chat = chats.chat.map(item => ({
    role: item.role,
    text: item.parts[0].text,
  }));
  
  return chat;
}
// console.log(setData())

// Function to format a date object into a string
function formatDate(date) {
  // Create a new Date object from the date
  const d = new Date(date);

  // Get the day, month, hours, and minutes from the date object
  const day = (`0${d.getDate()}`).slice(-2);
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const hours = (`0${d.getHours()}`).slice(-2);
  const minutes = (`0${d.getMinutes()}`).slice(-2);

  // Return the formatted date string
  return `${day}/${month} ${hours}:${minutes}`;
}





export { readData, setData, formatDate, envPath, dataPath };

