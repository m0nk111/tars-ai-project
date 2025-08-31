#!/bin/bash
# Backup uploads en conversaties
BACKUP_DIR="/home/flip/tars-ai-project/generated/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -a /home/flip/tars-ai-project/web_ui/uploads "$BACKUP_DIR/" 2>/dev/null || echo "Geen uploads directory"
cp /home/flip/tars-ai-project/web_ui/conversation_memory.db "$BACKUP_DIR/" 2>/dev/null || echo "Geen conversatie DB"
echo "Backup voltooid: $BACKUP_DIR"
