#!/usr/bin/env python3
import sqlite3
from datetime import datetime, timedelta

def cleanup_old_conversations(days=30):
    """Remove conversations older than specified days"""
    conn = sqlite3.connect('conversation_memory.db')
    cursor = conn.cursor()
    
    cutoff_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d %H:%M:%S')
    
    cursor.execute("DELETE FROM conversations WHERE timestamp < ?", (cutoff_date,))
    deleted_count = cursor.rowcount
    
    conn.commit()
    conn.close()
    
    print(f"Removed {deleted_count} conversations older than {days} days")

if __name__ == "__main__":
    cleanup_old_conversations(7)  # Cleanup conversations older than 7 days
