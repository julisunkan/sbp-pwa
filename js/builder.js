/**
 * Question Builder Module
 * Handles question creation, editing, and management
 */

class QuestionBuilder {
    /**
     * Create a new question object
     */
    static createQuestion(id, type) {
        const baseQuestion = {
            id: id,
            type: type,
            title: this.getDefaultTitle(type),
            required: false,
            createdAt: new Date().toISOString()
        };

        switch (type) {
            case 'short-answer':
                return {
                    ...baseQuestion,
                    placeholder: 'Enter your answer...'
                };
            
            case 'paragraph':
                return {
                    ...baseQuestion,
                    placeholder: 'Enter your detailed response...',
                    rows: 4
                };
            
            case 'radio':
            case 'checkbox':
            case 'dropdown':
            case 'multi-select':
                return {
                    ...baseQuestion,
                    options: ['Option 1', 'Option 2']
                };
            
            case 'instruction':
                return {
                    ...baseQuestion,
                    title: 'Instruction Title',
                    content: 'Enter your instruction text here...'
                };
            
            case 'section-break':
                return {
                    ...baseQuestion,
                    title: 'Section Title',
                    description: 'Optional section description'
                };
            
            case 'page-break':
                return {
                    ...baseQuestion,
                    title: 'Page Break',
                    description: 'This will create a new page in the form'
                };
            
            default:
                return baseQuestion;
        }
    }

    /**
     * Get default title for question type
     */
    static getDefaultTitle(type) {
        const titles = {
            'short-answer': 'Short Answer Question',
            'paragraph': 'Paragraph Question',
            'radio': 'Multiple Choice Question',
            'checkbox': 'Checkbox Question',
            'dropdown': 'Dropdown Question',
            'multi-select': 'Multi-Select Question',
            'instruction': 'Instruction',
            'section-break': 'Section Break',
            'page-break': 'Page Break'
        };
        return titles[type] || 'Question';
    }

    /**
     * Get question type display name
     */
    static getTypeDisplayName(type) {
        const names = {
            'short-answer': 'Short Answer',
            'paragraph': 'Paragraph',
            'radio': 'Multiple Choice',
            'checkbox': 'Checkboxes',
            'dropdown': 'Dropdown',
            'multi-select': 'Multi-Select',
            'instruction': 'Instruction',
            'section-break': 'Section Break',
            'page-break': 'Page Break'
        };
        return names[type] || type;
    }

    /**
     * Create question element for the builder
     */
    static createQuestionElement(question) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item fade-in';
        questionDiv.setAttribute('data-question-id', question.id);
        
        questionDiv.innerHTML = this.generateQuestionHTML(question);
        
        // Add event listeners
        this.attachQuestionEventListeners(questionDiv, question);
        
