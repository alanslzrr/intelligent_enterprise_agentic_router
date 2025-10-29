/* ================================================================================
   Modern Workflow UI - Enhanced JavaScript
   No icons, clean visual flow, professional design
   ================================================================================ */

// Global state
let ws = null;
let selectedFile = null;
let uploadedFilePath = null;
let currentTheme = localStorage.getItem('theme') || 'light';
let workflowActive = false;
let currentStep = 0;

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
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.classList.toggle('dark', currentTheme === 'dark');
            localStorage.setItem('theme', currentTheme);
            console.log('Theme changed to:', currentTheme);
        });
    } else {
        console.error('Theme toggle button not found');
    }
}

// Tab Management
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
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
    
    uploadZone.addEventListener('click', () => fileInput.click());
    
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
        if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0]);
        }
    });
    
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
        
        const data = await response.json();
        if (data.success) {
            uploadedFilePath = data.path;
            displayUploadedFile(data.filename, data.size);
        }
    } catch (error) {
        showError('Failed to upload file: ' + error.message);
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
        
        if (data.files && data.files.length > 0) {
            fileList.innerHTML = data.files.map(file => `
                <div class="file-item" data-file-path="${escapeHtml(file.path)}" data-file-name="${escapeHtml(file.name)}">
                    <div class="file-info">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                        <div class="file-details">
                            <span class="file-name">${escapeHtml(file.name)}</span>
                            <span class="file-size">${formatFileSize(file.size)}</span>
                        </div>
                    </div>
                    <div class="file-actions">
                        <button class="btn-icon preview-btn" title="Preview file">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');
            
            // Add click event listeners to file items
            document.querySelectorAll('.file-item').forEach(item => {
                const filePath = item.dataset.filePath;
                const fileName = item.dataset.fileName;
                
                // Add click to select file
                item.addEventListener('click', function(e) {
                    // Don't select if clicking on preview button
                    if (e.target.closest('.preview-btn')) {
                        return;
                    }
                    selectDataFile(this);
                });
                
                // Add click to preview button
                const previewBtn = item.querySelector('.preview-btn');
                if (previewBtn) {
                    previewBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        previewFile(filePath, fileName);
                    });
                }
            });
        } else {
            fileList.innerHTML = '<div class="loading">No example files available</div>';
        }
    } catch (error) {
        fileList.innerHTML = '<div class="loading">Error loading files</div>';
    }
}

function selectDataFile(fileItemElement) {
    const path = fileItemElement.dataset.filePath;
    const name = fileItemElement.dataset.fileName;
    
    selectedFile = path;
    
    // Remove selected class from all items
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selected class to clicked item
    fileItemElement.classList.add('selected');
    
    console.log('Selected file:', name, path);
}

async function previewFile(path, name) {
    try {
        // Fetch file content
        const response = await fetch(`/api/file-preview?path=${encodeURIComponent(path)}`);
        const data = await response.json();
        
        if (data.success) {
            if (data.type === 'pdf') {
                // For PDFs, pass the data object with path
                showPreviewModal(name, data, data.type);
            } else {
                // For text files, pass the content
                showPreviewModal(name, data.content, data.type);
            }
        } else {
            showError('Failed to load file preview: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        showError('Failed to preview file: ' + error.message);
    }
}

function showPreviewModal(filename, content, fileType) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    
    let bodyContent;
    
    if (fileType === 'pdf') {
        // For PDFs, show embedded viewer
        const pdfPath = content.path || content;
        bodyContent = `
            <div class="pdf-viewer-container">
                <iframe 
                    src="${pdfPath}" 
                    class="pdf-viewer"
                    type="application/pdf"
                    title="${escapeHtml(filename)}"
                ></iframe>
                <div class="pdf-controls">
                    <a href="${pdfPath}" target="_blank" class="btn btn-secondary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Open in New Tab
                    </a>
                </div>
            </div>
        `;
    } else {
        // For text files, show content
        bodyContent = `<pre class="preview-content">${escapeHtml(content)}</pre>`;
    }
    
    modal.innerHTML = `
        <div class="preview-modal-content ${fileType === 'pdf' ? 'pdf-modal' : ''}">
            <div class="preview-modal-header">
                <h3>${escapeHtml(filename)}</h3>
                <button class="btn-icon close-preview">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="preview-modal-body ${fileType === 'pdf' ? 'pdf-body' : ''}">
                ${bodyContent}
            </div>
            <div class="preview-modal-footer">
                <button class="btn btn-secondary close-modal-btn">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close-preview');
    const closeModalBtn = modal.querySelector('.close-modal-btn');
    
    closeBtn.addEventListener('click', closePreviewModal);
    closeModalBtn.addEventListener('click', closePreviewModal);
    
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePreviewModal();
        }
    });
    
    // Close on escape key
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closePreviewModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

