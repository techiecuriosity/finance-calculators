// Main application class
class FinancialCalculatorApp {
    constructor() {
        this.currentCalculator = null;
        this.initializeApp();
    }

    initializeApp() {
        // Initialize router
        this.router = new Router();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initialize calculators
        this.initializeCalculators();
        
        // Handle initial route
        this.router.handleRoute(window.location.pathname);
    }

    addEventListeners() {
        // Navigation menu toggle for mobile
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<span></span><span></span><span></span>';
        document.querySelector('.nav-container').prepend(menuToggle);

        menuToggle.addEventListener('click', () => {
            document.querySelector('.nav-list').classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Handle navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = e.target.getAttribute('href');
                this.router.navigate(path);
            });
        });

        // Handle calculator form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('calculator-form')) {
                e.preventDefault();
                this.handleCalculatorSubmit(e.target);
            }
        });

        // Handle calculator input changes for real-time updates
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('calculator-input')) {
                this.handleCalculatorInput(e.target);
            }
        });
    }

    initializeCalculators() {
        // Create calculator instances
        this.calculators = {
            mortgage: new MortgageCalculator(),
            amortization: new AmortizationCalculator(),
            investment: new InvestmentCalculator()
        };
    }

    handleCalculatorSubmit(form) {
        const calculatorId = form.dataset.calculator;
        const calculator = this.calculators[calculatorId];
        
        if (calculator) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Validate inputs
            if (this.validateInputs(data)) {
                const results = calculator.calculate(data);
                this.displayResults(results, calculatorId);
            }
        }
    }

    handleCalculatorInput(input) {
        const form = input.closest('form');
        if (form && form.dataset.realtime === 'true') {
            this.handleCalculatorSubmit(form);
        }
    }

    validateInputs(data) {
        // Basic validation
        for (const [key, value] of Object.entries(data)) {
            if (!value || isNaN(value) || value < 0) {
                this.showError(`${key} must be a positive number`);
                return false;
            }
        }
        return true;
    }

    displayResults(results, calculatorId) {
        const resultsContainer = document.querySelector(`#${calculatorId}-results`);
        if (resultsContainer) {
            resultsContainer.innerHTML = this.generateResultsHTML(results);
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    generateResultsHTML(results) {
        return `
            <div class="results">
                <h3>Results</h3>
                ${Object.entries(results).map(([key, value]) => `
                    <div class="result-item">
                        <span class="result-label">${this.formatLabel(key)}</span>
                        <span class="result-value">${value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    formatLabel(key) {
        return key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase());
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        document.querySelector('#app').prepend(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FinancialCalculatorApp();
}); 