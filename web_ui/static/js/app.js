// TARS AI Assistant - Enhanced with file upload, code formatting, and model persistence
let currentLang = 'en';
let socket = null;
function formatData(data) {
    // Basic passthrough, customize as needed
    return data;
}
const messagesContainer = document.getElementById('messages-container');
const chatSection = document.getElementById('chat-section');
const settingsPanel = document.getElementById('settings-panel');
function formatData(data) {
    // Basic passthrough, customize as needed
    return data;
}
var dialogStrings = {};
document.addEventListener('DOMContentLoaded', () => {
    // Toon alleen chat bij laden, verberg settings
    const chatSection = document.querySelector('.chat-section');
    const settingsPanel = document.getElementById('settings-panel');
    if (chatSection) chatSection.style.display = '';
    if (settingsPanel) settingsPanel.style.display = 'none';
    // Verberg model management elementen op chat pagina
    document.getElementById('active-model-header').style.display = '';
    document.getElementById('active-model-sidebar').style.display = '';
    // Update actief model direct bij laden
    fetch('/api/models/active')
        .then(r => r.json())
        .then(active => {
            updateActiveModelIndicators(active || '');
        });
    // TTS voice selector logic
    const voiceSelect = document.getElementById('voice-select');
    let availableVoices = [];
    function populateVoiceList() {
        if (!voiceSelect) return;
        availableVoices = window.speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';
        availableVoices.forEach((voice, idx) => {
            const option = document.createElement('option');
            option.value = idx;
            option.textContent = `${voice.name} (${voice.lang})${voice.gender ? ' - ' + voice.gender : ''}`;
            voiceSelect.appendChild(option);
        });
        // Restore last selected voice
        const savedVoice = localStorage.getItem('ttsVoice');
        if (savedVoice && voiceSelect.options[savedVoice]) {
            voiceSelect.value = savedVoice;
        }
    }
    if (typeof speechSynthesis !== 'undefined') {
        populateVoiceList();
        window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    if (voiceSelect) {
        voiceSelect.addEventListener('change', (e) => {
            localStorage.setItem('ttsVoice', e.target.value);
        });
    }
    // Theme switcher dropdown logic
    const settingsBtn = document.querySelector('.nav-btn:nth-child(2)');
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeSelect = document.getElementById('theme-select');

    if (themeSelect) {
        themeSelect.value = localStorage.getItem('theme') || 'dark';
        themeSelect.addEventListener('change', (e) => {
            setTheme(e.target.value);
        });
    }
    // Theme toggle logic (fix for missing themeToggle element)
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            setTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }

    function setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            document.body.classList.remove('light-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
        localStorage.setItem('theme', theme);
    }

    // On load, set theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    // Cache DOM elements once
    const $ = id => document.getElementById(id);
    const messageInput = $('message-input');
    const sendButton = $('send-button');
    const messagesContainer = $('messages');
    const fileUpload = $('file-upload');
    const fileDropZone = $('file-drop-zone');
    const statsContainer = $('system-stats');
    
    // Establish WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
    
    // Handle WebSocket connection open
    socket.addEventListener('open', function(event) {
        console.log('WebSocket connection established');
        addMessage('System', 'Connected to TARS AI Assistant', 'system');
        startStatsUpdates();
    });
        const thinkingIndicator = document.getElementById('thinking-indicator');

        function showThinking() {
            if (thinkingIndicator) {
                thinkingIndicator.style.display = 'flex';
                thinkingIndicator.style.visibility = 'visible';
                const text = thinkingIndicator.querySelector('span');
                if (text) text.textContent = 'TARS is thinking...';
            }
        }
        function hideThinking() {
            if (thinkingIndicator) {
                thinkingIndicator.style.display = 'none';
                thinkingIndicator.style.visibility = 'hidden';
                const text = thinkingIndicator.querySelector('span');
                if (text) text.textContent = '';
            }
        }
    
    // Handle incoming messages from WebSocket
    socket.addEventListener('message', function(event) {
        const data = JSON.parse(event.data);
            if (data.type === 'system_stats') {
                updateSystemStats(data.data);
            } else if (data.type === 'response') {
                addMessage('TARS', data.message, 'response', data.model);
                // TTS: Use Coqui TTS Docker backend
                fetch(window.location.origin.replace(/:\d+$/, ':5002') + '/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: data.message })
                })
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const audio = new Audio(url);
                    audio.play();
                })
                .catch(() => {
                    addMessage('System', 'TTS (Coqui) niet beschikbaar.', 'error');
                });
                hideThinking();
                waitingForResponse = false;
                setInputBlocked(false);
        }
    });
    
    // Handle WebSocket errors
    socket.addEventListener('error', function(event) {
        console.error('WebSocket error:', event);
        addMessage('System', 'Connection error. Please refresh the page.', 'error');
    });
    
    // Handle WebSocket connection close
    socket.addEventListener('close', function(event) {
        console.log('WebSocket connection closed');
        addMessage('System', 'Connection lost. Attempting to reconnect...', 'system');
    });
    
    // Drag and drop functionality
    const fileUploadBtn = $('file-upload-btn');
    if (fileUploadBtn) {
        fileUploadBtn.addEventListener('click', () => fileUpload.click());
    }