function closePreviewModal() {
    const modal = document.querySelector('.preview-modal');
    if (modal) {
        modal.remove();
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
    document.getElementById('textInput').value = '';
    clearUploadedFile();
    selectedFile = null;
    document.querySelectorAll('.file-item').forEach(item => item.classList.remove('selected'));
    
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = `
        <div class="timeline-empty">
            <p>No workflow executed yet</p>
            <p class="text-muted">Start by entering text, uploading a file, or selecting an example</p>
        </div>
    `;
    
    document.getElementById('results').style.display = 'none';
    updateStatus('idle', 'Idle');
    
    // Reset layout
    document.querySelector('.main-content').classList.remove('workflow-active');
    workflowActive = false;
    currentStep = 0;
}

// Process Workflow
async function processWorkflow() {
    const textInput = document.getElementById('textInput').value.trim();
    const activeTab = document.querySelector('.tab.active').dataset.tab;
    
    let workflowData = {};
    
    if (activeTab === 'text') {
        if (!textInput) {
            showError('Please enter some text');
            return;
        }
        workflowData = { text: textInput };
    } else if (activeTab === 'upload' && uploadedFilePath) {
        workflowData = { file_path: uploadedFilePath };
    } else if (activeTab === 'browse' && selectedFile) {
        workflowData = { file_path: selectedFile };
    } else {
        showError('Please provide input');
        return;
    }
    
    // Clear previous results and activate workflow mode
    document.getElementById('timeline').innerHTML = '';
    document.getElementById('results').style.display = 'none';
    
    // Activate workflow layout
    document.querySelector('.main-content').classList.add('workflow-active');
    workflowActive = true;
    currentStep = 0;
    
    updateStatus('processing', 'Processing...');
    
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
        ws.send(JSON.stringify(workflowData));
    };
    
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
    };
    
    ws.onerror = (error) => {
        showError('WebSocket error occurred');
        updateStatus('error', 'Connection Error');
        document.getElementById('processBtn').disabled = false;
    };
    
    ws.onclose = () => {
        document.getElementById('processBtn').disabled = false;
    };
}

// Handle WebSocket Messages
function handleWebSocketMessage(message) {
    const timeline = document.getElementById('timeline');
    
    switch (message.type) {
        case 'status':
            // Initial status message - ignore in new design
            break;
            
        case 'agent_start':
            createWorkflowStep(message.agent, message.step, message.timestamp);
            updateStatus('processing', `Processing: ${message.agent}`);
            break;
            
        case 'agent_input':
            addInputToCurrentStep(message.input);
            break;
            
        case 'agent_thinking':
            // Thinking indication - shown in real-time in current step
            break;
            
        case 'agent_end':
            completeCurrentStep(message.output, message.usage);
            break;
            
        case 'handoff':
            // Handoffs are implicit in step flow - no need to show
            break;
            
        case 'result':
            displayResults(message.result);
            updateStatus('success', 'Completed');
            document.getElementById('processBtn').disabled = false;
            if (ws) ws.close();
            break;
            
        case 'error':
            showError(message.message);
            updateStatus('error', 'Error');
            document.getElementById('processBtn').disabled = false;
            if (ws) ws.close();
            break;
    }
    
    timeline.scrollTop = timeline.scrollHeight;
}

// Create new workflow step
function createWorkflowStep(agentName, step, timestamp) {
    currentStep = step;
    const timeline = document.getElementById('timeline');
    
    const stepEl = document.createElement('div');
    stepEl.className = 'workflow-step processing';
    stepEl.id = `step-${step}`;
    
    stepEl.innerHTML = `
        <div class="step-header">
            <div class="step-title">
                <span class="step-number">${step}</span>
                <span class="step-name">${agentName}</span>
            </div>
            <span class="step-time">${formatTimestamp(timestamp)}</span>
        </div>
        <div class="step-content" id="content-${step}">
            <div class="step-section input" id="input-${step}" style="display: none;">
                <div class="section-label">Input</div>
                <div class="section-data"></div>
            </div>
            <div class="step-section output" id="output-${step}" style="display: none;">
                <div class="section-label">Output</div>
                <div class="section-data"></div>
            </div>
            <div class="step-metrics" id="metrics-${step}" style="display: none;">
                <div class="metric">
                    <span class="metric-label">Requests</span>
                    <span class="metric-value" id="requests-${step}">-</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Input Tokens</span>
                    <span class="metric-value" id="input-tokens-${step}">-</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Output Tokens</span>
                    <span class="metric-value" id="output-tokens-${step}">-</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Total Tokens</span>
                    <span class="metric-value" id="total-tokens-${step}">-</span>
                </div>
            </div>
        </div>
    `;
    
    timeline.appendChild(stepEl);
}

