################## TARS AI CHAT REGELS ##################

🐚 SHELL COMMANDS EERST
========================================================
- Geef complete, uitvoerbare commands
- Vermijd onnodige typwerk - copy-paste vriendelijk
- Gebruik echo en sed voor .md file updates

📄 MARKDOWN FILES
========================================================
- Nieuwe files: echo "inhoud" > bestand.md
- Bestaande files: sed -i 's/oud/nieuw/g' bestand.md
- Test sed eerst: sed -n 's/oud/nieuw/p' bestand.md

🔄 GIT WORKFLOW
========================================================
- Eerst .md files updaten, dan git commit/push
- Duidelijke commit messages: git commit -m "beschrijving"
- Status check: git status && git diff

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
