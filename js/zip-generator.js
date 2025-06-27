/**
 * ZIP Generator Module
 * Handles creation and download of ZIP files containing generated survey code
 */

class ZipGenerator {
    /**
     * Generate and download a ZIP file containing the survey files
     */
    static async generateAndDownload(surveyTitle, surveyDescription, questions, settings) {
        if (typeof JSZip === 'undefined') {
            throw new Error('JSZip library is not loaded');
        }

        const zip = new JSZip();
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const safeSurveyTitle = this.sanitizeFileName(surveyTitle || 'Survey');
        
        // Generate main HTML file
        const mainHTML = FormGenerator.generateEmbedCode(surveyTitle, surveyDescription, questions, settings);
        zip.file('survey.html', mainHTML);
        
        // Generate standalone CSS file
        const standaloneCSS = this.generateStandaloneCSS();
        zip.file('styles.css', standaloneCSS);
        
        // Generate standalone JavaScript file
        const standaloneJS = this.generateStandaloneJS(settings);
        zip.file('script.js', standaloneJS);
        
        // Generate separate HTML file that uses external CSS and JS
        const separateHTML = this.generateSeparateHTML(surveyTitle, surveyDescription, questions);
        zip.file('survey-separate.html', separateHTML);
        
        // Generate README file
        const readme = this.generateReadme(surveyTitle, surveyDescription, questions, settings);
        zip.file('README.md', readme);
        
        // Generate sample EmailJS template
        const emailTemplate = this.generateEmailTemplate(surveyTitle, questions);
        zip.file('emailjs-template.txt', emailTemplate);
        
        // Generate configuration file
        const config = this.generateConfigFile(surveyTitle, surveyDescription, questions, settings);
        zip.file('survey-config.json', config);

        // Generate the ZIP file and download it
        try {
            const content = await zip.generateAsync({ type: 'blob' });
            this.downloadBlob(content, `${safeSurveyTitle}-${timestamp}.zip`);
        } catch (error) {
            console.error('Failed to generate ZIP file:', error);
            throw new Error('Failed to generate ZIP file: ' + error.message);
        }
    }

    /**
     * Generate standalone CSS file
     */
    static generateStandaloneCSS() {
        return `/* Survey Builder Pro - Generated CSS */
/* Generated on: ${new Date().toISOString()} */

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

body {
    font-family: 'Poppins', sans-serif;
    background-color: #f8fafc;
    color: #1e293b;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

.survey-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin: 2rem 0;
}

.survey-title {
    color: #6366f1;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 2rem;
}

.survey-description {
    color: #6b7280;
    margin-bottom: 2rem;
    font-size: 1.1rem;
}

.question-group {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #f3f4f6;
}

.question-group:last-of-type {
    border-bottom: none;
}

.question-title {
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
}

.required-indicator {
    color: #ef4444;
    margin-left: 0.25rem;
}

.form-control, .form-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus, .form-select:focus {
    border-color: #6366f1;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
}

.form-check {
    margin-bottom: 0.5rem;
}

.form-check-input {
    margin-right: 0.5rem;
}

.form-check-label {
    cursor: pointer;
}

.form-text {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
}

.btn {
    display: inline-block;
    font-weight: 500;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid transparent;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    border-radius: 8px;
    transition: all 0.15s ease-in-out;
}

.btn-primary {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border: none;
    color: white;
}

.btn-primary:hover {
    background: linear-gradient(135deg, #5855eb 0%, #7c3aed 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-lg {
    padding: 1rem 2.5rem;
    font-size: 1.125rem;
}

.text-center {
    text-align: center;
}

.mt-4 {
    margin-top: 1.5rem;
}

.instruction-text {
    background-color: #fef3c7;
    border-left: 4px solid #f59e0b;
    padding: 1rem;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    margin-bottom: 1.5rem;
}

.instruction-text h6 {
    margin-bottom: 0.5rem;
    color: #92400e;
}

.section-break {
    background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
    color: white;
    text-align: center;
    padding: 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    margin-bottom: 2rem;
}

.section-break h5 {
    margin-bottom: 0.5rem;
}

.page-break {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    color: white;
    text-align: center;
    padding: 1.5rem;
    border-radius: 8px;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    margin: 2rem 0;
}

.page-break h6 {
    margin-bottom: 0.5rem;
}

.alert {
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 8px;
}

.alert-success {
    color: #065f46;
    background-color: #d1fae5;
    border-color: #a7f3d0;
}

.alert-danger {
    color: #991b1b;
    background-color: #fee2e2;
    border-color: #fecaca;
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
    border-width: 0.125rem;
}

.spinner-border {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    vertical-align: text-bottom;
    border: 0.25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
    to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
    body {
        padding: 10px;
    }
    
    .survey-container {
        padding: 1.5rem;
        margin: 1rem 0;
    }
    
    .survey-title {
        font-size: 1.5rem;
    }
    
    .btn-lg {
        padding: 0.75rem 2rem;
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .survey-container {
        padding: 1rem;
    }
    
    .survey-title {
        font-size: 1.25rem;
    }
    
    .question-title {
        font-size: 1rem;
    }
}`;
    }