// Add input to current step
function addInputToCurrentStep(input) {
    if (!input || !input.trim()) return;
    
    const inputSection = document.getElementById(`input-${currentStep}`);
    if (inputSection) {
        inputSection.style.display = 'block';
        const dataEl = inputSection.querySelector('.section-data');
        dataEl.textContent = truncateText(input, 500);
    }
}

// Complete current step
function completeCurrentStep(output, usage) {
    const stepEl = document.getElementById(`step-${currentStep}`);
    if (!stepEl) return;
    
    stepEl.classList.remove('processing');
    stepEl.classList.add('completed');
    
    // Show output
    if (output && Object.keys(output).length > 0) {
        const outputSection = document.getElementById(`output-${currentStep}`);
        if (outputSection) {
            outputSection.style.display = 'block';
            const dataEl = outputSection.querySelector('.section-data');
            dataEl.textContent = formatOutputData(output);
        }
    }
    
    // Show metrics
    if (usage) {
        const metricsEl = document.getElementById(`metrics-${currentStep}`);
        if (metricsEl) {
            metricsEl.style.display = 'flex';
            document.getElementById(`requests-${currentStep}`).textContent = usage.requests;
            document.getElementById(`input-tokens-${currentStep}`).textContent = usage.input_tokens.toLocaleString();
            document.getElementById(`output-tokens-${currentStep}`).textContent = usage.output_tokens.toLocaleString();
            document.getElementById(`total-tokens-${currentStep}`).textContent = usage.total_tokens.toLocaleString();
        }
    }
}

function formatOutputData(output) {
    if (output.value !== undefined) {
        return output.value;
    }
    
    let result = [];
    for (const [key, value] of Object.entries(output)) {
        if (value === null || value === undefined || value === '') continue;
        
        const displayKey = key.replace(/_/g, ' ').toUpperCase();
        
        if (typeof value === 'object' && !Array.isArray(value)) {
            result.push(`${displayKey}:`);
            for (const [k, v] of Object.entries(value)) {
                result.push(`  ${k.replace(/_/g, ' ')}: ${v}`);
            }
        } else if (Array.isArray(value)) {
            result.push(`${displayKey}: ${value.join(', ')}`);
        } else {
            result.push(`${displayKey}: ${value}`);
        }
    }
    
    return result.join('\n');
}

