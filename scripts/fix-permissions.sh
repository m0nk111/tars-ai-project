#!/bin/bash
# Fix all permissions for the entire project directory (run as root)
sudo chown -R $USER:$USER /home/flip/tars-ai-project
sudo chmod -R 755 /home/flip/tars-ai-project
