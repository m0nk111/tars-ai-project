// TARS AI Assistant - Enhanced with file upload, code formatting, and model persistence
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
    const modelSelector = $('model-selector');
    const statsContainer = $('system-stats');
    
    // Establish WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
    
    // Handle WebSocket connection open
    socket.addEventListener('open', function(event) {
        console.log('WebSocket connection established');
        addMessage('System', 'Connected to TARS AI Assistant', 'system');
        loadAvailableModels();
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
    if (fileUpload) {
        fileUpload.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }
    
    // Send message when send button is clicked
    sendButton.addEventListener('click', sendMessage);

    // Send message when Enter key is pressed
    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // Add loading indicator
    // Use floating spinner window for thinking animation

    function showThinking() {
        if (thinkingIndicator) thinkingIndicator.style.display = 'flex';
    }
    function hideThinking() {
        if (thinkingIndicator) thinkingIndicator.style.display = 'none';
    }
    
    // Handle model selection change
    modelSelector.addEventListener('change', function() {
        switchModel(this.value);
    });
    
    function handleFiles(files) {
        if (files.length === 0) return;
        
        Array.from(files).forEach(file => {
            const formData = new FormData();
            formData.append('file', file);
            
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
    }
    
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
        if (message && socket.readyState === WebSocket.OPEN) {
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
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
    
    // Model selector loading fix
    function showModelLoading() {
        modelSelector.innerHTML = '<option id="loading-models">Loading models...</option>';
        updateActiveModelIndicators('...');
    }
    showModelLoading();
    function loadAvailableModels() {
        showModelLoading();
    fetch(window.location.origin + '/api/models')
            .then(r => r.json())
            .then(models => {
                modelSelector.innerHTML = '';
                let found = false;
                Object.entries(models).forEach(([value, label]) => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = label;
                    modelSelector.appendChild(option);
                    found = true;
                });
                if (!found) {
                    modelSelector.innerHTML = '<option>No models found</option>';
                    updateActiveModelIndicators('None');
                    setInputBlocked(true);
                    addMessage('System', 'Geen modellen beschikbaar. Backend werkt niet of is leeg.', 'error');
                    return;
                }
                setInputBlocked(false);
            return fetch(window.location.origin + '/api/stats');
            })
            .then(r => r ? r.json() : null)
            .then(stats => {
                if (stats && stats.current_model) {
                    modelSelector.value = stats.current_model;
                    updateActiveModelIndicators(stats.current_model);
                    setInputBlocked(false);
                } else {
                    setInputBlocked(true);
                }
            })
            .catch(() => {
                modelSelector.innerHTML = '<option>Error loading models</option>';
                updateActiveModelIndicators('Error');
                setInputBlocked(true);
                addMessage('System', 'Fout bij het laden van modellen.', 'error');
            });
    }
    function switchModel(model) {
        updateActiveModelIndicators('...');
        fetch(window.location.origin + '/api/switch-model', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ model: model })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                addMessage('System', `Model switched to: ${model}`, 'system');
                updateActiveModelIndicators(model);
                loadAvailableModels();
            } else {
                addMessage('System', `Error: ${data.message}`, 'error');
                loadAvailableModels();
            }
        })
        .catch(error => {
            console.error('Error switching model:', error);
            addMessage('System', 'Error switching model', 'error');
            loadAvailableModels();
        });
    }
    
    function updateActiveModelIndicators(modelName) {
        const headerValue = document.getElementById('active-model-header-value');
        const sidebarValue = document.getElementById('active-model-sidebar-value');
        if (headerValue) headerValue.textContent = modelName;
        if (sidebarValue) sidebarValue.textContent = modelName;
    }
    
    // Always load models on page open
    loadAvailableModels();
    
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
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "get_stats" }));
            }
        }, 5000);
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "get_stats" }));
        }
    }

    // Settings panel logic
    // settingsPanel en chatSection zijn al gedeclareerd bovenaan
    const navBtns = document.querySelectorAll('.nav-btn');
    const activeModelSelect = document.getElementById('active-model-select');
    const activateModelBtn = document.getElementById('activate-model-btn');
    const modelsList = document.getElementById('models-list');
    const storageStatus = document.getElementById('storage-status');
    const languageSelect = document.getElementById('language-select');
    // Default language is English
    let currentLang = 'en';
    if (localStorage.getItem('lang')) {
        currentLang = localStorage.getItem('lang');
        languageSelect.value = currentLang;
    }
    languageSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('lang', currentLang);
        loadSettingsPanel();
    });

    navBtns[0].addEventListener('click', () => {
        chatSection.style.display = '';
        settingsPanel.style.display = 'none';
        navBtns[0].classList.add('active');
        navBtns[1].classList.remove('active');
    });
    navBtns[1].addEventListener('click', () => {
        console.log('Settings knop geklikt');
        chatSection.style.display = 'none';
        settingsPanel.style.display = '';
        navBtns[1].classList.add('active');
        navBtns[0].classList.remove('active');
        loadSettingsPanel();
    });

    function loadSettingsPanel() {
        // Load storage status
        fetch('/api/storage/free')
            .then(r => r.json())
            .then(data => {
                storageStatus.textContent = currentLang === 'nl'
                    ? `Beschikbare ruimte: ${data.free_gb} GB`
                    : `Available space: ${data.free_gb} GB`;
            });
        // Load downloaded models
        fetch('/api/models/downloaded')
            .then(r => r.json())
            .then(downloaded => {
                activeModelSelect.innerHTML = '';
                downloaded.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m;
                    opt.textContent = m;
                    activeModelSelect.appendChild(opt);
                });
                fetch('/api/models/active')
                    .then(r => r.json())
                    .then(active => {
                        if (active) activeModelSelect.value = active;
                    });
            });
        // Load all models with details
        fetch('/api/models/all')
            .then(r => r.json())
            .then(models => {
                modelsList.innerHTML = '';
                models.forEach(model => {
                    const div = document.createElement('div');
                    div.className = 'model-item';
                    div.style = 'margin-bottom:18px;padding:12px;border-radius:8px;background:var(--bg-tertiary);';
                    let downloaded = false;
                    fetch('/api/models/downloaded')
                        .then(r => r.json())
                        .then(downloadedModels => {
                            downloaded = downloadedModels.includes(model.id);
                            div.innerHTML = `
                                <strong>${model.name}</strong> (${model.id})<br>
                                ${currentLang === 'nl' ? 'Type' : 'Type'}: ${model.type}<br>
                                ${currentLang === 'nl' ? 'Grootte' : 'Size'}: ${model.size_gb} GB<br>
                                ${currentLang === 'nl' ? 'Beschrijving' : 'Description'}: ${model.description}<br>
                                <button class="download-model-btn" data-id="${model.id}" ${downloaded ? 'disabled' : ''}>
                                    ${downloaded ? (currentLang === 'nl' ? 'Gedownload' : 'Downloaded') : (currentLang === 'nl' ? 'Downloaden' : 'Download')}
                                </button>
                            `;
                            modelsList.appendChild(div);
                        });
                });
            });
    }
    activateModelBtn.addEventListener('click', () => {
        const modelId = activeModelSelect.value;
        fetch(`/api/models/activate/${modelId}`, { method: 'POST' })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(currentLang === 'nl' ? 'Model geactiveerd!' : 'Model activated!');
                    loadSettingsPanel();
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
    // Settings knop event alleen via navBtns[1]
});

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