// Display Results
function displayResults(result) {
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    // Hide first to reset animation
    resultsDiv.style.display = 'none';
    
    const route = result.final_route || result.route || 'unknown';
    const payload = result.payload || result;
    
    let html = `
        <div class="result-section result-header">
            <div class="route-badge">${formatRouteName(route)}</div>
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
    
    resultsContent.innerHTML = html;
    
    // Small delay to ensure animation triggers
    setTimeout(() => {
        resultsDiv.style.display = 'block';
        // Smooth scroll to results with a slight delay to let animation start
        setTimeout(() => {
            resultsDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }, 50);
}

function formatRouteName(route) {
    return route.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatHRCVOutput(payload, route) {
    let html = '';
    
    if (payload.reason) {
        html += `
            <div class="result-section">
                <div class="result-label">Decision Reason</div>
                <div class="result-value">
                    <span class="badge ${payload.reason.includes('accept') ? 'badge-success' : 'badge-warning'}">
                        ${payload.reason.replace(/_/g, ' ').toUpperCase()}
                    </span>
                </div>
            </div>
        `;
    }
    
    if (payload.cv_extract) {
        const cv = payload.cv_extract;
        html += `
            <div class="result-section">
                <div class="result-label">Candidate Profile</div>
                <div class="result-card">
                    ${cv.full_name ? `<div class="card-row"><strong>Name</strong>${cv.full_name}</div>` : ''}
                    ${cv.email ? `<div class="card-row"><strong>Email</strong><a href="mailto:${cv.email}">${cv.email}</a></div>` : ''}
                    ${cv.phone ? `<div class="card-row"><strong>Phone</strong>${cv.phone}</div>` : ''}
                    ${cv.location ? `<div class="card-row"><strong>Location</strong>${cv.location}</div>` : ''}
                    ${cv.years_experience !== undefined ? `<div class="card-row"><strong>Experience</strong>${cv.years_experience} years</div>` : ''}
                    ${cv.skills && cv.skills.length > 0 ? `
                        <div class="card-row">
                            <strong>Skills</strong>
                            <div class="skills-list">
                                ${cv.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    if (payload.match_info) {
        const match = payload.match_info;
        html += `
            <div class="result-section">
                <div class="result-label">Role Match</div>
                <div class="result-card">
                    ${match.role_title ? `<div class="card-row"><strong>Position</strong>${match.role_title}</div>` : ''}
                    ${match.match_score !== undefined ? `
                        <div class="card-row">
                            <strong>Match Score</strong>
                            <div class="progress-bar-inline">
                                <div class="progress-fill-inline" style="width: ${match.match_score}%">${match.match_score}%</div>
                            </div>
                        </div>
                    ` : ''}
                    ${match.reasoning ? `<div class="card-row"><strong>Reasoning</strong>${match.reasoning}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    if (payload.draft_email) {
        html += formatDraftEmail(payload.draft_email);
    }
    
    if (payload.owner_map) {
        html += formatOwnerInfo(payload.owner_map);
    }
    
    return html;
}

function formatSalesOutput(payload, route) {
    let html = '';
    
    if (payload.sales_extract) {
        const sales = payload.sales_extract;
        html += `
            <div class="result-section">
                <div class="result-label">Lead Information</div>
                <div class="result-card">
                    ${sales.lead_score !== undefined ? `
                        <div class="card-row">
                            <strong>Lead Score</strong>
                            <div class="progress-bar-inline">
                                <div class="progress-fill-inline" style="width: ${sales.lead_score}%">${sales.lead_score}%</div>
                            </div>
                        </div>
                    ` : ''}
                    ${sales.priority ? `<div class="card-row"><strong>Priority</strong><span class="badge badge-priority-${sales.priority}">${sales.priority}</span></div>` : ''}
                    ${sales.company ? `<div class="card-row"><strong>Company</strong>${sales.company}</div>` : ''}
                    ${sales.contact_name ? `<div class="card-row"><strong>Contact</strong>${sales.contact_name}</div>` : ''}
                    ${sales.email ? `<div class="card-row"><strong>Email</strong><a href="mailto:${sales.email}">${sales.email}</a></div>` : ''}
                    ${sales.use_case ? `<div class="card-row"><strong>Use Case</strong>${sales.use_case}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    if (payload.draft_email) {
        html += formatDraftEmail(payload.draft_email);
    }
    
    if (payload.owner_map) {
        html += formatOwnerInfo(payload.owner_map);
    }
    
    return html;
}

function formatEventsOutput(payload, route) {
    let html = '';
    
    if (payload.event_info) {
        html += `
            <div class="result-section">
                <div class="result-label">Event Details</div>
                <div class="result-card">
                    ${formatObjectAsRows(payload.event_info)}
                </div>
            </div>
        `;
    }
    
    if (payload.draft_email) {
        html += formatDraftEmail(payload.draft_email);
    }
    
    if (payload.owner_map) {
        html += formatOwnerInfo(payload.owner_map);
    }
    
    return html;
}

function formatGuardrailsOutput(payload) {
    let html = '';
    
    if (payload.flags) {
        html += `
            <div class="result-section">
                <div class="result-label">Guardrails Flags</div>
                <div class="result-card">
                    ${formatObjectAsRows(payload.flags)}
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
    return `
        <div class="result-section">
            <div class="result-label">Output Data</div>
            <div class="result-card">
                ${formatObjectAsRows(payload)}
            </div>
        </div>
    `;
}

function formatDraftEmail(email) {
    return `
        <div class="result-section">
            <div class="result-label">Draft Email</div>
            <div class="email-card">
                <div class="email-header">
                    <div class="email-field"><strong>To</strong>${email.to || 'N/A'}</div>
                    ${email.cc ? `<div class="email-field"><strong>CC</strong>${email.cc}</div>` : ''}
                    <div class="email-field"><strong>Subject</strong>${email.subject || 'N/A'}</div>
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
            <div class="result-label">Assigned Owner</div>
            <div class="result-card">
                <div class="card-row"><strong>Department</strong>${owner.route_department || 'N/A'}</div>
                <div class="card-row"><strong>Owner</strong>${owner.owner_name || 'N/A'}</div>
                <div class="card-row"><strong>Email</strong><a href="mailto:${owner.owner_email}">${owner.owner_email || 'N/A'}</a></div>
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
            html += `<div class="card-row"><strong>${displayKey}</strong>${formatObjectAsRows(value)}</div>`;
        } else if (Array.isArray(value)) {
            html += `<div class="card-row"><strong>${displayKey}</strong>${value.join(', ')}</div>`;
        } else {
            html += `<div class="card-row"><strong>${displayKey}</strong>${escapeHtml(String(value))}</div>`;
        }
    }
    return html;
}

function formatMarkdownToHTML(markdown) {
    return markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
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
    console.error(message);
    alert(message);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
