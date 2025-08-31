#!/bin/bash
# Notify via email bij errors
ERROR_MSG="$1"
SUBJECT="TARS AI Project Error Notification"
EMAIL="craponyou@hotmail.com"
echo "$ERROR_MSG" | mail -s "$SUBJECT" "$EMAIL"
