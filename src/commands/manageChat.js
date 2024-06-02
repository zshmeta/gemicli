import setDb from '../utils/setDb'

const db = setDb()


function createChat(callback) {
    db.run(`INSERT INTO chats DEFAULT VALUES`, function(err) {
      if (err) {
        console.error(err);
        callback(null);
      } else {
        callback(this.lastID);
      }
    });
  }
  
  // Save a chat message
  function saveChat(chatId, role, text) {
    const stmt = db.prepare(`INSERT INTO chat_history (chat_id, role, text) VALUES (?, ?, ?)`);
    stmt.run(chatId, role, text);
    stmt.finalize();
  }
  
  // Load chat history for a specific chat session
  function setChat(chatId, callback) {
    db.all(`SELECT role, text FROM chat_history WHERE chat_id = ?`, [chatId], (err, rows) => {
      if (err) {
        console.error(err);
        callback([]);
      } else {
        const history = rows.map(row => ({
          role: row.role,
          parts: [{ text: row.text }]
        }));
        callback(history);
      }
    });
  }
  
  // List all chat sessions
  function listChats(callback) {
    db.all(`SELECT id, created_at FROM chats`, (err, rows) => {
      if (err) {
        console.error(err);
        callback([]);
      } else {
        callback(rows);
      }
    });
  }
  

  export { createChat, saveChat, setChat, listChats };