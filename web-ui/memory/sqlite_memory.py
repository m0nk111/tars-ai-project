import sqlite3
import json
from datetime import datetime

def init_db():
    """Initialize SQLite database with tables"""
    conn = sqlite3.connect('conversation_memory.db')
    cursor = conn.cursor()
    
    # Create conversations table
    cursor.execute('''CREATE TABLE IF NOT EXISTS conversations
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      session_id TEXT NOT NULL,
                      role TEXT NOT NULL,
                      content TEXT NOT NULL,
                      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    
    # Create index for faster session queries
    cursor.execute('''CREATE INDEX IF NOT EXISTS idx_session_id 
                     ON conversations (session_id)''')
    
    conn.commit()
    conn.close()

def save_message(session_id, role, content):
    """Save a message to the database"""
    conn = sqlite3.connect('conversation_memory.db')
    cursor = conn.cursor()
    
    cursor.execute('''INSERT INTO conversations (session_id, role, content)
                     VALUES (?, ?, ?)''', (session_id, role, content))
    
    conn.commit()
    conn.close()

def get_conversation_history(session_id, limit=20):
    """Retrieve conversation history for a session"""
    conn = sqlite3.connect('conversation_memory.db')
    cursor = conn.cursor()
    
    cursor.execute('''SELECT role, content 
                     FROM conversations 
                     WHERE session_id = ? 
                     ORDER BY timestamp ASC 
                     LIMIT ?''', (session_id, limit))
    
    history = [{"role": row[0], "content": row[1]} for row in cursor.fetchall()]
    conn.close()
    
    return history

def clear_session_history(session_id):
    """Remove all messages for a specific session"""
    conn = sqlite3.connect('conversation_memory.db')
    cursor = conn.cursor()
    
    cursor.execute('''DELETE FROM conversations 
                     WHERE session_id = ?''', (session_id,))
    
    conn.commit()
    conn.close()

def get_total_messages():
    """Get total number of messages in database"""
    conn = sqlite3.connect('conversation_memory.db')
    cursor = conn.cursor()
    
    cursor.execute('''SELECT COUNT(*) FROM conversations''')
    count = cursor.fetchone()[0]
    conn.close()
    
    return count