// TARS AI Assistant - Enhanced with file upload, code formatting, and model persistence
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
    const modelSelector = $('model-selector');
    const statsContainer = $('system-stats');
    
    // Establish WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
    
    // Handle WebSocket connection open
    socket.addEventListener('open', function(event) {
        console.log('WebSocket connection established');
        addMessage('System', 'Connected to TARS AI Assistant', 'system');
        loadAvailableModels();
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
    if (fileUpload) {
        fileUpload.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }
    
    // Send message when send button is clicked
    sendButton.addEventListener('click', sendMessage);

    // Send message when Enter key is pressed
    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // Add loading indicator
    // Use floating spinner window for thinking animation

    function showThinking() {
        if (thinkingIndicator) thinkingIndicator.style.display = 'flex';
    }
    function hideThinking() {
        if (thinkingIndicator) thinkingIndicator.style.display = 'none';
    }
    
    // Handle model selection change
    modelSelector.addEventListener('change', function() {
        switchModel(this.value);
    });
    
    function handleFiles(files) {
        if (files.length === 0) return;
        
        Array.from(files).forEach(file => {
            const formData = new FormData();
            formData.append('file', file);
            
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
    }
    
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
        if (message && socket.readyState === WebSocket.OPEN) {
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
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
    
    // Model selector loading fix
    function showModelLoading() {
        modelSelector.innerHTML = '<option id="loading-models">Loading models...</option>';
        updateActiveModelIndicators('...');
    }
    showModelLoading();
    function loadAvailableModels() {
        showModelLoading();
    fetch(window.location.origin + '/api/models')
            .then(r => r.json())
            .then(models => {
                modelSelector.innerHTML = '';
                let found = false;
                Object.entries(models).forEach(([value, label]) => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = label;
                    modelSelector.appendChild(option);
                    found = true;
                });
                if (!found) {
                    modelSelector.innerHTML = '<option>No models found</option>';
                    updateActiveModelIndicators('None');
                    setInputBlocked(true);
                    addMessage('System', 'Geen modellen beschikbaar. Backend werkt niet of is leeg.', 'error');
                    return;
                }
                setInputBlocked(false);
            return fetch(window.location.origin + '/api/stats');
            })
            .then(r => r ? r.json() : null)
            .then(stats => {
                if (stats && stats.current_model) {
                    modelSelector.value = stats.current_model;
                    updateActiveModelIndicators(stats.current_model);
                    setInputBlocked(false);
                } else {
                    setInputBlocked(true);
                }
            })
            .catch(() => {
                modelSelector.innerHTML = '<option>Error loading models</option>';
                updateActiveModelIndicators('Error');
                setInputBlocked(true);
                addMessage('System', 'Fout bij het laden van modellen.', 'error');
            });
    }
    function switchModel(model) {
        updateActiveModelIndicators('...');
        fetch(window.location.origin + '/api/switch-model', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ model: model })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                addMessage('System', `Model switched to: ${model}`, 'system');
                updateActiveModelIndicators(model);
                loadAvailableModels();
            } else {
                addMessage('System', `Error: ${data.message}`, 'error');
                loadAvailableModels();
            }
        })
        .catch(error => {
            console.error('Error switching model:', error);
            addMessage('System', 'Error switching model', 'error');
            loadAvailableModels();
        });
    }
    
    function updateActiveModelIndicators(modelName) {
        const headerValue = document.getElementById('active-model-header-value');
        const sidebarValue = document.getElementById('active-model-sidebar-value');
        if (headerValue) headerValue.textContent = modelName;
        if (sidebarValue) sidebarValue.textContent = modelName;
    }
    
    // Always load models on page open
    loadAvailableModels();
    
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
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "get_stats" }));
            }
        }, 5000);
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "get_stats" }));
        }
    }

    // Settings panel logic
    // settingsPanel en chatSection zijn al gedeclareerd bovenaan
    const navBtns = document.querySelectorAll('.nav-btn');
    const activeModelSelect = document.getElementById('active-model-select');
    const activateModelBtn = document.getElementById('activate-model-btn');
    const modelsList = document.getElementById('models-list');
    const storageStatus = document.getElementById('storage-status');
    const languageSelect = document.getElementById('language-select');
    // Default language is English
    let currentLang = 'en';
    if (localStorage.getItem('lang')) {
        currentLang = localStorage.getItem('lang');
        languageSelect.value = currentLang;
    }
    languageSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('lang', currentLang);
        loadSettingsPanel();
    });

    navBtns[0].addEventListener('click', () => {
        chatSection.style.display = '';
        settingsPanel.style.display = 'none';
        navBtns[0].classList.add('active');
        navBtns[1].classList.remove('active');
    });
    navBtns[1].addEventListener('click', () => {
        console.log('Settings knop geklikt');
        chatSection.style.display = 'none';
        settingsPanel.style.display = '';
        navBtns[1].classList.add('active');
        navBtns[0].classList.remove('active');
        loadSettingsPanel();
    });

    function loadSettingsPanel() {
        // Load storage status
        fetch('/api/storage/free')
            .then(r => r.json())
            .then(data => {
                storageStatus.textContent = currentLang === 'nl'
                    ? `Beschikbare ruimte: ${data.free_gb} GB`
                    : `Available space: ${data.free_gb} GB`;
            });
        // Load downloaded models
        fetch('/api/models/downloaded')
            .then(r => r.json())
            .then(downloaded => {
                activeModelSelect.innerHTML = '';
                downloaded.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m;
                    opt.textContent = m;
                    activeModelSelect.appendChild(opt);
                });
                fetch('/api/models/active')
                    .then(r => r.json())
                    .then(active => {
                        if (active) activeModelSelect.value = active;
                    });
            });
        // Load all models with details
        fetch('/api/models/all')
            .then(r => r.json())
            .then(models => {
                modelsList.innerHTML = '';
                models.forEach(model => {
                    const div = document.createElement('div');
                    div.className = 'model-item';
                    div.style = 'margin-bottom:18px;padding:12px;border-radius:8px;background:var(--bg-tertiary);';
                    let downloaded = false;
                    fetch('/api/models/downloaded')
                        .then(r => r.json())
                        .then(downloadedModels => {
                            downloaded = downloadedModels.includes(model.id);
                            div.innerHTML = `
                                <strong>${model.name}</strong> (${model.id})<br>
                                ${currentLang === 'nl' ? 'Type' : 'Type'}: ${model.type}<br>
                                ${currentLang === 'nl' ? 'Grootte' : 'Size'}: ${model.size_gb} GB<br>
                                ${currentLang === 'nl' ? 'Beschrijving' : 'Description'}: ${model.description}<br>
                                <button class="download-model-btn" data-id="${model.id}" ${downloaded ? 'disabled' : ''}>
                                    ${downloaded ? (currentLang === 'nl' ? 'Gedownload' : 'Downloaded') : (currentLang === 'nl' ? 'Downloaden' : 'Download')}
                                </button>
                            `;
                            modelsList.appendChild(div);
                        });
                });
            });
    }
    activateModelBtn.addEventListener('click', () => {
        const modelId = activeModelSelect.value;
        fetch(`/api/models/activate/${modelId}`, { method: 'POST' })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(currentLang === 'nl' ? 'Model geactiveerd!' : 'Model activated!');
                    loadSettingsPanel();
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
    // Settings knop event alleen via navBtns[1]
});

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

