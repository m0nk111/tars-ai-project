################## TARS AI CHAT RULES ##################

🐚 SHELL COMMANDS FIRST
========================================================
- Provide complete, executable commands
- Avoid unnecessary typing; copy-paste friendly
- Use echo and sed for .md file updates

📄 MARKDOWN FILES
========================================================
- New files: echo "content" > file.md
- Existing files: sed -i 's/old/new/g' file.md
- Test sed first: sed -n 's/old/new/p' file.md

🔄 GIT WORKFLOW
========================================================
- Update .md files first, then git commit/push
- Clear commit messages: git commit -m "description"
- Status check: git status && git diff

🎯 CHAT FLOW
========================================================
1. Describe goal/problem
2. Provide shell commands
3. State expected output
4. Ask for confirmation

⚠️ SAFETY
========================================================
- Backup first: cp file.txt file.txt.backup
- Dangerous commands: rm -rf, chmod 777
- Read-only first: systemctl status, journalctl

💡 EXAMPLES
========================================================
Service management:
sudo systemctl status tars-backend
sudo systemctl restart tars-backend

Log inspection:
sudo journalctl -u tars-backend -f
sudo tail -f /var/log/tars/backend.log

################## END OF COPY PASTE ##################
Last updated: 2025-08-30
🎯 CHAT FLOW
========================================================
1. Beschrijf doel/probleem
2. Geef shell commands
3. Vermeld verwachte output
4. Vraag bevestiging

⚠️ VEILIGHEID
========================================================
- Backup eerst: cp file.txt file.txt.backup
- Gevaarlijke commands: rm -rf, chmod 777
- Read-only eerst: systemctl status, journalctl

💡 VOORBEELDEN
========================================================
Service management:
sudo systemctl status tars-backend
sudo systemctl restart tars-backend

Log inspection:
sudo journalctl -u tars-backend -f
sudo tail -f /var/log/tars/backend.log

################## EINDE VAN COPY PASTE ##################
Laatst bijgewerkt: 2025-08-30
