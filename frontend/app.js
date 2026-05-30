document.addEventListener('DOMContentLoaded', () => {
    // Auth Flow
    const authOverlay = document.getElementById('auth-overlay');
    const mainApp = document.getElementById('main-app');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameInput = document.getElementById('username');
    const displayName = document.getElementById('display-name');
    const displayAvatar = document.getElementById('display-avatar');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = usernameInput.value.trim();
        if (user) {
            displayName.textContent = user;
            displayAvatar.textContent = user.charAt(0).toUpperCase();
            authOverlay.style.display = 'none';
            mainApp.style.display = 'flex';
        }
    });

    logoutBtn.addEventListener('click', () => {
        mainApp.style.display = 'none';
        authOverlay.style.display = 'flex';
        usernameInput.value = '';
        document.getElementById('password').value = '';
    });

    // Mobile Menu Flow
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // Tab Navigation Flow
    const navLinks = document.querySelectorAll('.nav-links li');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-target');
            if (!target) return;

            // Remove active classes
            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            // Add active class to clicked link and corresponding view
            link.classList.add('active');
            document.getElementById(`view-${target}`).classList.add('active');
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // New Debug Button
    document.getElementById('new-debug-btn').addEventListener('click', () => {
        document.querySelector('[data-target="home"]').click();
        chatContainer.innerHTML = '';
        chatContainer.appendChild(welcomeScreen);
        welcomeScreen.style.display = 'block';
        errorInput.value = '';
        errorInput.style.height = 'auto';
    });

    // State for History
    let debugHistory = [];

    // State for Library
    let librarySnippets = [];

    // Save to library globally accessible
    window.saveToLibrary = function(title, code, lang) {
        librarySnippets.push({ title, code, lang, timestamp: new Date().toISOString() });
        renderLibrary();
        alert('Snippet saved to Library!');
    };

    function renderLibrary() {
        const libraryContainer = document.getElementById('library-grid-container');
        if (librarySnippets.length === 0) {
            libraryContainer.innerHTML = `
                <div class="empty-state" style="text-align: center; color: var(--text-secondary); padding: 3rem; grid-column: 1 / -1;">
                    <i class='bx bx-bookmark' style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No saved snippets yet. Save fixes from your chats to build your library!</p>
                </div>
            `;
            return;
        }

        libraryContainer.innerHTML = '';
        
        [...librarySnippets].reverse().forEach((snippet, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'grid-card glass-panel';
            cardDiv.innerHTML = `
                <h4>${escapeHTML(snippet.title)}</h4>
                <div class="code-container">
                    <div class="code-header">
                        <span>Code</span>
                        <button class="action-btn copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText); this.innerHTML='<i class=\\'bx bx-check\\'></i> Copied!'; setTimeout(()=>this.innerHTML='<i class=\\'bx bx-copy\\'></i> Copy', 2000)"><i class='bx bx-copy'></i> Copy</button>
                    </div>
                    <pre><code>${escapeHTML(snippet.code)}</code></pre>
                </div>
                <div class="card-footer">${escapeHTML(snippet.lang)}</div>
            `;
            libraryContainer.appendChild(cardDiv);
        });
    }

    // Settings Flow
    const themeSelect = document.getElementById('theme-select');
    const explanationSelect = document.getElementById('explanation-select');
    const modelSelect = document.getElementById('model-select');

    // Load saved settings
    const savedTheme = localStorage.getItem('beebug_theme') || 'frutiger';
    const savedExplanation = localStorage.getItem('beebug_explanation') || 'beginner';
    const savedModel = localStorage.getItem('beebug_model') || 'gemini-2.5-flash';
    
    themeSelect.value = savedTheme;
    explanationSelect.value = savedExplanation;
    modelSelect.value = savedModel;
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('beebug_theme', theme);
    });

    explanationSelect.addEventListener('change', (e) => {
        localStorage.setItem('beebug_explanation', e.target.value);
    });

    modelSelect.addEventListener('change', (e) => {
        localStorage.setItem('beebug_model', e.target.value);
    });

    // Make history items clickable function
    function renderHistory() {
        const historyContainer = document.getElementById('history-list-container');
        if (debugHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state" style="text-align: center; color: var(--text-secondary); padding: 3rem;">
                    <i class='bx bx-ghost' style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No history yet. Start debugging to see your past sessions here!</p>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = '';
        
        // Reverse array to show newest first
        [...debugHistory].reverse().forEach((session, index) => {
            const realIndex = debugHistory.length - 1 - index;
            
            // Choose icon based on language
            let iconClass = 'bx bx-code-alt';
            const langLower = session.language.toLowerCase();
            if (langLower.includes('javascript') || langLower.includes('js')) iconClass = 'bx bxl-javascript';
            else if (langLower.includes('python')) iconClass = 'bx bxl-python';
            else if (langLower.includes('java') && !langLower.includes('script')) iconClass = 'bx bxl-java';
            else if (langLower.includes('c++')) iconClass = 'bx bxl-c-plus-plus';
            else if (langLower.includes('go')) iconClass = 'bx bxl-go-lang';

            const timeStr = new Date(session.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            const itemDiv = document.createElement('div');
            itemDiv.className = 'list-item glass-panel';
            itemDiv.innerHTML = `
                <div class="item-icon"><i class='${iconClass}'></i></div>
                <div class="item-details">
                    <h4 style="display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;" title="${escapeHTML(session.error_text)}">${escapeHTML(session.error_text)}</h4>
                    <p>${escapeHTML(session.language)} • ${timeStr}</p>
                </div>
                <button class="view-btn" data-index="${realIndex}">View</button>
            `;
            historyContainer.appendChild(itemDiv);
        });

        // Attach event listeners to new buttons
        document.querySelectorAll('.list-item .view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                loadHistorySession(idx);
            });
        });
    }

    function loadHistorySession(index) {
        const session = debugHistory[index];
        if (!session) return;

        // Go to home tab
        document.querySelector('[data-target="home"]').click();
        
        // Hide welcome screen
        if (welcomeScreen) welcomeScreen.style.display = 'none';

        // Clear chat
        chatContainer.innerHTML = '';

        // Re-render user message
        appendUserMessage(session.error_text);

        // Re-render AI message directly (no API call needed)
        appendAIMessage(session.ai_response, true); // true = skip typing animation for instant load
    }

    // Chat Logic
    const analyzeBtn = document.getElementById('analyze-btn');
    const errorInput = document.getElementById('error-input');
    const chatContainer = document.getElementById('chat-container');
    const welcomeScreen = document.getElementById('welcome-screen');

    // Auto-resize textarea
    errorInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value.trim() === '') {
            this.style.height = 'auto';
        }
    });

    // Handle Enter key to submit (Shift+Enter for new line)
    errorInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            analyzeBtn.click();
        }
    });

    function appendUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user';
        msgDiv.innerHTML = `
            <div class="message-avatar">${displayName.textContent.charAt(0).toUpperCase()}</div>
            <div class="message-bubble">${escapeHTML(text)}</div>
        `;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendLoadingState() {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ai loading-msg';
        msgDiv.innerHTML = `
            <div class="message-avatar"><i class='bx bx-bug'></i></div>
            <div class="message-bubble glass-panel">
                <div class="loading-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        `;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
        return msgDiv;
    }

    function appendAIMessage(data, skipAnimation = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ai';
        
        let solutionsHTML = '';
        if (data.solutions && data.solutions.length > 0) {
            solutionsHTML = '<ul>' + data.solutions.map(s => `<li>${escapeHTML(s)}</li>`).join('') + '</ul>';
        }

        let fixesHTML = '';
        if (data.example_fixes) {
            fixesHTML = `
                <h4>Example Fixes</h4>
                <div class="code-container">
                    <div class="code-header">
                        <span>Code</span>
                        <button class="action-btn copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText); this.innerHTML='<i class=\\'bx bx-check\\'></i> Copied!'; setTimeout(()=>this.innerHTML='<i class=\\'bx bx-copy\\'></i> Copy', 2000)"><i class='bx bx-copy'></i> Copy</button>
                    </div>
                    <pre><code>${escapeHTML(data.example_fixes)}</code></pre>
                </div>
                <div class="action-buttons">
                    <button class="action-btn" onclick="window.saveToLibrary('Fix for ${escapeHTML(data.detected_language || 'General')}', this.parentElement.previousElementSibling.querySelector('code').innerText, '${escapeHTML(data.detected_language || 'General')}')"><i class='bx bx-bookmark-plus'></i> Save to Library</button>
                </div>
            `;
        }

        msgDiv.innerHTML = `
            <div class="message-avatar"><i class='bx bx-bug'></i></div>
            <div class="message-bubble glass-panel">
                <div class="typing-effect" id="content-${Date.now()}" style="display: block;">
                    <h4>Explanation</h4>
                    <p>${escapeHTML(data.explanation)}</p>
                    
                    <h4>Root Cause</h4>
                    <p>${escapeHTML(data.root_cause)}</p>
                    
                    ${solutionsHTML ? '<h4>Suggested Solutions</h4>' + solutionsHTML : ''}
                    ${fixesHTML}
                </div>
            </div>
        `;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
        
        // Trigger typing animation only if content is visible
        const typingContent = msgDiv.querySelector('.typing-effect');
        if (typingContent) {
            if (skipAnimation) {
                typingContent.style.opacity = '1';
            } else {
                typingContent.style.opacity = '0';
                setTimeout(() => {
                    typingContent.style.transition = 'opacity 0.5s ease-in-out';
                    typingContent.style.opacity = '1';
                    scrollToBottom();
                }, 100);
            }
        }
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        if (Array.isArray(str)) {
            str = str.join('\n\n');
        } else if (typeof str !== 'string') {
            // In case the AI returns an object instead of a string
            str = typeof str === 'object' ? JSON.stringify(str, null, 2) : String(str);
        }
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    analyzeBtn.addEventListener('click', async () => {
        const text = errorInput.value.trim();
        if (!text) return;

        if (welcomeScreen && welcomeScreen.style.display !== 'none') {
            welcomeScreen.style.display = 'none';
        }

        appendUserMessage(text);
        
        errorInput.value = '';
        errorInput.style.height = 'auto';
        
        analyzeBtn.disabled = true;
        const loadingEl = appendLoadingState();
        
        try {
            const contextData = {
                language: null, // Selector removed
                explanation_style: explanationSelect.value,
                model: modelSelect.value
            };

            const response = await fetch('http://127.0.0.1:8000/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error_text: text,
                    context: contextData
                })
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            loadingEl.remove();
            appendAIMessage(data);
            
            // Save to history state
            debugHistory.push({
                error_text: text,
                language: data.detected_language && data.detected_language !== 'Unknown' ? data.detected_language : 'General',
                timestamp: new Date().toISOString(),
                ai_response: data
            });
            renderHistory();
            
        } catch (error) {
            loadingEl.remove();
            const errorDiv = document.createElement('div');
            errorDiv.className = 'message ai';
            errorDiv.innerHTML = `
                <div class="message-avatar"><i class='bx bx-bug'></i></div>
                <div class="message-bubble glass-panel" style="color: #ef4444;">
                    <strong>Connection Error:</strong> Failed to analyze error. Is the backend running? (${error.message})
                </div>
            `;
            chatContainer.appendChild(errorDiv);
            scrollToBottom();
        } finally {
            analyzeBtn.disabled = false;
        }
    });
});