// TARS AI Assistant - Enhanced with file upload, code formatting, and model persistence
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
    const modelSelector = $('model-selector');
    const statsContainer = $('system-stats');
    
    // Establish WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
    
    // Handle WebSocket connection open
    socket.addEventListener('open', function(event) {
        console.log('WebSocket connection established');
        addMessage('System', 'Connected to TARS AI Assistant', 'system');
        loadAvailableModels();
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
    if (fileUpload) {
        fileUpload.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }
    
    // Send message when send button is clicked
    sendButton.addEventListener('click', sendMessage);

    // Send message when Enter key is pressed
    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // Add loading indicator
    // Use floating spinner window for thinking animation

    function showThinking() {
        if (thinkingIndicator) thinkingIndicator.style.display = 'flex';
    }
    function hideThinking() {
        if (thinkingIndicator) thinkingIndicator.style.display = 'none';
    }
    
    // Handle model selection change
    modelSelector.addEventListener('change', function() {
        switchModel(this.value);
    });
    
    function handleFiles(files) {
        if (files.length === 0) return;
        
        Array.from(files).forEach(file => {
            const formData = new FormData();
            formData.append('file', file);
            
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
    }
    
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
        if (message && socket.readyState === WebSocket.OPEN) {
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
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
    
    // Model selector loading fix
    function showModelLoading() {
        modelSelector.innerHTML = '<option id="loading-models">Loading models...</option>';
        updateActiveModelIndicators('...');
    }
    showModelLoading();
    function loadAvailableModels() {
        showModelLoading();
    fetch(window.location.origin + '/api/models')
            .then(r => r.json())
            .then(models => {
                modelSelector.innerHTML = '';
                let found = false;
                Object.entries(models).forEach(([value, label]) => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = label;
                    modelSelector.appendChild(option);
                    found = true;
                });
                if (!found) {
                    modelSelector.innerHTML = '<option>No models found</option>';
                    updateActiveModelIndicators('None');
                    setInputBlocked(true);
                    addMessage('System', 'Geen modellen beschikbaar. Backend werkt niet of is leeg.', 'error');
                    return;
                }
                setInputBlocked(false);
            return fetch(window.location.origin + '/api/stats');
            })
            .then(r => r ? r.json() : null)
            .then(stats => {
                if (stats && stats.current_model) {
                    modelSelector.value = stats.current_model;
                    updateActiveModelIndicators(stats.current_model);
                    setInputBlocked(false);
                } else {
                    setInputBlocked(true);
                }
            })
            .catch(() => {
                modelSelector.innerHTML = '<option>Error loading models</option>';
                updateActiveModelIndicators('Error');
                setInputBlocked(true);
                addMessage('System', 'Fout bij het laden van modellen.', 'error');
            });
    }
    function switchModel(model) {
        updateActiveModelIndicators('...');
        fetch(window.location.origin + '/api/switch-model', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ model: model })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                addMessage('System', `Model switched to: ${model}`, 'system');
                updateActiveModelIndicators(model);
                loadAvailableModels();
            } else {
                addMessage('System', `Error: ${data.message}`, 'error');
                loadAvailableModels();
            }
        })
        .catch(error => {
            console.error('Error switching model:', error);
            addMessage('System', 'Error switching model', 'error');
            loadAvailableModels();
        });
    }
    
    function updateActiveModelIndicators(modelName) {
        const headerValue = document.getElementById('active-model-header-value');
        const sidebarValue = document.getElementById('active-model-sidebar-value');
        if (headerValue) headerValue.textContent = modelName;
        if (sidebarValue) sidebarValue.textContent = modelName;
    }
    
    // Always load models on page open
    loadAvailableModels();
    
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
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "get_stats" }));
            }
        }, 5000);
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "get_stats" }));
        }
    }

    // Settings panel logic
    // settingsPanel en chatSection zijn al gedeclareerd bovenaan
    const navBtns = document.querySelectorAll('.nav-btn');
    const activeModelSelect = document.getElementById('active-model-select');
    const activateModelBtn = document.getElementById('activate-model-btn');
    const modelsList = document.getElementById('models-list');
    const storageStatus = document.getElementById('storage-status');
    const languageSelect = document.getElementById('language-select');
    // Default language is English
    let currentLang = 'en';
    if (localStorage.getItem('lang')) {
        currentLang = localStorage.getItem('lang');
        languageSelect.value = currentLang;
    }
    languageSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('lang', currentLang);
        loadSettingsPanel();
    });

    navBtns[0].addEventListener('click', () => {
        chatSection.style.display = '';
        settingsPanel.style.display = 'none';
        navBtns[0].classList.add('active');
        navBtns[1].classList.remove('active');
    });
    navBtns[1].addEventListener('click', () => {
        console.log('Settings knop geklikt');
        chatSection.style.display = 'none';
        settingsPanel.style.display = '';
        navBtns[1].classList.add('active');
        navBtns[0].classList.remove('active');
        loadSettingsPanel();
    });

    function loadSettingsPanel() {
        // Load storage status
        fetch('/api/storage/free')
            .then(r => r.json())
            .then(data => {
                storageStatus.textContent = currentLang === 'nl'
                    ? `Beschikbare ruimte: ${data.free_gb} GB`
                    : `Available space: ${data.free_gb} GB`;
            });
        // Load downloaded models
        fetch('/api/models/downloaded')
            .then(r => r.json())
            .then(downloaded => {
                activeModelSelect.innerHTML = '';
                downloaded.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m;
                    opt.textContent = m;
                    activeModelSelect.appendChild(opt);
                });
                fetch('/api/models/active')
                    .then(r => r.json())
                    .then(active => {
                        if (active) activeModelSelect.value = active;
                    });
            });
        // Load all models with details
        fetch('/api/models/all')
            .then(r => r.json())
            .then(models => {
                modelsList.innerHTML = '';
                models.forEach(model => {
                    const div = document.createElement('div');
                    div.className = 'model-item';
                    div.style = 'margin-bottom:18px;padding:12px;border-radius:8px;background:var(--bg-tertiary);';
                    let downloaded = false;
                    fetch('/api/models/downloaded')
                        .then(r => r.json())
                        .then(downloadedModels => {
                            downloaded = downloadedModels.includes(model.id);
                            div.innerHTML = `
                                <strong>${model.name}</strong> (${model.id})<br>
                                ${currentLang === 'nl' ? 'Type' : 'Type'}: ${model.type}<br>
                                ${currentLang === 'nl' ? 'Grootte' : 'Size'}: ${model.size_gb} GB<br>
                                ${currentLang === 'nl' ? 'Beschrijving' : 'Description'}: ${model.description}<br>
                                <button class="download-model-btn" data-id="${model.id}" ${downloaded ? 'disabled' : ''}>
                                    ${downloaded ? (currentLang === 'nl' ? 'Gedownload' : 'Downloaded') : (currentLang === 'nl' ? 'Downloaden' : 'Download')}
                                </button>
                            `;
                            modelsList.appendChild(div);
                        });
                });
            });
    }
    activateModelBtn.addEventListener('click', () => {
        const modelId = activeModelSelect.value;
        fetch(`/api/models/activate/${modelId}`, { method: 'POST' })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(currentLang === 'nl' ? 'Model geactiveerd!' : 'Model activated!');
                    loadSettingsPanel();
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
    // Settings knop event alleen via navBtns[1]
});

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