// ...existing code...
    // Send message when send button is clicked
    sendButton.addEventListener('click', sendMessage);

    // Send message when Enter key is pressed
    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
            
        let formData = new FormData();
        // Add file and other data to formData as needed
        fetch(window.location.origin + '/api/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    addMessage('You', `Uploaded file: ${file.name}`, 'user');
                } else {
                    addMessage('System', `Upload failed: ${data.message}`, 'error');
                }
            })
            .catch(error => {
                addMessage('System', 'Upload failed', 'error');
            });
        });
    // Removed stray closing brace
    let waitingForResponse = false;
    function setInputBlocked(blocked) {
        messageInput.disabled = blocked;
        sendButton.disabled = blocked;
        if (blocked) {
            sendButton.classList.add('disabled');
            messageInput.placeholder = 'Selecteer eerst een model.';
        } else {
            sendButton.classList.remove('disabled');
            messageInput.placeholder = 'Type your message...';
        }
    }
    function sendMessage() {
        if (waitingForResponse) return;
        const message = messageInput.value.trim();
        if (message && socket && socket.readyState === WebSocket.OPEN) {
            addMessage('You', message, 'user');
            showThinking();
            socket.send(JSON.stringify({ message: message }));
            messageInput.value = '';
            waitingForResponse = true;
            setInputBlocked(true);
        }
    }
    
    function addMessage(sender, text, type, model = null) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        
        let modelInfo = '';
        if (model && type === 'response') {
            modelInfo = ` <small style="opacity: 0.6;">[${model}]</small>`;
        }
        
        // Format code blocks and other content
        const formattedText = formatMessage(text);
        
        messageElement.innerHTML = `
            <strong>${sender}:</strong>${modelInfo}
            <div>${formattedText}</div>
        `;
        if (messagesContainer && typeof messagesContainer.appendChild === 'function') {
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    function formatMessage(text) {
        // Code blocks
        text = text.replace(/```(\w+)?\s([\s\S]*?)```/g, (m, lang, code) =>
            `<div class="code-block">
                <div class="code-header">
                    <span>${lang || 'code'}</span>
                    <div class="code-actions">
                        <button class="code-btn" onclick="copyToClipboard(this)">Copy</button>
                        <button class="code-btn" onclick="downloadCode(this)">Download</button>
                    </div>
                </div>
                <pre><code>${escapeHtml(code.trim())}</code></pre>
            </div>`
        );
        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        // Newlines
        return text.replace(/\n/g, '<br>');
    }
    
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Always load models on page open
    function updateSystemStats(stats) {
        let statsHTML = '<strong>System Resources:</strong><br>';
        
        if (stats.error) {
            statsHTML += `Error: ${stats.error}`;
        } else {
            statsHTML += `CPU: ${stats.cpu_usage} | Temp: ${stats.cpu_temp}<br>`;
            statsHTML += `RAM: ${stats.memory_display}<br>`;
            statsHTML += `GPU: ${stats.gpu_usage} | VRAM: ${stats.vram_display}<br>`;
            statsHTML += `GPU Temp: ${stats.gpu_temp}`;
        }
        
        statsContainer.innerHTML = statsHTML;
    }
    
    // Debounce stats polling
    let statsInterval;
    function startStatsUpdates() {
        if (statsInterval) clearInterval(statsInterval);
        statsInterval = setInterval(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "get_stats" }));
            }
        }, 5000);
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "get_stats" }));
        }
    }

    // Settings panel logic
    // settingsPanel en chatSection zijn al gedeclareerd bovenaan
    const navBtns = document.querySelectorAll('.nav-btn');
    // Fix: definieer dummy variabelen als fallback
    const modelsList = document.getElementById('models-list') || { innerHTML: '', appendChild: () => {}, textContent: '' };
    const activeModelSelect = document.getElementById('active-model-select') || { innerHTML: '', appendChild: () => {}, value: '', disabled: false };
    const activateModelBtn = document.getElementById('activate-model-btn') || { disabled: false };
    // Fix: storageStatus altijd correct definiëren
    const storageStatus = document.getElementById('storage-status') || { textContent: '' };
    const languageSelect = document.getElementById('language-select');
    // Default language is English
    // ...existing code...
    if (localStorage.getItem('lang')) {
        currentLang = localStorage.getItem('lang');
        languageSelect.value = currentLang;
    }
    function loadDialogStrings(lang, cb) {
        fetch(`/static/i18n/dialog_${lang}.json`)
            .then(r => r.json())
            .then(obj => {
                dialogStrings = obj;
                if (cb) cb();
            })
            .catch(() => {
                dialogStrings = {};
                if (cb) cb();
            });
    }
    loadDialogStrings(currentLang, loadSettingsPanel);
    languageSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('lang', currentLang);
        loadDialogStrings(currentLang, loadSettingsPanel);
    });

    navBtns[0].addEventListener('click', () => {
    if (chatSection && chatSection.style) chatSection.style.display = '';
    if (settingsPanel && settingsPanel.style) settingsPanel.style.display = 'none';
    navBtns[0].classList.add('active');
    navBtns[1].classList.remove('active');
    });
    if (navBtns[1]) {
        navBtns[1].addEventListener('click', () => {
            console.log('Settings knop geklikt');
            if (chatSection && chatSection.style) chatSection.style.display = 'none';
            if (settingsPanel && settingsPanel.style) settingsPanel.style.display = '';
            navBtns[1].classList.add('active');
            navBtns[0].classList.remove('active');
            loadSettingsPanel();
        });
    }

    // Herlaad settings-panel na download/activatie
    activateModelBtn.addEventListener('click', () => {
        const modelId = activeModelSelect.value;
        fetch(`/api/models/activate/${modelId}`, { method: 'POST' })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(currentLang === 'nl' ? 'Model geactiveerd!' : 'Model activated!');
                    loadSettingsPanel();
                } else {
                    alert(data.detail || 'Error');
                }
            });
    });
    modelsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('download-model-btn')) {
            const modelId = e.target.getAttribute('data-id');
            fetch(`/api/models/download/${modelId}`, { method: 'POST' })
                .then(r => r.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert(currentLang === 'nl' ? 'Model gedownload!' : 'Model downloaded!');
                        loadSettingsPanel();
                    } else {
                        alert(data.detail || 'Error');
                    }
                });
        }
    });
