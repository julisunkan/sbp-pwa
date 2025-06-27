/**
 * Settings Manager Module
 * Handles EmailJS settings and localStorage operations
 */

class SettingsManager {
    static STORAGE_KEY = 'surveyBuilderSettings';

    /**
     * Default settings
     */
    static getDefaultSettings() {
        return {
            userId: '',
            serviceId: '',
            templateId: '',
            lastUpdated: null
        };
    }

    /**
     * Load settings from localStorage
     */
    static loadSettings() {
        try {
            const savedSettings = localStorage.getItem(this.STORAGE_KEY);
            const settings = savedSettings ? JSON.parse(savedSettings) : this.getDefaultSettings();
            
            // Populate form fields
            document.getElementById('emailjsUserId').value = settings.userId || '';
            document.getElementById('emailjsServiceId').value = settings.serviceId || '';
            document.getElementById('emailjsTemplateId').value = settings.templateId || '';
            
            return settings;
        } catch (error) {
            console.error('Failed to load settings:', error);
            return this.getDefaultSettings();
        }
    }

    /**
     * Save settings to localStorage
     */
    static saveSettings(settings) {
        try {
            const settingsToSave = {
                ...settings,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settingsToSave));
            
            // Validate settings
            this.validateSettings(settingsToSave);
            
            return settingsToSave;
        } catch (error) {
            console.error('Failed to save settings:', error);
            throw error;
        }
    }

    /**
     * Get current settings
     */
    static getSettings() {
        try {
            const savedSettings = localStorage.getItem(this.STORAGE_KEY);
            return savedSettings ? JSON.parse(savedSettings) : this.getDefaultSettings();
        } catch (error) {
            console.error('Failed to get settings:', error);
            return this.getDefaultSettings();
        }
    }

    /**
     * Validate EmailJS settings
     */
    static validateSettings(settings) {
        const errors = [];

        if (!settings.userId || settings.userId.trim() === '') {
            errors.push('User ID is required');
        }

        if (!settings.serviceId || settings.serviceId.trim() === '') {
            errors.push('Service ID is required');
        }

        if (!settings.templateId || settings.templateId.trim() === '') {
            errors.push('Template ID is required');
        }

        // Check format (basic validation)
        if (settings.userId && !/^[a-zA-Z0-9_-]+$/.test(settings.userId)) {
            errors.push('User ID contains invalid characters');
        }

        if (settings.serviceId && !/^[a-zA-Z0-9_-]+$/.test(settings.serviceId)) {
            errors.push('Service ID contains invalid characters');
        }

        if (settings.templateId && !/^[a-zA-Z0-9_-]+$/.test(settings.templateId)) {
            errors.push('Template ID contains invalid characters');
        }

        if (errors.length > 0) {
            console.warn('Settings validation warnings:', errors);
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Clear all settings
     */
    static clearSettings() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            
            // Clear form fields
            document.getElementById('emailjsUserId').value = '';
            document.getElementById('emailjsServiceId').value = '';
            document.getElementById('emailjsTemplateId').value = '';
            
            return true;
        } catch (error) {
            console.error('Failed to clear settings:', error);
            return false;
        }
    }

    /**
     * Export settings as JSON
     */
    static exportSettings() {
        const settings = this.getSettings();
        const dataStr = JSON.stringify(settings, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'survey-builder-settings.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    /**
     * Import settings from JSON file
     */
    static importSettings(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const settings = JSON.parse(e.target.result);
                    const validation = this.validateSettings(settings);
                    
                    if (validation.isValid) {
                        this.saveSettings(settings);
                        this.loadSettings();
                        resolve(settings);
                    } else {
                        reject(new Error('Invalid settings format: ' + validation.errors.join(', ')));
                    }
                } catch (error) {
                    reject(new Error('Failed to parse settings file: ' + error.message));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Check if settings are configured
     */
    static areSettingsConfigured() {
        const settings = this.getSettings();
        return !!(settings.userId && settings.serviceId && settings.templateId);
    }

    /**
     * Get EmailJS initialization script
     */
    static getEmailJSInitScript(settings = null) {
        const currentSettings = settings || this.getSettings();
        
        if (!currentSettings.userId) {
            return '';
        }

        return `
// Initialize EmailJS
(function() {
    emailjs.init('${currentSettings.userId}');
})();`;
    }

    /**
     * Get form submission script
     */
    static getFormSubmissionScript(settings = null) {
        const currentSettings = settings || this.getSettings();
        
        if (!this.areSettingsConfigured()) {
            return `
// EmailJS not configured - form will not submit
console.warn('EmailJS settings not configured. Please configure EmailJS to enable form submissions.');`;
        }

        return `
// Handle form submission
document.getElementById('surveyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(this);
    const templateParams = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        if (templateParams[key]) {
            // Handle multiple values (checkboxes)
            if (Array.isArray(templateParams[key])) {
                templateParams[key].push(value);
            } else {
                templateParams[key] = [templateParams[key], value];
            }
        } else {
            templateParams[key] = value;
        }
    }
    
    // Add metadata
    templateParams.form_title = document.querySelector('h1, h2, h3, h4, h5, h6').textContent || 'Survey Response';
    templateParams.submission_date = new Date().toLocaleString();
    templateParams.user_agent = navigator.userAgent;
    
    // Send email
    emailjs.send('${currentSettings.serviceId}', '${currentSettings.templateId}', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Show success message
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success';
            successAlert.innerHTML = '<strong>Success!</strong> Your response has been submitted successfully.';
            
            const form = document.getElementById('surveyForm');
            form.parentNode.insertBefore(successAlert, form);
            
            // Reset form
            form.reset();
            
            // Scroll to success message
            successAlert.scrollIntoView({ behavior: 'smooth' });
            
        }, function(error) {
            console.error('FAILED...', error);
            
            // Show error message
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger';
            errorAlert.innerHTML = '<strong>Error!</strong> Failed to submit your response. Please try again.';
            
            const form = document.getElementById('surveyForm');
            form.parentNode.insertBefore(errorAlert, form);
            
            // Scroll to error message
            errorAlert.scrollIntoView({ behavior: 'smooth' });
            
        }).finally(function() {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
});`;
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load settings into form fields
    SettingsManager.loadSettings();
    
    // Add event listeners for settings management
    const clearSettingsBtn = document.createElement('button');
    clearSettingsBtn.type = 'button';
    clearSettingsBtn.className = 'btn btn-outline-danger btn-sm';
    clearSettingsBtn.innerHTML = '<i data-feather="trash-2" class="me-1"></i>Clear Settings';
    clearSettingsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all settings?')) {
            SettingsManager.clearSettings();
            if (window.surveyApp) {
                window.surveyApp.showNotification('Settings cleared successfully!', 'success');
            }
        }
    });
    
    // Add export/import buttons
    const exportBtn = document.createElement('button');
    exportBtn.type = 'button';
    exportBtn.className = 'btn btn-outline-info btn-sm';
    exportBtn.innerHTML = '<i data-feather="download" class="me-1"></i>Export';
    exportBtn.addEventListener('click', () => {
        SettingsManager.exportSettings();
    });
    
    const importBtn = document.createElement('input');
    importBtn.type = 'file';
    importBtn.accept = '.json';
    importBtn.style.display = 'none';
    importBtn.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            SettingsManager.importSettings(file)
                .then(() => {
                    if (window.surveyApp) {
                        window.surveyApp.showNotification('Settings imported successfully!', 'success');
                    }
                })
                .catch((error) => {
                    if (window.surveyApp) {
                        window.surveyApp.showNotification('Failed to import settings: ' + error.message, 'error');
                    }
                });
        }
    });
    
    const importBtnTrigger = document.createElement('button');
    importBtnTrigger.type = 'button';
    importBtnTrigger.className = 'btn btn-outline-info btn-sm';
    importBtnTrigger.innerHTML = '<i data-feather="upload" class="me-1"></i>Import';
    importBtnTrigger.addEventListener('click', () => {
        importBtn.click();
    });
    
    // Add buttons to settings form
    const settingsForm = document.getElementById('emailjsForm');
    if (settingsForm) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex gap-2 mt-3';
        buttonContainer.appendChild(clearSettingsBtn);
        buttonContainer.appendChild(exportBtn);
        buttonContainer.appendChild(importBtnTrigger);
        buttonContainer.appendChild(importBtn);
        
        settingsForm.appendChild(buttonContainer);
    }
});
