import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../src/config/.env') });

const apiKey = process.env.API_KEY;
console.log('API Key:', apiKey); // Log the API key for debugging

const data = {
  contents: [
    {
      role: "user",
      parts: [{ text: "Hello is it you?" }]
    }
  ]
};

console.log('Request Data:', data); // Log the request data for debugging

axios.post(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, data, {
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });
