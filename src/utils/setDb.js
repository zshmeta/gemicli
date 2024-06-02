import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

// Path to the database file
const dbPath = path.join(__dirname, './data/chatHistory.db');

// Check if the database file exists, if not, create it
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
}

// Initialize the database connection
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER,
    role TEXT,
    text TEXT,
    FOREIGN KEY (chat_id) REFERENCES chats(id)
  )`);
});

export { db };