    /**
     * Generate standalone JavaScript file
     */
    static generateStandaloneJS(settings) {
        const emailjsScript = SettingsManager.getEmailJSInitScript(settings);
        const submissionScript = SettingsManager.getFormSubmissionScript(settings);
        
        return `/* Survey Builder Pro - Generated JavaScript */
/* Generated on: ${new Date().toISOString()} */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Survey form loaded successfully');
    
    ${emailjsScript}
    
    ${submissionScript}
    
    // Form validation
    const form = document.getElementById('surveyForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Custom validation can be added here
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
        
        // Remove validation errors on input
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(function(input) {
            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    }
});`;
    }

    /**
     * Generate HTML file that uses external CSS and JS
     */
    static generateSeparateHTML(surveyTitle, surveyDescription, questions) {
        const html = FormGenerator.generateEmbedHTML(surveyTitle, surveyDescription, questions);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${FormGenerator.escapeHtml(surveyTitle || 'Survey')}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
${html}
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    <script src="script.js"></script>
</body>
</html>`;
    }

    /**
     * Generate README file
     */
    static generateReadme(surveyTitle, surveyDescription, questions, settings) {
        const hasEmailJS = SettingsManager.areSettingsConfigured();
        const questionCount = questions.length;
        const inputQuestions = questions.filter(q => !['instruction', 'section-break', 'page-break'].includes(q.type)).length;
        
        return `# ${surveyTitle || 'Survey'}

Generated by **Survey Builder Pro** on ${new Date().toLocaleString()}

## Description

${surveyDescription || 'No description provided.'}

## Survey Statistics

- **Total Questions**: ${questionCount}
- **Input Questions**: ${inputQuestions}
- **EmailJS Configured**: ${hasEmailJS ? 'Yes' : 'No'}

## Files Included

### HTML Files
- \`survey.html\` - Complete survey with inline CSS and JavaScript
- \`survey-separate.html\` - Survey that uses external CSS and JavaScript files

### Assets
- \`styles.css\` - Standalone CSS file
- \`script.js\` - Standalone JavaScript file

### Configuration
- \`survey-config.json\` - Survey configuration data
- \`emailjs-template.txt\` - Sample EmailJS template
- \`README.md\` - This file

## Setup Instructions

### Option 1: Quick Setup (Recommended)
1. Upload \`survey.html\` to your web server
2. Open the file in a web browser
3. That's it! The survey is ready to use.

### Option 2: Separate Files Setup
1. Upload all files to your web server
2. Open \`survey-separate.html\` in a web browser
3. Ensure all files are in the same directory

## EmailJS Configuration

${hasEmailJS ? `
Your EmailJS settings are already configured in the generated files:
- **User ID**: ${settings.userId}
- **Service ID**: ${settings.serviceId}
- **Template ID**: ${settings.templateId}

The survey will automatically send responses to your configured email.
` : `
EmailJS is not configured. To enable form submissions:

1. Create a free account at [EmailJS.com](https://www.emailjs.com/)
2. Set up an email service (Gmail, Outlook, etc.)
3. Create an email template
4. Update the JavaScript files with your EmailJS credentials:
   - User ID
   - Service ID
   - Template ID

### Sample EmailJS Template Variables
You can use these variables in your EmailJS template:
${questions.map(q => `- \`{{question_${q.id}}}\` - ${q.title}`).join('\n')}
- \`{{form_title}}\` - Survey title
- \`{{submission_date}}\` - Submission timestamp
- \`{{user_agent}}\` - User's browser information
`}

## Question Types

This survey includes the following question types:

${questions.map((q, index) => `${index + 1}. **${FormGenerator.escapeHtml(q.title)}** (${QuestionBuilder.getTypeDisplayName(q.type)})${q.required ? ' *Required*' : ''}`).join('\n')}

## Browser Compatibility

This survey is compatible with:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Styling
- Edit \`styles.css\` to customize the appearance
- The survey uses the Poppins font family from Google Fonts
- Bootstrap classes are available for additional styling

### JavaScript
- Edit \`script.js\` to add custom functionality
- Form validation is included by default
- EmailJS integration handles form submissions

### HTML Structure
- Questions are contained in \`.question-group\` divs
- Form fields use standard HTML5 input types
- Responsive design works on all devices

## Security Notes

- All user inputs are properly escaped to prevent XSS attacks
- Form validation prevents empty required fields
- EmailJS handles secure email transmission

## Support

For questions about Survey Builder Pro, visit our documentation or contact support.

---

**Generated by Survey Builder Pro**  
*A responsive survey/quiz builder web application*
`;
    }

