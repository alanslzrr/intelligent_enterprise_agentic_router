// Global state
let ws = null;
let selectedFile = null;
let uploadedFilePath = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeTabs();
    initializeFileUpload();
    initializeEventListeners();
    loadDataFiles();
});

// Theme Management
function initializeTheme() {
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', currentTheme === 'dark');
        localStorage.setItem('theme', currentTheme);
    });
}

// Tab Management
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.dataset.tab;
            
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            document.getElementById(`${targetPanel}-panel`).classList.add('active');
        });
    });
}

// File Upload Management
function initializeFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const uploadedFile = document.getElementById('uploadedFile');
    const removeFile = document.getElementById('removeFile');
    
    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'hsl(var(--primary))';
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '';
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
    
    // Remove file
    removeFile.addEventListener('click', (e) => {
        e.stopPropagation();
        clearUploadedFile();
    });
}

async function handleFileUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            uploadedFilePath = result.path;
            displayUploadedFile(result.filename, result.size);
        } else {
            showError('Failed to upload file');
        }
    } catch (error) {
        showError('Error uploading file: ' + error.message);
    }
}

function displayUploadedFile(filename, size) {
    const uploadZone = document.getElementById('uploadZone');
    const uploadedFile = document.getElementById('uploadedFile');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    
    uploadZone.style.display = 'none';
    uploadedFile.style.display = 'flex';
    fileName.textContent = filename;
    fileSize.textContent = formatFileSize(size);
}

