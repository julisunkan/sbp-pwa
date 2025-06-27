/**
 * Main Application Controller
 * Handles application initialization and global functionality
 */

class SurveyBuilderApp {
    constructor() {
        this.questions = [];
        this.currentQuestionId = 0;
        this.emailjsInitialized = false;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.initializeEmailJS();
        this.setupEventListeners();
        this.initializeFeatherIcons();
        this.setCurrentYear();
        this.loadSavedData();
    }

    /**
     * Initialize EmailJS with saved settings
     */
    initializeEmailJS() {
        const settings = SettingsManager.getSettings();
        if (settings.userId && typeof emailjs !== 'undefined') {
            try {
                emailjs.init(settings.userId);
                this.emailjsInitialized = true;
                console.log('EmailJS initialized successfully');
            } catch (error) {
                console.error('Failed to initialize EmailJS:', error);
            }
        }
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Generate code button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateCode();
        });

        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => {
            this.updatePreview();
        });

        // Copy code button
        document.getElementById('copyCodeBtn').addEventListener('click', () => {
            this.copyCode();
        });

        // Download ZIP button
        document.getElementById('downloadZipBtn').addEventListener('click', () => {
            this.downloadZip();
        });

        // Survey title change
        document.getElementById('surveyTitle').addEventListener('input', () => {
            this.updatePreview();
            this.saveData();
        });

        // Survey description change
        document.getElementById('surveyDescription').addEventListener('input', () => {
            this.updatePreview();
            this.saveData();
        });

        // Tab change events
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (event) => {
                this.handleTabChange(event.target.getAttribute('data-bs-target'));
            });
        });

        // Settings form submission
        document.getElementById('emailjsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSettingsSave();
        });

        // Test EmailJS connection
        document.getElementById('testEmailjsBtn').addEventListener('click', () => {
            this.testEmailJSConnection();
        });
    }

    /**
     * Initialize Feather icons
     */
    initializeFeatherIcons() {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    /**
     * Set current year in footer
     */
    setCurrentYear() {
        const currentYear = new Date().getFullYear();
        document.getElementById('currentYear').textContent = currentYear;
    }

    /**
     * Load saved data from localStorage
     */
    loadSavedData() {
        try {
            const savedData = localStorage.getItem('surveyBuilderData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.questions = data.questions || [];
                this.currentQuestionId = data.currentQuestionId || 0;
                
                // Restore survey title and description
                if (data.surveyTitle) {
                    document.getElementById('surveyTitle').value = data.surveyTitle;
                }
                if (data.surveyDescription) {
                    document.getElementById('surveyDescription').value = data.surveyDescription;
                }
                
                // Rebuild questions
                this.rebuildQuestions();
                this.updatePreview();
            }
        } catch (error) {
            console.error('Failed to load saved data:', error);
        }
    }

    /**
     * Save current state to localStorage
     */
    saveData() {
        try {
            const data = {
                questions: this.questions,
                currentQuestionId: this.currentQuestionId,
                surveyTitle: document.getElementById('surveyTitle').value,
                surveyDescription: document.getElementById('surveyDescription').value,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('surveyBuilderData', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    }

    /**
     * Rebuild questions from saved data
     */
    rebuildQuestions() {
        const questionsContainer = document.getElementById('questionsList');
        questionsContainer.innerHTML = '';
        
        if (this.questions.length === 0) {
            this.showEmptyState();
            return;
        }

        this.questions.forEach(question => {
            const questionElement = QuestionBuilder.createQuestionElement(question);
            questionsContainer.appendChild(questionElement);
        });

        // Re-initialize feather icons
        this.initializeFeatherIcons();
    }

    /**
     * Handle tab change events
     */
    handleTabChange(targetTab) {
        if (targetTab === '#settings') {
            // Load settings when switching to settings tab
            SettingsManager.loadSettings();
        }
    }

    /**
     * Handle settings save
     */
    handleSettingsSave() {
        const formData = new FormData(document.getElementById('emailjsForm'));
        const settings = {
            userId: document.getElementById('emailjsUserId').value.trim(),
            serviceId: document.getElementById('emailjsServiceId').value.trim(),
            templateId: document.getElementById('emailjsTemplateId').value.trim()
        };

        try {
            SettingsManager.saveSettings(settings);
            this.initializeEmailJS();
            this.showNotification('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showNotification('Failed to save settings. Please try again.', 'error');
        }
    }

    /**
     * Test EmailJS connection
     */
    async testEmailJSConnection() {
        const settings = SettingsManager.getSettings();
        
        if (!settings.userId || !settings.serviceId || !settings.templateId) {
            this.showNotification('Please fill in all EmailJS settings before testing.', 'warning');
            return;
        }

        const testBtn = document.getElementById('testEmailjsBtn');
        const originalText = testBtn.innerHTML;
        
        try {
            testBtn.innerHTML = '<i data-feather="loader" class="me-1"></i> Testing...';
            testBtn.disabled = true;
            
            // Initialize EmailJS with current settings
            if (typeof emailjs !== 'undefined') {
                emailjs.init(settings.userId);
                
                // Send a test email
                const testData = {
                    to_name: 'Test User',
                    from_name: 'Survey Builder Pro',
                    message: 'This is a test message to verify your EmailJS configuration.',
                    reply_to: 'test@example.com'
                };

                await emailjs.send(settings.serviceId, settings.templateId, testData);
                this.showNotification('EmailJS connection test successful!', 'success');
            } else {
                throw new Error('EmailJS library not loaded');
            }
        } catch (error) {
            console.error('EmailJS test failed:', error);
            this.showNotification('EmailJS connection test failed. Please check your settings.', 'error');
        } finally {
            testBtn.innerHTML = originalText;
            testBtn.disabled = false;
            this.initializeFeatherIcons();
        }
    }

    /**
     * Add a new question
     */
    addQuestion(type) {
        if (!type) {
            this.showNotification('Please select a question type.', 'warning');
            return;
        }

        const questionId = ++this.currentQuestionId;
        const question = QuestionBuilder.createQuestion(questionId, type);
        
        this.questions.push(question);
        this.renderQuestion(question);
        this.updatePreview();
        this.saveData();
        this.hideEmptyState();

        // Reset question type selector
        document.getElementById('questionType').value = '';
        
        this.showNotification('Question added successfully!', 'success');
    }

    /**
     * Render a question in the builder
     */
    renderQuestion(question) {
        const questionsContainer = document.getElementById('questionsList');
        const questionElement = QuestionBuilder.createQuestionElement(question);
        
        questionsContainer.appendChild(questionElement);
        this.initializeFeatherIcons();
        
        // Scroll to the new question
        questionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Update a question
     */
    updateQuestion(questionId, updates) {
        const questionIndex = this.questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            this.questions[questionIndex] = { ...this.questions[questionIndex], ...updates };
            this.updatePreview();
            this.saveData();
        }
    }

    /**
     * Delete a question
     */
    deleteQuestion(questionId) {
        if (confirm('Are you sure you want to delete this question?')) {
            this.questions = this.questions.filter(q => q.id !== questionId);
            document.querySelector(`[data-question-id="${questionId}"]`).remove();
            this.updatePreview();
            this.saveData();
            
            if (this.questions.length === 0) {
                this.showEmptyState();
            }
            
            this.showNotification('Question deleted successfully!', 'success');
        }
    }

    /**
     * Show empty state
     */
    showEmptyState() {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'block';
        }
    }

    /**
     * Hide empty state
     */
    hideEmptyState() {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    /**
     * Update preview
     */
    updatePreview() {
        const previewContainer = document.getElementById('previewContainer');
        const surveyTitle = document.getElementById('surveyTitle').value;
        const surveyDescription = document.getElementById('surveyDescription').value;
        
        if (this.questions.length === 0 && !surveyTitle && !surveyDescription) {
            previewContainer.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i data-feather="monitor" style="width: 32px; height: 32px; opacity: 0.5;"></i>
                    <p class="mt-2 mb-0 small">Preview will appear here</p>
                </div>
            `;
            this.initializeFeatherIcons();
            return;
        }

        const previewHtml = FormGenerator.generatePreview(surveyTitle, surveyDescription, this.questions);
        previewContainer.innerHTML = previewHtml;
        this.initializeFeatherIcons();
    }

    /**
     * Generate embed code
     */
    generateCode() {
        const surveyTitle = document.getElementById('surveyTitle').value;
        const surveyDescription = document.getElementById('surveyDescription').value;
        
        if (this.questions.length === 0) {
            this.showNotification('Please add at least one question before generating code.', 'warning');
            return;
        }

        const settings = SettingsManager.getSettings();
        const generatedCode = FormGenerator.generateEmbedCode(surveyTitle, surveyDescription, this.questions, settings);
        
        document.getElementById('generatedCode').value = generatedCode;
        
        const modal = new bootstrap.Modal(document.getElementById('generateCodeModal'));
        modal.show();
    }

    /**
     * Copy generated code to clipboard
     */
    async copyCode() {
        const codeTextarea = document.getElementById('generatedCode');
        
        try {
            await navigator.clipboard.writeText(codeTextarea.value);
            this.showNotification('Code copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            codeTextarea.select();
            document.execCommand('copy');
            this.showNotification('Code copied to clipboard!', 'success');
        }
    }

    /**
     * Download generated code as ZIP
     */
    async downloadZip() {
        const surveyTitle = document.getElementById('surveyTitle').value || 'Survey';
        const surveyDescription = document.getElementById('surveyDescription').value;
        const settings = SettingsManager.getSettings();
        
        try {
            await ZipGenerator.generateAndDownload(surveyTitle, surveyDescription, this.questions, settings);
            this.showNotification('ZIP file downloaded successfully!', 'success');
        } catch (error) {
            console.error('Failed to generate ZIP:', error);
            this.showNotification('Failed to generate ZIP file. Please try again.', 'error');
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 1055; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Get application instance (singleton pattern)
     */
    static getInstance() {
        if (!SurveyBuilderApp.instance) {
            SurveyBuilderApp.instance = new SurveyBuilderApp();
        }
        return SurveyBuilderApp.instance;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.surveyApp = SurveyBuilderApp.getInstance();
});

// Expose functions globally for use in other modules
window.addQuestion = (type) => window.surveyApp.addQuestion(type);
window.updateQuestion = (id, updates) => window.surveyApp.updateQuestion(id, updates);
window.deleteQuestion = (id) => window.surveyApp.deleteQuestion(id);