        return questionDiv;
    }

    /**
     * Generate HTML for a question
     */
    static generateQuestionHTML(question) {
        const typeDisplayName = this.getTypeDisplayName(question.type);
        
        let contentHTML = '';
        
        switch (question.type) {
            case 'short-answer':
            case 'paragraph':
                contentHTML = this.generateTextQuestionHTML(question);
                break;
            case 'radio':
            case 'checkbox':
            case 'dropdown':
            case 'multi-select':
                contentHTML = this.generateOptionsQuestionHTML(question);
                break;
            case 'instruction':
                contentHTML = this.generateInstructionHTML(question);
                break;
            case 'section-break':
                contentHTML = this.generateSectionBreakHTML(question);
                break;
            case 'page-break':
                contentHTML = this.generatePageBreakHTML(question);
                break;
            default:
                contentHTML = this.generateTextQuestionHTML(question);
        }

        return `
            <div class="question-header">
                <div class="d-flex align-items-center flex-grow-1">
                    <span class="question-type-badge me-2">${typeDisplayName}</span>
                    <small class="text-muted">ID: ${question.id}</small>
                </div>
                <div class="question-actions">
                    <button type="button" class="btn btn-outline-primary btn-sm edit-question-btn">
                        <i data-feather="edit-2"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm delete-question-btn">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </div>
            <div class="question-content">
                ${contentHTML}
            </div>
        `;
    }

    /**
     * Generate HTML for text-based questions
     */
    static generateTextQuestionHTML(question) {
        const requiredCheck = question.required ? 'checked' : '';
        const placeholderValue = question.placeholder || '';
        const rowsValue = question.rows || 1;
        
        return `
            <div class="mb-3">
                <label class="form-label fw-semibold">Question Title</label>
                <input type="text" class="form-control question-title-input" value="${question.title}" placeholder="Enter question title">
            </div>
            ${question.type === 'paragraph' ? `
            <div class="mb-3">
                <label class="form-label fw-semibold">Number of Rows</label>
                <input type="number" class="form-control question-rows-input" value="${rowsValue}" min="1" max="10">
            </div>
            ` : ''}
            <div class="mb-3">
                <label class="form-label fw-semibold">Placeholder Text</label>
                <input type="text" class="form-control question-placeholder-input" value="${placeholderValue}" placeholder="Enter placeholder text">
            </div>
            <div class="form-check">
                <input class="form-check-input question-required-input" type="checkbox" ${requiredCheck}>
                <label class="form-check-label">Required field</label>
            </div>
        `;
    }

    /**
     * Generate HTML for options-based questions
     */
    static generateOptionsQuestionHTML(question) {
        const requiredCheck = question.required ? 'checked' : '';
        const optionsHTML = question.options.map((option, index) => `
            <div class="option-item">
                <input type="text" class="form-control option-input" value="${option}" placeholder="Option ${index + 1}">
                <button type="button" class="option-remove" onclick="removeOption(this)">
                    <i data-feather="x"></i>
                </button>
            </div>
        `).join('');

        return `
            <div class="mb-3">
                <label class="form-label fw-semibold">Question Title</label>
                <input type="text" class="form-control question-title-input" value="${question.title}" placeholder="Enter question title">
            </div>
            <div class="mb-3">
                <label class="form-label fw-semibold">Options</label>
                <div class="options-list">
                    ${optionsHTML}
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm mt-2 add-option-btn">
                    <i data-feather="plus"></i> Add Option
                </button>
            </div>
            <div class="form-check">
                <input class="form-check-input question-required-input" type="checkbox" ${requiredCheck}>
                <label class="form-check-label">Required field</label>
            </div>
        `;
    }

    /**
     * Generate HTML for instruction
     */
    static generateInstructionHTML(question) {
        return `
            <div class="mb-3">
                <label class="form-label fw-semibold">Instruction Title</label>
                <input type="text" class="form-control question-title-input" value="${question.title}" placeholder="Enter instruction title">
            </div>
            <div class="mb-3">
                <label class="form-label fw-semibold">Instruction Content</label>
                <textarea class="form-control question-content-input" rows="3" placeholder="Enter instruction content">${question.content || ''}</textarea>
            </div>
        `;
    }

    /**
     * Generate HTML for section break
     */
    static generateSectionBreakHTML(question) {
        return `
            <div class="mb-3">
                <label class="form-label fw-semibold">Section Title</label>
                <input type="text" class="form-control question-title-input" value="${question.title}" placeholder="Enter section title">
            </div>
            <div class="mb-3">
                <label class="form-label fw-semibold">Section Description (Optional)</label>
                <textarea class="form-control question-description-input" rows="2" placeholder="Enter section description">${question.description || ''}</textarea>
            </div>
        `;
    }

    /**
     * Generate HTML for page break
     */
    static generatePageBreakHTML(question) {
        return `
            <div class="mb-3">
                <label class="form-label fw-semibold">Page Break Title</label>
                <input type="text" class="form-control question-title-input" value="${question.title}" placeholder="Enter page break title">
            </div>
            <div class="mb-3">
                <label class="form-label fw-semibold">Description</label>
                <textarea class="form-control question-description-input" rows="2" placeholder="Enter description">${question.description || ''}</textarea>
            </div>
        `;
    }

    /**
     * Attach event listeners to question element
     */
    static attachQuestionEventListeners(questionElement, question) {
        const questionId = question.id;

        // Delete button
        const deleteBtn = questionElement.querySelector('.delete-question-btn');
        deleteBtn.addEventListener('click', () => {
            window.deleteQuestion(questionId);
        });

        // Question title input
        const titleInput = questionElement.querySelector('.question-title-input');
        if (titleInput) {
            titleInput.addEventListener('input', (e) => {
                window.updateQuestion(questionId, { title: e.target.value });
            });
        }

        // Question content input (for instructions)
        const contentInput = questionElement.querySelector('.question-content-input');
        if (contentInput) {
            contentInput.addEventListener('input', (e) => {
                window.updateQuestion(questionId, { content: e.target.value });
            });
        }

        // Question description input
        const descriptionInput = questionElement.querySelector('.question-description-input');
        if (descriptionInput) {
            descriptionInput.addEventListener('input', (e) => {
                window.updateQuestion(questionId, { description: e.target.value });
            });
        }

        // Placeholder input
        const placeholderInput = questionElement.querySelector('.question-placeholder-input');
        if (placeholderInput) {
            placeholderInput.addEventListener('input', (e) => {
                window.updateQuestion(questionId, { placeholder: e.target.value });
            });
        }

        // Rows input
        const rowsInput = questionElement.querySelector('.question-rows-input');
        if (rowsInput) {
            rowsInput.addEventListener('input', (e) => {
                window.updateQuestion(questionId, { rows: parseInt(e.target.value) });
            });
        }

        // Required checkbox
        const requiredInput = questionElement.querySelector('.question-required-input');
        if (requiredInput) {
            requiredInput.addEventListener('change', (e) => {
                window.updateQuestion(questionId, { required: e.target.checked });
            });
        }

        // Option inputs
        const optionInputs = questionElement.querySelectorAll('.option-input');
        optionInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                this.updateQuestionOption(questionId, index, e.target.value);
            });
        });

        // Add option button
        const addOptionBtn = questionElement.querySelector('.add-option-btn');
        if (addOptionBtn) {
            addOptionBtn.addEventListener('click', () => {
                this.addQuestionOption(questionId);
            });
        }
    }

    /**
     * Update a specific option in a question
     */
    static updateQuestionOption(questionId, optionIndex, value) {
        const question = window.surveyApp.questions.find(q => q.id === questionId);
        if (question && question.options) {
            question.options[optionIndex] = value;
            window.updateQuestion(questionId, { options: question.options });
        }
    }

    /**
     * Add a new option to a question
     */
    static addQuestionOption(questionId) {
        const question = window.surveyApp.questions.find(q => q.id === questionId);
        if (question && question.options) {
            question.options.push(`Option ${question.options.length + 1}`);
            window.updateQuestion(questionId, { options: question.options });
            
            // Re-render the question
            const questionElement = document.querySelector(`[data-question-id="${questionId}"]`);
            const newQuestionElement = this.createQuestionElement(question);
            questionElement.parentNode.replaceChild(newQuestionElement, questionElement);
            
            // Re-initialize feather icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }
    }
}

// Global function for removing options (called from HTML)
window.removeOption = function(button) {
    const optionItem = button.closest('.option-item');
    const questionElement = button.closest('.question-item');
    const questionId = parseInt(questionElement.getAttribute('data-question-id'));
    
    // Find the option index
    const optionInputs = questionElement.querySelectorAll('.option-input');
    const optionIndex = Array.from(optionInputs).indexOf(optionItem.querySelector('.option-input'));
    
    if (optionIndex !== -1) {
        const question = window.surveyApp.questions.find(q => q.id === questionId);
        if (question && question.options && question.options.length > 1) {
            question.options.splice(optionIndex, 1);
            window.updateQuestion(questionId, { options: question.options });
            
            // Re-render the question
            const newQuestionElement = QuestionBuilder.createQuestionElement(question);
            questionElement.parentNode.replaceChild(newQuestionElement, questionElement);
            
            // Re-initialize feather icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        } else {
            window.surveyApp.showNotification('A question must have at least one option.', 'warning');
        }
    }
};

// Add question button event listener
document.addEventListener('DOMContentLoaded', () => {
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', () => {
            const questionType = document.getElementById('questionType').value;
            window.addQuestion(questionType);
        });
    }
});
