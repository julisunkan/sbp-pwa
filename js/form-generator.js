/**
 * Form Generator Module
 * Handles HTML form generation for preview and embed code
 */

class FormGenerator {
    /**
     * Generate preview HTML for the builder
     */
    static generatePreview(title, description, questions) {
        if (questions.length === 0 && !title && !description) {
            return `
                <div class="text-center text-muted py-4">
                    <i data-feather="monitor" style="width: 32px; height: 32px; opacity: 0.5;"></i>
                    <p class="mt-2 mb-0 small">Preview will appear here</p>
                </div>
            `;
        }

        let html = '<div class="preview-form">';
        
        // Add title and description
        if (title) {
            html += `<h4 class="mb-3">${this.escapeHtml(title)}</h4>`;
        }
        
        if (description) {
            html += `<p class="text-muted mb-4">${this.escapeHtml(description)}</p>`;
        }

        // Add questions
        questions.forEach((question, index) => {
            html += this.generateQuestionPreview(question, index);
        });

        // Add submit button if there are input questions
        const hasInputQuestions = questions.some(q => 
            !['instruction', 'section-break', 'page-break'].includes(q.type)
        );
        
        if (hasInputQuestions) {
            html += `
                <div class="mt-4">
                    <button type="button" class="btn btn-gradient" disabled>
                        Submit Response
                    </button>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    /**
     * Generate preview for a single question
     */
    static generateQuestionPreview(question, index) {
        const questionNumber = index + 1;
        
        switch (question.type) {
            case 'short-answer':
                return this.generateShortAnswerPreview(question, questionNumber);
            case 'paragraph':
                return this.generateParagraphPreview(question, questionNumber);
            case 'radio':
                return this.generateRadioPreview(question, questionNumber);
            case 'checkbox':
                return this.generateCheckboxPreview(question, questionNumber);
            case 'dropdown':
                return this.generateDropdownPreview(question, questionNumber);
            case 'multi-select':
                return this.generateMultiSelectPreview(question, questionNumber);
            case 'instruction':
                return this.generateInstructionPreview(question);
            case 'section-break':
                return this.generateSectionBreakPreview(question);
            case 'page-break':
                return this.generatePageBreakPreview(question);
            default:
                return '';
        }
    }

    /**
     * Generate complete embed code
     */
    static generateEmbedCode(title, description, questions, settings) {
        const css = this.generateEmbedCSS();
        const html = this.generateEmbedHTML(title, description, questions);
        const js = this.generateEmbedJS(settings);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(title || 'Survey')}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
${css}
    </style>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
${html}
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    <script>
${js}
    </script>
</body>
</html>`;
    }

    /**
     * Generate embed CSS
     */
    static generateEmbedCSS() {
        return `        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
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
        }
        
        .survey-description {
            color: #6b7280;
            margin-bottom: 2rem;
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
        }
        
        .required-indicator {
            color: #ef4444;
            margin-left: 0.25rem;
        }
        
        .form-control, .form-select {
            border-radius: 8px;
            border: 1px solid #d1d5db;
            font-family: 'Poppins', sans-serif;
        }
        
        .form-control:focus, .form-select:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border: none;
            border-radius: 8px;
            font-weight: 500;
            padding: 0.75rem 2rem;
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, #5855eb 0%, #7c3aed 100%);
            transform: translateY(-1px);
        }
        
        .instruction-text {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 1rem;
            border-radius: 0 8px 8px 0;
            font-style: italic;
            margin-bottom: 1.5rem;
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
        
        .page-break {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
            color: white;
            text-align: center;
            padding: 1.5rem;
            border-radius: 8px;
            border: 2px dashed rgba(255, 255, 255, 0.3);
            margin: 2rem 0;
        }
        
        .alert {
            border-radius: 8px;
            border: none;
        }
        
        .spinner-border-sm {
            width: 1rem;
            height: 1rem;
        }
        
        @media (max-width: 768px) {
            .survey-container {
                padding: 1.5rem;
                margin: 1rem 0;
            }
        }`;
    }

    /**
     * Generate embed HTML
     */
    static generateEmbedHTML(title, description, questions) {
        let html = `                <div class="survey-container">`;
        
        // Add title and description
        if (title) {
            html += `
                    <h2 class="survey-title">${this.escapeHtml(title)}</h2>`;
        }
        
        if (description) {
            html += `
                    <p class="survey-description">${this.escapeHtml(description)}</p>`;
        }

        // Start form
        html += `
                    <form id="surveyForm" novalidate>`;

        // Add questions
        questions.forEach((question, index) => {
            html += this.generateQuestionEmbedHTML(question, index);
        });

        // Add submit button if there are input questions
        const hasInputQuestions = questions.some(q => 
            !['instruction', 'section-break', 'page-break'].includes(q.type)
        );
        
        if (hasInputQuestions) {
            html += `
                        <div class="text-center mt-4">
                            <button type="submit" id="submitBtn" class="btn btn-primary btn-lg">
                                Submit Response
                            </button>
                        </div>`;
        }

        html += `
                    </form>
                </div>`;

        return html;
    }

    /**
     * Generate embed HTML for a single question
     */
    static generateQuestionEmbedHTML(question, index) {
        switch (question.type) {
            case 'short-answer':
                return this.generateShortAnswerEmbedHTML(question, index);
            case 'paragraph':
                return this.generateParagraphEmbedHTML(question, index);
            case 'radio':
                return this.generateRadioEmbedHTML(question, index);
            case 'checkbox':
                return this.generateCheckboxEmbedHTML(question, index);
            case 'dropdown':
                return this.generateDropdownEmbedHTML(question, index);
            case 'multi-select':
                return this.generateMultiSelectEmbedHTML(question, index);
            case 'instruction':
                return this.generateInstructionEmbedHTML(question);
            case 'section-break':
                return this.generateSectionBreakEmbedHTML(question);
            case 'page-break':
                return this.generatePageBreakEmbedHTML(question);
            default:
                return '';
        }
    }

    /**
     * Generate embed JavaScript
     */
    static generateEmbedJS(settings) {
        const emailjsScript = SettingsManager.getEmailJSInitScript(settings);
        const submissionScript = SettingsManager.getFormSubmissionScript(settings);
        
        return `${emailjsScript}

${submissionScript}`;
    }

    // Preview generation methods
    static generateShortAnswerPreview(question, questionNumber) {
        const required = question.required ? ' <span class="text-danger">*</span>' : '';
        const placeholder = question.placeholder || 'Enter your answer...';
        
        return `
            <div class="form-group mb-3">
                <label class="form-label">
                    <strong>${questionNumber}.</strong> ${this.escapeHtml(question.title)}${required}
                </label>
                <input type="text" class="form-control" placeholder="${this.escapeHtml(placeholder)}" disabled>
            </div>
        `;
    }

    static generateParagraphPreview(question, questionNumber) {
        const required = question.required ? ' <span class="text-danger">*</span>' : '';
        const placeholder = question.placeholder || 'Enter your detailed response...';
        const rows = question.rows || 4;
        
        return `
            <div class="form-group mb-3">
                <label class="form-label">
                    <strong>${questionNumber}.</strong> ${this.escapeHtml(question.title)}${required}
                </label>
                <textarea class="form-control" rows="${rows}" placeholder="${this.escapeHtml(placeholder)}" disabled></textarea>
            </div>
        `;
    }

    static generateRadioPreview(question, questionNumber) {
        const required = question.required ? ' <span class="text-danger">*</span>' : '';
        const options = question.options || [];
        
        let optionsHTML = '';
        options.forEach((option, index) => {
            optionsHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="question_${question.id}" disabled>
                    <label class="form-check-label">${this.escapeHtml(option)}</label>
                </div>
            `;
        });
        
        return `
            <div class="form-group mb-3">
                <label class="form-label">
                    <strong>${questionNumber}.</strong> ${this.escapeHtml(question.title)}${required}
                </label>
                ${optionsHTML}
            </div>
        `;
    }

    static generateCheckboxPreview(question, questionNumber) {
        const required = question.required ? ' <span class="text-danger">*</span>' : '';
        const options = question.options || [];
        
        let optionsHTML = '';
        options.forEach((option, index) => {
            optionsHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" disabled>
                    <label class="form-check-label">${this.escapeHtml(option)}</label>
                </div>
            `;
        });
        
        return `
            <div class="form-group mb-3">
                <label class="form-label">
                    <strong>${questionNumber}.</strong> ${this.escapeHtml(question.title)}${required}
                </label>
                ${optionsHTML}
            </div>
        `;
    }

    static generateDropdownPreview(question, questionNumber) {
        const required = question.required ? ' <span class="text-danger">*</span>' : '';
        const options = question.options || [];
        
        let optionsHTML = '<option value="">Select an option...</option>';
        options.forEach(option => {
            optionsHTML += `<option value="${this.escapeHtml(option)}">${this.escapeHtml(option)}</option>`;
        });
        
        return `
            <div class="form-group mb-3">
                <label class="form-label">
                    <strong>${questionNumber}.</strong> ${this.escapeHtml(question.title)}${required}
                </label>
                <select class="form-select" disabled>
                    ${optionsHTML}
                </select>
            </div>
        `;
    }

    static generateMultiSelectPreview(question, questionNumber) {
        const required = question.required ? ' <span class="text-danger">*</span>' : '';
        const options = question.options || [];
        
        let optionsHTML = '';
        options.forEach(option => {
            optionsHTML += `<option value="${this.escapeHtml(option)}">${this.escapeHtml(option)}</option>`;
        });
        
        return `
            <div class="form-group mb-3">
                <label class="form-label">
                    <strong>${questionNumber}.</strong> ${this.escapeHtml(question.title)}${required}
                </label>
                <select class="form-select" multiple size="4" disabled>
                    ${optionsHTML}
                </select>
                <div class="form-text">Hold Ctrl (or Cmd on Mac) to select multiple options</div>
            </div>
        `;
    }

    static generateInstructionPreview(question) {
        return `
            <div class="instruction-text">
                <h6>${this.escapeHtml(question.title)}</h6>
                <p class="mb-0">${this.escapeHtml(question.content || '')}</p>
            </div>
        `;
    }

    static generateSectionBreakPreview(question) {
        return `
            <div class="section-break">
                <h5 class="mb-1">${this.escapeHtml(question.title)}</h5>
                ${question.description ? `<p class="mb-0 small">${this.escapeHtml(question.description)}</p>` : ''}
            </div>
        `;
    }

    static generatePageBreakPreview(question) {
        return `
            <div class="page-break">
                <h6 class="mb-1">${this.escapeHtml(question.title)}</h6>
                <p class="mb-0 small">${this.escapeHtml(question.description || 'This will create a new page in the form')}</p>
            </div>
        `;
    }

    // Embed HTML generation methods
    static generateShortAnswerEmbedHTML(question, index) {
        const required = question.required ? ' required' : '';
        const requiredIndicator = question.required ? ' <span class="required-indicator">*</span>' : '';
        const placeholder = question.placeholder || 'Enter your answer...';
        const fieldName = `question_${question.id}`;
        
        return `
                        <div class="question-group">
                            <label for="${fieldName}" class="question-title">
                                ${this.escapeHtml(question.title)}${requiredIndicator}
                            </label>
                            <input type="text" id="${fieldName}" name="${fieldName}" class="form-control" placeholder="${this.escapeHtml(placeholder)}"${required}>
                        </div>`;
    }

    static generateParagraphEmbedHTML(question, index) {
        const required = question.required ? ' required' : '';
        const requiredIndicator = question.required ? ' <span class="required-indicator">*</span>' : '';
        const placeholder = question.placeholder || 'Enter your detailed response...';
        const rows = question.rows || 4;
        const fieldName = `question_${question.id}`;
        
        return `
                        <div class="question-group">
                            <label for="${fieldName}" class="question-title">
                                ${this.escapeHtml(question.title)}${requiredIndicator}
                            </label>
                            <textarea id="${fieldName}" name="${fieldName}" class="form-control" rows="${rows}" placeholder="${this.escapeHtml(placeholder)}"${required}></textarea>
                        </div>`;
    }

    static generateRadioEmbedHTML(question, index) {
        const required = question.required ? ' required' : '';
        const requiredIndicator = question.required ? ' <span class="required-indicator">*</span>' : '';
        const options = question.options || [];
        const fieldName = `question_${question.id}`;
        
        let optionsHTML = '';
        options.forEach((option, optionIndex) => {
            const optionId = `${fieldName}_${optionIndex}`;
            optionsHTML += `
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="${fieldName}" id="${optionId}" value="${this.escapeHtml(option)}"${required}>
                                <label class="form-check-label" for="${optionId}">
                                    ${this.escapeHtml(option)}
                                </label>
                            </div>`;
        });
        
        return `
                        <div class="question-group">
                            <div class="question-title">
                                ${this.escapeHtml(question.title)}${requiredIndicator}
                            </div>
                            ${optionsHTML}
                        </div>`;
    }

    static generateCheckboxEmbedHTML(question, index) {
        const required = question.required ? ' required' : '';
        const requiredIndicator = question.required ? ' <span class="required-indicator">*</span>' : '';
        const options = question.options || [];
        const fieldName = `question_${question.id}`;
        
        let optionsHTML = '';
        options.forEach((option, optionIndex) => {
            const optionId = `${fieldName}_${optionIndex}`;
            optionsHTML += `
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="${fieldName}[]" id="${optionId}" value="${this.escapeHtml(option)}">
                                <label class="form-check-label" for="${optionId}">
                                    ${this.escapeHtml(option)}
                                </label>
                            </div>`;
        });
        
        return `
                        <div class="question-group">
                            <div class="question-title">
                                ${this.escapeHtml(question.title)}${requiredIndicator}
                            </div>
                            ${optionsHTML}
                        </div>`;
    }

    static generateDropdownEmbedHTML(question, index) {
        const required = question.required ? ' required' : '';
        const requiredIndicator = question.required ? ' <span class="required-indicator">*</span>' : '';
        const options = question.options || [];
        const fieldName = `question_${question.id}`;
        
        let optionsHTML = '<option value="">Select an option...</option>';
        options.forEach(option => {
            optionsHTML += `<option value="${this.escapeHtml(option)}">${this.escapeHtml(option)}</option>`;
        });
        
        return `
                        <div class="question-group">
                            <label for="${fieldName}" class="question-title">
                                ${this.escapeHtml(question.title)}${requiredIndicator}
                            </label>
                            <select id="${fieldName}" name="${fieldName}" class="form-select"${required}>
                                ${optionsHTML}
                            </select>
                        </div>`;
    }

    static generateMultiSelectEmbedHTML(question, index) {
        const required = question.required ? ' required' : '';
        const requiredIndicator = question.required ? ' <span class="required-indicator">*</span>' : '';
        const options = question.options || [];
        const fieldName = `question_${question.id}`;
        
        let optionsHTML = '';
        options.forEach(option => {
            optionsHTML += `<option value="${this.escapeHtml(option)}">${this.escapeHtml(option)}</option>`;
        });
        
        return `
                        <div class="question-group">
                            <label for="${fieldName}" class="question-title">
                                ${this.escapeHtml(question.title)}${requiredIndicator}
                            </label>
                            <select id="${fieldName}" name="${fieldName}[]" class="form-select" multiple size="4"${required}>
                                ${optionsHTML}
                            </select>
                            <div class="form-text">Hold Ctrl (or Cmd on Mac) to select multiple options</div>
                        </div>`;
    }

    static generateInstructionEmbedHTML(question) {
        return `
                        <div class="instruction-text">
                            <h6>${this.escapeHtml(question.title)}</h6>
                            <p class="mb-0">${this.escapeHtml(question.content || '')}</p>
                        </div>`;
    }

    static generateSectionBreakEmbedHTML(question) {
        return `
                        <div class="section-break">
                            <h5 class="mb-1">${this.escapeHtml(question.title)}</h5>
                            ${question.description ? `<p class="mb-0 small">${this.escapeHtml(question.description)}</p>` : ''}
                        </div>`;
    }

    static generatePageBreakEmbedHTML(question) {
        return `
                        <div class="page-break">
                            <h6 class="mb-1">${this.escapeHtml(question.title)}</h6>
                            <p class="mb-0 small">${this.escapeHtml(question.description || 'This will create a new page in the form')}</p>
                        </div>`;
    }

    /**
     * Escape HTML characters to prevent XSS
     */
    static escapeHtml(text) {
        if (typeof text !== 'string') return '';
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
}