// ...existing code...

// Fix: defineer updateActiveModelIndicators zodat error verdwijnt
function updateActiveModelIndicators(modelName) {
    const headerValue = document.getElementById('active-model-header-value');
    const sidebarValue = document.getElementById('active-model-sidebar-value');
    if (headerValue) headerValue.textContent = modelName || '';
    if (sidebarValue) sidebarValue.textContent = modelName || '';
}

// Fix: defineer loadSettingsPanel zodat error verdwijnt
function loadSettingsPanel() {
    // Fix: settings DOM-elementen altijd correct definiëren
    const storageStatus = document.getElementById('storage-status');
    const activeModelSelect = document.getElementById('active-model-select');
    const activateModelBtn = document.getElementById('activate-model-btn');
    const modelsList = document.getElementById('models-list');
    // Check of alle benodigde elementen bestaan
    if (!storageStatus || !activeModelSelect || !activateModelBtn || !modelsList) {
        if (settingsPanel) settingsPanel.innerHTML = '<div style="color:red;">Settings UI error: ontbrekende elementen in template.</div>';
        return;
    }
    // Tabel 1: Gedownloade modellen (direct selecteerbaar)
    const downloadedTable = document.createElement('table');
    downloadedTable.style = 'width:100%;border-collapse:collapse;background:var(--bg-tertiary);margin-bottom:32px;';
    downloadedTable.innerHTML = `
        <caption style="caption-side:top;text-align:left;font-weight:bold;font-size:1.1em;margin-bottom:8px;">Downloaded Models</caption>
        <thead>
            <tr style="background:var(--bg-secondary);">
                <th style="padding:8px;border-bottom:1px solid #444;">${dialogStrings.name || 'Name'}</th>
                <th style="padding:8px;border-bottom:1px solid #444;">${dialogStrings.id || 'ID'}</th>
                <th style="padding:8px;border-bottom:1px solid #444;">${dialogStrings.type || 'Type'}</th>
                <th style="padding:8px;border-bottom:1px solid #444;">${dialogStrings.size || 'Size'} (GB)</th>
                <th style="padding:8px;border-bottom:1px solid #444;">${dialogStrings.description || 'Description'}</th>
                <th style="padding:8px;border-bottom:1px solid #444;">${dialogStrings.action || 'Action'}</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const downloadedTbody = downloadedTable.querySelector('tbody');
    // Tabel 2: Externe modellen (downloadbaar)
    const externalTable = document.createElement('table');
    externalTable.style = 'width:100%;border-collapse:collapse;background:var(--bg-tertiary);';
    externalTable.innerHTML = `
        <caption style="caption-side:top;text-align:left;font-weight:bold;font-size:1.1em;margin-bottom:8px;">Downloadable Models</caption>
        <thead>
            <tr style="background:var(--bg-secondary);">
                <th style="padding:8px;border-bottom:1px solid #444;">${dialogStrings.name || 'Name'}</th>
                <th style="padding:8px;border-bottom:1px solid #444;">${dialogStrings.id || 'ID'}</th>
                <th style="padding:8px;border-bottom:1px solid #444;">${dialogStrings.type || 'Type'}</th>
                <th style="padding:8px;border-bottom:1px solid #444;">${dialogStrings.size || 'Size'} (GB)</th>
                <th style="padding:8px;border-bottom:1px solid #444;">${dialogStrings.description || 'Description'}</th>
                <th style="padding:8px;border-bottom:1px solid #444;">${dialogStrings.action || 'Action'}</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const externalTbody = externalTable.querySelector('tbody');
    // Downloaded models ophalen
    fetch('/api/models/downloaded')
        .then(r => r.json())
        .then(downloadedModels => {
            models.forEach(model => {
                let description = model.description_en || model.description || '';
                const downloaded = downloadedModels.includes(model.id);
                const tr = document.createElement('tr');
                let actionCell = '';
                if (downloaded) {
                    actionCell = `<span style='color:green;'>${dialogStrings.downloaded || 'Downloaded'}</span> <button class="activate-model-btn" data-id="${model.id}">${dialogStrings.activate || 'Activate'}</button>`;
                } else {
                    actionCell = `<button class="download-model-btn" data-id="${model.id}">${dialogStrings.download || 'Download'}</button>`;
                }
                tr.innerHTML = `
                    <td style="padding:8px;border-bottom:1px solid #444;">${model.name}</td>
                    <td style="padding:8px;border-bottom:1px solid #444;">${model.id}</td>
                    <td style="padding:8px;border-bottom:1px solid #444;">${model.type}</td>
                    <td style="padding:8px;border-bottom:1px solid #444;">${model.size_gb}</td>
                    <td style="padding:8px;border-bottom:1px solid #444;">${description}</td>
                    <td style="padding:8px;border-bottom:1px solid #444;">${actionCell}</td>
                `;
                if (downloaded) {
                    downloadedTbody.appendChild(tr);
                } else {
                    externalTbody.appendChild(tr);
                }
            });
            modelsList.innerHTML = '';
            modelsList.appendChild(downloadedTable);
            modelsList.appendChild(externalTable);
        }).catch(() => {
            modelsList.textContent = dialogStrings.error_loading_models || 'Error loading models';
        });
}

// Global functions for code actions
function copyToClipboard(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    });
}

function downloadCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}
