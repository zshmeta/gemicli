import fs from 'fs';
import path from 'path';

// Define the paths to the data and environment files
const dataPath = path.join(__dirname, '../data/chats.json');
const envPath = path.join(__dirname, '../data/.env');

// Function to read the data from the JSON file
function readData() {
  // Check if the data file exists
  if (!fs.existsSync(dataPath)) {
    // If it doesn't exist, create it with an empty array
    fs.writeFileSync(dataPath, JSON.stringify([])); // Initialize with an empty array if file doesn't exist
  }

  // Read the data from the file
  const data = fs.readFileSync(dataPath);

  // Parse the data as JSON
  return JSON.parse(data);
}

// Function to write data to the JSON file
function writeData(data) {
  // Write the data to the file, formatted with two spaces for indentation
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Function to update a key-value pair in the environment file
function setData(key, value) {
  // Read the environment file
  const env = fs.readFileSync(envPath, 'utf-8');

  // Split the environment file into lines
  const lines = env.split('\n');

  // Map over the lines and update the key-value pair if it exists
  const setData = lines.map(line => {
    if (line.startsWith(key)) {
      return `${key}=${value}`;
    }
    return line;
  }).join('\n');

  // Write the updated environment file
  fs.writeFileSync(envPath, setData);
}

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
  return `${day}/${month}/${d.getFullYear()} ${hours}:${minutes}`;
}





export { readData, writeData, setData, formatDate };