function clearUploadedFile() {
    const uploadZone = document.getElementById('uploadZone');
    const uploadedFile = document.getElementById('uploadedFile');
    const fileInput = document.getElementById('fileInput');
    
    uploadZone.style.display = 'block';
    uploadedFile.style.display = 'none';
    fileInput.value = '';
    uploadedFilePath = null;
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Load Data Files
async function loadDataFiles() {
    const fileList = document.getElementById('fileList');
    
    try {
        const response = await fetch('/api/data-files');
        const data = await response.json();
        
        fileList.innerHTML = '';
        
        if (data.files.length === 0) {
            fileList.innerHTML = '<div class="loading">No example files available</div>';
            return;
        }
        
        data.files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    <div class="file-details">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${formatFileSize(file.size)}</span>
                    </div>
                </div>
            `;
            
            fileItem.addEventListener('click', () => {
                // Remove selection from all items
                document.querySelectorAll('.file-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Select this item
                fileItem.classList.add('selected');
                selectedFile = file.path;
            });
            
            fileList.appendChild(fileItem);
        });
    } catch (error) {
        fileList.innerHTML = '<div class="loading">Error loading files</div>';
        console.error('Error loading files:', error);
    }
}

// Event Listeners
function initializeEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    processBtn.addEventListener('click', processWorkflow);
    clearBtn.addEventListener('click', clearAll);
}

function clearAll() {
    // Clear text input
    document.getElementById('textInput').value = '';
    
    // Clear uploaded file
    clearUploadedFile();
    
    // Clear selected file
    selectedFile = null;
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Clear timeline and results
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = `
        <div class="timeline-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <p>No workflow executed yet</p>
            <p class="text-muted">Start by entering text, uploading a file, or selecting an example</p>
        </div>
    `;
    
    document.getElementById('results').style.display = 'none';
    updateStatus('idle', 'Idle');
}

// Process Workflow
async function processWorkflow() {
    const textInput = document.getElementById('textInput').value.trim();
    const activeTab = document.querySelector('.tab.active').dataset.tab;
    
    let workflowData = {};
    
    // Determine input source
    if (activeTab === 'text') {
        if (!textInput) {
            showError('Please enter some text');
            return;
        }
        workflowData.text = textInput;
    } else if (activeTab === 'upload') {
        if (!uploadedFilePath) {
            showError('Please upload a file');
            return;
        }
        workflowData.file_path = uploadedFilePath;
    } else if (activeTab === 'browse') {
        if (!selectedFile) {
            showError('Please select a file');
            return;
        }
        workflowData.file_path = selectedFile;
    }
    
    // Clear previous results
    document.getElementById('timeline').innerHTML = '';
    document.getElementById('results').style.display = 'none';
    
    // Update status
    updateStatus('processing', 'Processing...');
    
    // Disable process button
    const processBtn = document.getElementById('processBtn');
    processBtn.disabled = true;
    
    // Connect WebSocket
    connectWebSocket(workflowData);
}

// WebSocket Connection
function connectWebSocket(workflowData) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
        console.log('WebSocket connected');
        ws.send(JSON.stringify(workflowData));
    };
    
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        showError('Connection error. Trying REST API...');
        
        // Fallback to REST API
        executeWorkflowREST(workflowData);
    };
    
    ws.onclose = () => {
        console.log('WebSocket closed');
        const processBtn = document.getElementById('processBtn');
        processBtn.disabled = false;
    };
}

// Handle WebSocket Messages
function handleWebSocketMessage(message) {
    const timeline = document.getElementById('timeline');
    
    switch (message.type) {
        case 'status':
            addTimelineItem('info', '📋 Status', message.message, message.timestamp);
            updateStatus('processing', message.message);
            break;
            
        case 'agent_start':
            addAgentStartItem(message.agent, message.timestamp, message.step);
            updateStatus('processing', `Processing: ${message.agent}`);
            break;
            
        case 'agent_input':
            addAgentInputItem(message.agent, message.input, message.timestamp);
            break;
            
        case 'agent_thinking':
            addAgentThinkingItem(message.agent, message.reasoning, message.response, message.timestamp);
            break;
            
        case 'agent_end':
            addAgentEndItem(message.agent, message.output, message.usage, message.timestamp);
            break;
            
        case 'handoff':
            addTimelineItem('handoff', '🔄 Handoff', 
                `Transferring from <strong>${message.from_agent}</strong> to <strong>${message.to_agent}</strong>`, 
                message.timestamp);
            break;
            
        case 'tool_start':
            addTimelineItem('tool', '🔧 Tool', `${message.agent} using ${message.tool}`, message.timestamp);
            break;
            
        case 'result':
            displayResults(message.result);
            addTimelineItem('complete', '✅ Complete', 'Workflow finished successfully', message.timestamp);
            updateStatus('success', 'Completed');
            document.getElementById('processBtn').disabled = false;
            if (ws) ws.close();
            break;
            
        case 'error':
            addTimelineItem('error', '❌ Error', message.message, message.timestamp);
            updateStatus('error', 'Error');
            showError(message.message);
            document.getElementById('processBtn').disabled = false;
            if (ws) ws.close();
            break;
    }
    
    // Auto-scroll timeline
    timeline.scrollTop = timeline.scrollHeight;
}

function updateProgressBar(progress) {
    // Removed - we don't need fake progress bars
}

// ================================================================================
// NEW: Enhanced Timeline Item Functions
// ================================================================================

function addAgentStartItem(agentName, timestamp, step) {
    const timeline = document.getElementById('timeline');
    const item = document.createElement('div');
    item.className = 'timeline-item agent-start';
    item.dataset.agent = agentName;
    
    const formattedTime = formatTimestamp(timestamp);
    
    item.innerHTML = `
        <div class="timeline-icon agent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
        </div>
        <div class="timeline-content">
            <div class="timeline-header">
                <div class="timeline-title">
                    <span class="agent-badge">${agentName}</span>
                    <span class="step-badge">Step ${step}</span>
                </div>
                <div class="timeline-time">${formattedTime}</div>
            </div>
            <div class="timeline-description">Starting processing...</div>
        </div>
    `;
    
    timeline.appendChild(item);
}

function addAgentInputItem(agentName, input, timestamp) {
    const timeline = document.getElementById('timeline');
    
    // Find the last item for this agent
    const agentItems = Array.from(timeline.querySelectorAll(`[data-agent="${agentName}"]`));
    const lastItem = agentItems[agentItems.length - 1];
    
    if (lastItem) {
        const content = lastItem.querySelector('.timeline-content');
        const existingInput = content.querySelector('.agent-input-section');
        
        if (!existingInput && input && input.trim()) {
            const inputSection = document.createElement('div');
            inputSection.className = 'agent-input-section collapsible';
            inputSection.innerHTML = `
                <div class="section-header" onclick="toggleSection(this)">
                    <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    <strong>Input</strong>
                </div>
                <div class="section-content">
                    <pre class="code-block">${escapeHtml(input)}</pre>
                </div>
            `;
            content.appendChild(inputSection);
        }
    }
}

function addAgentThinkingItem(agentName, reasoning, response, timestamp) {
    const timeline = document.getElementById('timeline');
    
    // Find the last item for this agent
    const agentItems = Array.from(timeline.querySelectorAll(`[data-agent="${agentName}"]`));
    const lastItem = agentItems[agentItems.length - 1];
    
    if (lastItem) {
        const content = lastItem.querySelector('.timeline-content');
        
        // Add reasoning if available
        if (reasoning && reasoning.trim()) {
            const existingThinking = content.querySelector('.agent-thinking-section');
            if (!existingThinking) {
                const thinkingSection = document.createElement('div');
                thinkingSection.className = 'agent-thinking-section collapsible collapsed';
                thinkingSection.innerHTML = `
                    <div class="section-header" onclick="toggleSection(this)">
                        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                        <strong>💭 Reasoning</strong>
                    </div>
                    <div class="section-content">
                        <pre class="code-block">${escapeHtml(reasoning)}</pre>
                    </div>
                `;
                content.appendChild(thinkingSection);
            }
        }
        
        // Update description to show thinking in progress
        const description = lastItem.querySelector('.timeline-description');
        if (description) {
            description.innerHTML = '🧠 Processing and reasoning...';
        }
    }
}

function addAgentEndItem(agentName, output, usage, timestamp) {
    const timeline = document.getElementById('timeline');
    
    // Find the last item for this agent
    const agentItems = Array.from(timeline.querySelectorAll(`[data-agent="${agentName}"]`));
    const lastItem = agentItems[agentItems.length - 1];
    
    if (lastItem) {
        const content = lastItem.querySelector('.timeline-content');
        
        // Update description with completion
        const description = lastItem.querySelector('.timeline-description');
        if (description && usage) {
            description.innerHTML = `
                ✅ Completed
                <span class="token-usage">
                    📊 ${usage.total_tokens} tokens
                    <span class="token-detail">(in: ${usage.input_tokens}, out: ${usage.output_tokens})</span>
                </span>
            `;
        }
        
        // Add output section
        if (output && Object.keys(output).length > 0) {
            const existingOutput = content.querySelector('.agent-output-section');
            if (!existingOutput) {
                const outputSection = document.createElement('div');
                outputSection.className = 'agent-output-section collapsible collapsed';
                
                const formattedOutput = formatAgentOutput(output);
                
                outputSection.innerHTML = `
                    <div class="section-header" onclick="toggleSection(this)">
                        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                        <strong>Output</strong>
                    </div>
                    <div class="section-content">
                        ${formattedOutput}
                    </div>
                `;
                content.appendChild(outputSection);
            }
        }
        
        // Mark as complete
        lastItem.classList.add('completed');
    }
}

function toggleSection(header) {
    const section = header.parentElement;
    section.classList.toggle('collapsed');
}

function formatAgentOutput(output) {
    // Check if it's a simple value
    if (output.value !== undefined && Object.keys(output).length === 1) {
        return `<pre class="code-block">${escapeHtml(output.value)}</pre>`;
    }
    
    // Try to format as structured data
    let html = '<div class="output-structured">';
    
    for (const [key, value] of Object.entries(output)) {
        if (value === null || value === undefined || value === '') continue;
        
        const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (typeof value === 'object' && !Array.isArray(value)) {
            html += `<div class="output-field">
                <strong>${displayKey}:</strong>
                <div class="output-nested">${formatNestedObject(value)}</div>
            </div>`;
        } else if (Array.isArray(value)) {
            html += `<div class="output-field">
                <strong>${displayKey}:</strong>
                <ul class="output-list">
                    ${value.map(v => `<li>${escapeHtml(String(v))}</li>`).join('')}
                </ul>
            </div>`;
        } else {
            html += `<div class="output-field">
                <strong>${displayKey}:</strong> ${escapeHtml(String(value))}
            </div>`;
        }
    }
    
    html += '</div>';
    return html;
}

function formatNestedObject(obj) {
    let html = '<div class="nested-object">';
    for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined || value === '') continue;
        const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        html += `<div><strong>${displayKey}:</strong> ${escapeHtml(String(value))}</div>`;
    }
    html += '</div>';
    return html;
}

function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ================================================================================
// Add Timeline Item (Legacy function - still used for simple items)
// ================================================================================
function addTimelineItem(type, title, description, timestamp, meta = null) {
    const timeline = document.getElementById('timeline');
    
    const item = document.createElement('div');
    item.className = 'timeline-item';
    
    const iconMap = {
        agent: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>`,
        tool: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>`,
        handoff: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>`,
        complete: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>`,
        error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>`,
        info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>`
    };
    
    const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    item.innerHTML = `
        <div class="timeline-icon ${type}">
            ${iconMap[type] || iconMap.info}
        </div>
        <div class="timeline-content">
            <div class="timeline-header">
                <div class="timeline-title">${title}</div>
                <div class="timeline-time">${formattedTime}</div>
            </div>
            <div class="timeline-description">${description}</div>
            ${meta ? `<div class="timeline-meta">${truncateText(meta, 200)}</div>` : ''}
        </div>
    `;
    
    timeline.appendChild(item);
}

// Display Results
function displayResults(result) {
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    resultsDiv.style.display = 'block';
    
    let html = '';
    
    // Determine the route type and format accordingly
    const route = result.final_route || result.route || 'unknown';
    const payload = result.payload || result;
    
    // Route Badge
    html += `
        <div class="result-section result-header">
            <div class="route-badge ${getRouteBadgeClass(route)}">
                ${getRouteIcon(route)} ${formatRouteName(route)}
            </div>
        </div>
    `;
    
    // Route-specific formatting
    if (route.includes('hr_cv')) {
        html += formatHRCVOutput(payload, route);
    } else if (route.includes('sales')) {
        html += formatSalesOutput(payload, route);
    } else if (route.includes('events')) {
        html += formatEventsOutput(payload, route);
    } else if (route.includes('guardrails')) {
        html += formatGuardrailsOutput(payload);
    } else {
        html += formatGenericOutput(payload);
    }
    
    // Expandable JSON section
    html += `
        <div class="result-section collapsible collapsed">
            <div class="section-header" onclick="toggleSection(this)">
                <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <strong>Raw JSON Output</strong>
            </div>
            <div class="section-content">
                <pre class="result-json">${JSON.stringify(result, null, 2)}</pre>
            </div>
        </div>
    `;
    
    resultsContent.innerHTML = html;
}

function getRouteBadgeClass(route) {
    if (route.includes('reject') || route.includes('block')) return 'route-reject';
    if (route.includes('forward')) return 'route-forward';
    if (route.includes('sales')) return 'route-sales';
    if (route.includes('hr')) return 'route-hr';
    if (route.includes('events')) return 'route-events';
    return 'route-other';
}

function getRouteIcon(route) {
    if (route.includes('hr')) return '👤';
    if (route.includes('sales')) return '💼';
    if (route.includes('events')) return '📅';
    if (route.includes('reject')) return '❌';
    if (route.includes('block')) return '🚫';
    return '📋';
}

function formatRouteName(route) {
    return route
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function formatHRCVOutput(payload, route) {
    let html = '';
    
    // Reason/Decision
    if (payload.reason) {
        html += `
            <div class="result-section">
                <div class="result-label">Decision Reason</div>
                <div class="result-value">
                    <span class="badge badge-${payload.reason.includes('accept') ? 'success' : 'warning'}">
                        ${payload.reason.replace(/_/g, ' ').toUpperCase()}
                    </span>
                </div>
            </div>
        `;
    }
    
    // CV Extract
    if (payload.cv_extract) {
        const cv = payload.cv_extract;
        html += `
            <div class="result-section">
                <div class="result-label">📋 Candidate Profile</div>
                <div class="result-card">
                    ${cv.full_name ? `<div class="card-row"><strong>Name:</strong> ${cv.full_name}</div>` : ''}
                    ${cv.email ? `<div class="card-row"><strong>Email:</strong> <a href="mailto:${cv.email}">${cv.email}</a></div>` : ''}
                    ${cv.phone ? `<div class="card-row"><strong>Phone:</strong> ${cv.phone}</div>` : ''}
                    ${cv.location ? `<div class="card-row"><strong>Location:</strong> ${cv.location}</div>` : ''}
                    ${cv.years_experience !== undefined ? `<div class="card-row"><strong>Experience:</strong> ${cv.years_experience} years</div>` : ''}
                    ${cv.target_department ? `<div class="card-row"><strong>Target Department:</strong> ${cv.target_department}</div>` : ''}
                    ${cv.skills && cv.skills.length > 0 ? `
                        <div class="card-row">
                            <strong>Skills:</strong>
                            <div class="skills-list">
                                ${cv.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Match Info (for forward routes)
    if (payload.match_info) {
        const match = payload.match_info;
        html += `
            <div class="result-section">
                <div class="result-label">🎯 Role Match</div>
                <div class="result-card">
                    ${match.role_id ? `<div class="card-row"><strong>Role ID:</strong> ${match.role_id}</div>` : ''}
                    ${match.role_title ? `<div class="card-row"><strong>Position:</strong> ${match.role_title}</div>` : ''}
                    ${match.match_score !== undefined ? `
                        <div class="card-row">
                            <strong>Match Score:</strong>
                            <div class="progress-bar-inline">
                                <div class="progress-fill-inline" style="width: ${match.match_score}%">${match.match_score}%</div>
                            </div>
                        </div>
                    ` : ''}
                    ${match.reasoning ? `<div class="card-row"><strong>Reasoning:</strong> ${match.reasoning}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    // Draft Email
    if (payload.draft_email) {
        html += formatDraftEmail(payload.draft_email);
    }
    
    // Owner Info
    if (payload.owner_map) {
        html += formatOwnerInfo(payload.owner_map);
    }
    
    return html;
}

function formatSalesOutput(payload, route) {
    let html = '';
    
    // Sales Extract
    if (payload.sales_extract) {
        const sales = payload.sales_extract;
        html += `
            <div class="result-section">
                <div class="result-label">💼 Lead Information</div>
                <div class="result-card">
                    ${sales.lead_score !== undefined ? `
                        <div class="card-row">
                            <strong>Lead Score:</strong>
                            <div class="progress-bar-inline">
                                <div class="progress-fill-inline" style="width: ${sales.lead_score}%">${sales.lead_score}%</div>
                            </div>
                        </div>
                    ` : ''}
                    ${sales.priority ? `<div class="card-row"><strong>Priority:</strong> <span class="badge badge-priority-${sales.priority}">${sales.priority}</span></div>` : ''}
                    ${sales.company ? `<div class="card-row"><strong>Company:</strong> ${sales.company}</div>` : ''}
                    ${sales.contact_name ? `<div class="card-row"><strong>Contact:</strong> ${sales.contact_name}</div>` : ''}
                    ${sales.email ? `<div class="card-row"><strong>Email:</strong> <a href="mailto:${sales.email}">${sales.email}</a></div>` : ''}
                    ${sales.use_case ? `<div class="card-row"><strong>Use Case:</strong> ${sales.use_case}</div>` : ''}
                    ${sales.budget_hint ? `<div class="card-row"><strong>Budget:</strong> ${sales.budget_hint}</div>` : ''}
                    ${sales.timeline ? `<div class="card-row"><strong>Timeline:</strong> ${sales.timeline}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    // Draft Email
    if (payload.draft_email) {
        html += formatDraftEmail(payload.draft_email);
    }
    
    // Owner Info
    if (payload.owner_map) {
        html += formatOwnerInfo(payload.owner_map);
    }
    
    return html;
}

function formatEventsOutput(payload, route) {
    let html = '';
    
    // Event info extraction would go here
    if (payload.event_info) {
        const event = payload.event_info;
        html += `
            <div class="result-section">
                <div class="result-label">📅 Event Details</div>
                <div class="result-card">
                    ${formatObjectAsRows(event)}
                </div>
            </div>
        `;
    }
    
    // Draft Email
    if (payload.draft_email) {
        html += formatDraftEmail(payload.draft_email);
    }
    
    // Owner Info
    if (payload.owner_map) {
        html += formatOwnerInfo(payload.owner_map);
    }
    
    return html;
}

function formatGuardrailsOutput(payload) {
    let html = '';
    
    if (payload.flags) {
        const flags = payload.flags;
        html += `
            <div class="result-section">
                <div class="result-label">🚫 Guardrails Flags</div>
                <div class="result-card warning-card">
                    ${formatObjectAsRows(flags)}
                </div>
            </div>
        `;
    }
    
    if (payload.explanation) {
        html += `
            <div class="result-section">
                <div class="result-label">Explanation</div>
                <div class="result-value">${payload.explanation}</div>
            </div>
        `;
    }
    
    return html;
}

function formatGenericOutput(payload) {
    let html = '';
    
    html += `
        <div class="result-section">
            <div class="result-label">Output Data</div>
            <div class="result-card">
                ${formatObjectAsRows(payload)}
            </div>
        </div>
    `;
    
    return html;
}

function formatDraftEmail(email) {
    return `
        <div class="result-section">
            <div class="result-label">✉️ Draft Email</div>
            <div class="email-card">
                <div class="email-header">
                    <div class="email-field"><strong>To:</strong> ${email.to || 'N/A'}</div>
                    ${email.cc ? `<div class="email-field"><strong>CC:</strong> ${email.cc}</div>` : ''}
                    <div class="email-field"><strong>Subject:</strong> ${email.subject || 'N/A'}</div>
                </div>
                <div class="email-body">
                    ${email.body_markdown ? formatMarkdownToHTML(email.body_markdown) : (email.body || 'No content')}
                </div>
            </div>
        </div>
    `;
}

function formatOwnerInfo(owner) {
    return `
        <div class="result-section">
            <div class="result-label">👥 Assigned Owner</div>
            <div class="result-card owner-card">
                <div class="card-row"><strong>Department:</strong> ${owner.route_department || 'N/A'}</div>
                <div class="card-row"><strong>Owner:</strong> ${owner.owner_name || 'N/A'}</div>
                <div class="card-row"><strong>Email:</strong> <a href="mailto:${owner.owner_email}">${owner.owner_email || 'N/A'}</a></div>
            </div>
        </div>
    `;
}

function formatObjectAsRows(obj) {
    let html = '';
    for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined || value === '') continue;
        const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (typeof value === 'object' && !Array.isArray(value)) {
            html += `<div class="card-row"><strong>${displayKey}:</strong><div class="nested-content">${formatObjectAsRows(value)}</div></div>`;
        } else if (Array.isArray(value)) {
            html += `<div class="card-row"><strong>${displayKey}:</strong> ${value.join(', ')}</div>`;
        } else {
            html += `<div class="card-row"><strong>${displayKey}:</strong> ${escapeHtml(String(value))}</div>`;
        }
    }
    return html;
}

function formatMarkdownToHTML(markdown) {
    // Simple markdown to HTML conversion
    return markdown
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .split('</p><p>').map(p => `<p>${p}</p>`).join('');
}

// REST API Fallback
async function executeWorkflowREST(workflowData) {
    try {
        addTimelineItem('info', 'Using REST API', 'WebSocket unavailable, using REST endpoint', new Date().toISOString());
        
        const response = await fetch('/api/workflow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workflowData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            addTimelineItem('complete', 'Workflow Complete', 'Processing finished successfully', new Date().toISOString());
            displayResults(result.result);
            updateStatus('success', 'Complete');
        } else {
            addTimelineItem('error', 'Error', result.error, new Date().toISOString());
            updateStatus('error', 'Error');
            showError(result.error);
        }
    } catch (error) {
        addTimelineItem('error', 'Error', error.message, new Date().toISOString());
        updateStatus('error', 'Error');
        showError('Failed to execute workflow: ' + error.message);
    } finally {
        const processBtn = document.getElementById('processBtn');
        processBtn.disabled = false;
    }
}

// Update Status Badge
function updateStatus(status, text) {
    const badge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    
    badge.className = 'status-badge ' + status;
    statusText.textContent = text;
}

// Utility Functions
function showError(message) {
    // Simple error display - could be enhanced with a toast notification
    console.error(message);
    alert(message);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
