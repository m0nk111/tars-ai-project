#!/bin/bash
# Log cleanup (laatste 7 dagen bewaren)
find /var/log -type f -name "*.log" -mtime +7 -exec sudo rm -f {} \;
echo "Oude logs verwijderd."
