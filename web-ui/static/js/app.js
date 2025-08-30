// TARS AI Assistant - Enhanced with file upload, code formatting, and model persistence

document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messagesContainer = document.getElementById('messages');
    const fileUpload = document.getElementById('file-upload');
    const fileDropZone = document.getElementById('file-drop-zone');
    const modelSelector = document.getElementById('model-selector');
    const statsContainer = document.getElementById('system-stats');
    
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
    
    // Handle incoming messages from WebSocket
    socket.addEventListener('message', function(event) {
        const data = JSON.parse(event.data);
        
        if (data.type === 'system_stats') {
            updateSystemStats(data.data);
        } else if (data.type === 'response') {
            addMessage('TARS', data.message, 'response', data.model);
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
    fileDropZone.addEventListener('click', () => fileUpload.click());
    
    fileDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropZone.classList.add('dragover');
    });
    
    fileDropZone.addEventListener('dragleave', () => {
        fileDropZone.classList.remove('dragover');
    });
    
    fileDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    fileUpload.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    // Send message when send button is clicked
    sendButton.addEventListener('click', sendMessage);
    
    // Send message when Enter key is pressed
    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
    
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
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message && socket.readyState === WebSocket.OPEN) {
            addMessage('You', message, 'user');
            socket.send(JSON.stringify({ message: message }));
            messageInput.value = '';
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
        // Format code blocks
        text = text.replace(/```(\w+)?\s([\s\S]*?)```/g, (match, lang, code) => {
            return `
                <div class="code-block">
                    <div class="code-header">
                        <span>${lang || 'code'}</span>
                        <div class="code-actions">
                            <button class="code-btn" onclick="copyToClipboard(this)">Copy</button>
                            <button class="code-btn" onclick="downloadCode(this)">Download</button>
                        </div>
                    </div>
                    <pre><code>${escapeHtml(code.trim())}</code></pre>
                </div>
            `;
        });
        
        // Format inline code
        text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        
        // Format newlines
        text = text.replace(/\n/g, '<br>');
        
        return text;
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
            .then(response => response.json())
            .then(availableModels => {
                modelSelector.innerHTML = '';
                
                Object.entries(availableModels).forEach(([value, label]) => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = label;
                    modelSelector.appendChild(option);
                });
                
                // Select current model
                fetch('/api/stats')
                    .then(response => response.json())
                    .then(stats => {
                        modelSelector.value = stats.current_model;
                    });
            })
            .catch(error => {
                console.error('Error loading models:', error);
                modelSelector.innerHTML = '';
                const option = document.createElement('option');
                option.text = 'Error loading models';
                modelSelector.appendChild(option);
            });
    }
    
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
    
    function startStatsUpdates() {
        setInterval(() => {
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
    const lang = codeBlock.querySelector('.code-header span').textContent;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${lang || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
}
