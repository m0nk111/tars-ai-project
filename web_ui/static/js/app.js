// TARS AI Assistant - Enhanced with file upload, code formatting, and model persistence
document.addEventListener('DOMContentLoaded', () => {
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
    // Theme toggle logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    function setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('light-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        localStorage.setItem('theme', theme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

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
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
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
            
            fetch('/api/upload', {
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
        } else {
            sendButton.classList.remove('disabled');
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
    
    function loadAvailableModels() {
        fetch('/api/models')
            .then(r => r.json())
            .then(models => {
                // Verwijder de 'Loading models...' optie als die er nog staat
                const loadingOption = document.getElementById('loading-models');
                if (loadingOption) {
                    loadingOption.remove();
                }
                modelSelector.innerHTML = '';
                Object.entries(models).forEach(([value, label]) => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = label;
                    modelSelector.appendChild(option);
                });
                return fetch('/api/stats');
            })
            .then(r => r.json())
            .then(stats => {
                modelSelector.value = stats.current_model;
            })
            .catch(() => {
                modelSelector.innerHTML = '<option>Error loading models</option>';
            });
    }
    
    // Toon direct een melding als er geen modellen zijn
    function switchModel(model) {
        fetch('/api/switch-model', {
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