    /**
     * Generate EmailJS template example
     */
    static generateEmailTemplate(surveyTitle, questions) {
        const inputQuestions = questions.filter(q => !['instruction', 'section-break', 'page-break'].includes(q.type));
        
        return `EmailJS Template for: ${surveyTitle || 'Survey'}
===============================================

Subject: New Survey Response - {{form_title}}

Dear Administrator,

You have received a new response for your survey "${surveyTitle || 'Survey'}".

Submission Details:
- Survey: {{form_title}}
- Submitted: {{submission_date}}
- Browser: {{user_agent}}

Responses:
${inputQuestions.map(q => `
${q.title}${q.required ? ' (Required)' : ''}
Answer: {{question_${q.id}}}
`).join('\n')}

---
This email was sent automatically by Survey Builder Pro.

How to use this template:
1. Copy this content
2. Create a new email template in your EmailJS dashboard
3. Paste the content and customize as needed
4. Save the template and use its ID in your survey settings

Available Variables:
${inputQuestions.map(q => `- {{question_${q.id}}} - ${q.title}`).join('\n')}
- {{form_title}} - Survey title
- {{submission_date}} - When the form was submitted
- {{user_agent}} - User's browser information

You can customize this template with HTML formatting, add your logo, or include additional fields as needed.
`;
    }

    /**
     * Generate configuration file
     */
    static generateConfigFile(surveyTitle, surveyDescription, questions, settings) {
        const config = {
            survey: {
                title: surveyTitle || '',
                description: surveyDescription || '',
                created: new Date().toISOString(),
                version: '1.0.0'
            },
            questions: questions.map(q => ({
                id: q.id,
                type: q.type,
                title: q.title,
                required: q.required || false,
                options: q.options || null,
                placeholder: q.placeholder || null,
                rows: q.rows || null,
                content: q.content || null,
                description: q.description || null
            })),
            settings: {
                emailjs: {
                    configured: SettingsManager.areSettingsConfigured(),
                    userId: settings.userId ? '***' : '',
                    serviceId: settings.serviceId ? '***' : '',
                    templateId: settings.templateId ? '***' : ''
                }
            },
            metadata: {
                generator: 'Survey Builder Pro',
                generatedAt: new Date().toISOString(),
                totalQuestions: questions.length,
                inputQuestions: questions.filter(q => !['instruction', 'section-break', 'page-break'].includes(q.type)).length
            }
        };
        
        return JSON.stringify(config, null, 2);
    }

    /**
     * Sanitize filename for safe file system usage
     */
    static sanitizeFileName(filename) {
        return filename
            .replace(/[^a-z0-9]/gi, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '')
            .toLowerCase()
            .substring(0, 50);
    }

    /**
     * Download blob as file
     */
    static downloadBlob(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}
