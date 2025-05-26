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
                        <span class="result-value">${this.formatValue(value)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    formatLabel(key) {
        return key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase());
    }

    formatValue(value) {
        if (typeof value === 'number') {
            return value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            });
        }
        return value;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        document.querySelector('main').prepend(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FinancialCalculatorApp();
});

// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
});

// Initialize the application
function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Load initial content
    loadContent(window.location.pathname);
}

// Set up event listeners
function setupEventListeners() {
    // Handle navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = e.target.getAttribute('href');
            loadContent(path);
            updateURL(path);
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        loadContent(window.location.pathname);
    });
}

// Load content based on route
async function loadContent(path) {
    const app = document.getElementById('app');
    
    try {
        // Show loading state
        app.innerHTML = '<div class="loading">Loading...</div>';
        
        // Determine which content to load
        let content;
        if (path === '/' || path === '') {
            content = await loadHomePage();
        } else if (path === '/calculators') {
            content = await loadCalculatorsPage();
        } else if (path.startsWith('/calculator/')) {
            const calculatorId = path.split('/').pop();
            content = await loadCalculator(calculatorId);
        } else if (path === '/about') {
            content = await loadAboutPage();
        } else if (path === '/contact') {
            content = await loadContactPage();
        } else {
            content = await load404Page();
        }
        
        // Update the content
        app.innerHTML = content;
        
        // Update breadcrumb
        updateBreadcrumb(path);
        
        // Initialize calculator if on calculator page
        if (path.startsWith('/calculator/')) {
            initializeCalculator();
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Error loading content:', error);
        app.innerHTML = '<div class="error">Error loading content. Please try again.</div>';
    }
}

// Update URL without page reload
function updateURL(path) {
    window.history.pushState({}, '', path);
}

// Update breadcrumb navigation
function updateBreadcrumb(path) {
    const breadcrumbList = document.querySelector('.breadcrumb-list');
    const parts = path.split('/').filter(Boolean);
    
    let html = `
        <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <a href="/" class="breadcrumb-link" itemprop="item">
                <span itemprop="name">Home</span>
            </a>
            <meta itemprop="position" content="1" />
        </li>
    `;
    
    let position = 2;
    let currentPath = '';
    
    parts.forEach(part => {
        currentPath += `/${part}`;
        const name = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
        
        html += `
            <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <a href="${currentPath}" class="breadcrumb-link" itemprop="item">
                    <span itemprop="name">${name}</span>
                </a>
                <meta itemprop="position" content="${position}" />
            </li>
        `;
        
        position++;
    });
    
    breadcrumbList.innerHTML = html;
}

// Load home page content
async function loadHomePage() {
    return `
        <section class="hero">
            <h1>Financial Calculators</h1>
            <p class="lead">Make informed financial decisions with our professional-grade calculators</p>
            <div class="cta-buttons">
                <a href="/calculators" class="btn btn-primary">Browse Calculators</a>
                <a href="/about" class="btn btn-secondary">Learn More</a>
            </div>
        </section>

        <section class="featured-calculators">
            <h2>Popular Calculators</h2>
            <div class="calculator-grid">
                ${getFeaturedCalculators()}
            </div>
        </section>

        <section class="testimonials">
            <h2>What Our Users Say</h2>
            <div class="testimonial-grid">
                ${getTestimonials()}
            </div>
        </section>

        <section class="faq">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-list">
                ${getFAQs()}
            </div>
        </section>
    `;
}

// Load calculators page content
async function loadCalculatorsPage() {
    return `
        <section class="calculators">
            <h1>Financial Calculators</h1>
            <p class="lead">Choose from our comprehensive collection of financial calculators</p>
            
            <div class="calculator-categories">
                ${getCalculatorCategories()}
            </div>
        </section>
    `;
}

// Load calculator content
async function loadCalculator(calculatorId) {
    const calculator = getCalculatorById(calculatorId);
    if (!calculator) {
        return load404Page();
    }
    
    return `
        <section class="calculator">
            <h1>${calculator.name}</h1>
            <p class="lead">${calculator.description}</p>
            
            <div class="calculator-form">
                ${calculator.getFormHTML()}
            </div>
            
            <div class="calculator-results" style="display: none;">
                ${calculator.getResultsHTML()}
            </div>
        </section>
    `;
}

// Load about page content
async function loadAboutPage() {
    return `
        <section class="about">
            <h1>About Financial Calculators</h1>
            <p class="lead">Professional-grade financial calculators to help you make informed decisions</p>
            
            <div class="about-content">
                <h2>Our Mission</h2>
                <p>We provide accurate and easy-to-use financial calculators to help individuals make informed financial decisions.</p>
                
                <h2>Our Team</h2>
                <p>Our team consists of financial experts and software engineers dedicated to creating the best financial tools.</p>
                
                <h2>Our Values</h2>
                <ul>
                    <li>Accuracy and reliability</li>
                    <li>User-friendly design</li>
                    <li>Continuous improvement</li>
                    <li>Customer satisfaction</li>
                </ul>
            </div>
        </section>
    `;
}

// Load contact page content
async function loadContactPage() {
    return `
        <section class="contact">
            <h1>Contact Us</h1>
            <p class="lead">Get in touch with our team</p>
            
            <div class="contact-content">
                <div class="contact-info">
                    <h2>Contact Information</h2>
                    <p>Email: <a href="mailto:support@financialcalculators.pro">support@financialcalculators.pro</a></p>
                    <p>Phone: +1-555-0123</p>
                </div>
                
                <form class="contact-form" id="contactForm">
                    <div class="form-group">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" id="name" name="name" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" id="email" name="email" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="message" class="form-label">Message</label>
                        <textarea id="message" name="message" class="form-input" rows="5" required></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
            </div>
        </section>
    `;
}

// Load 404 page content
async function load404Page() {
    return `
        <section class="error-404">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" class="btn btn-primary">Go Home</a>
        </section>
    `;
}

// Initialize calculator functionality
function initializeCalculator() {
    const form = document.querySelector('.calculator-form form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateResults();
        });
    }
}

// Calculate and display results
function calculateResults() {
    const form = document.querySelector('.calculator-form form');
    const resultsDiv = document.querySelector('.calculator-results');
    
    if (form && resultsDiv) {
        const formData = new FormData(form);
        const calculatorId = window.location.pathname.split('/').pop();
        const calculator = getCalculatorById(calculatorId);
        
        if (calculator) {
            const results = calculator.calculate(formData);
            resultsDiv.innerHTML = calculator.getResultsHTML(results);
            resultsDiv.style.display = 'block';
            
            // Scroll to results
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Get featured calculators
function getFeaturedCalculators() {
    const featured = [
        {
            id: 'mortgage',
            name: 'Mortgage Calculator',
            description: 'Calculate your monthly mortgage payments and total interest.'
        },
        {
            id: 'loan',
            name: 'Loan Calculator',
            description: 'Calculate loan payments and interest for any type of loan.'
        },
        {
            id: 'investment',
            name: 'Investment Calculator',
            description: 'Calculate investment returns and growth over time.'
        }
    ];
    
    return featured.map(calc => `
        <div class="calculator-card">
            <h3>${calc.name}</h3>
            <p>${calc.description}</p>
            <a href="/calculator/${calc.id}" class="btn btn-primary">Use Calculator</a>
        </div>
    `).join('');
}

// Get testimonials
function getTestimonials() {
    const testimonials = [
        {
            name: 'John Smith',
            role: 'Homeowner',
            text: 'The mortgage calculator helped me understand my monthly payments and make an informed decision.'
        },
        {
            name: 'Sarah Johnson',
            role: 'Investor',
            text: 'I use the investment calculator regularly to plan my retirement savings.'
        },
        {
            name: 'Michael Brown',
            role: 'Business Owner',
            text: 'These calculators are professional-grade and easy to use. Highly recommended!'
        }
    ];
    
    return testimonials.map(testimonial => `
        <div class="testimonial-card">
            <p class="testimonial-text">"${testimonial.text}"</p>
            <p class="testimonial-author">- ${testimonial.name}, ${testimonial.role}</p>
        </div>
    `).join('');
}

// Get FAQs
function getFAQs() {
    const faqs = [
        {
            question: 'Are the calculators free to use?',
            answer: 'Yes, all our calculators are completely free to use with no hidden fees.'
        },
        {
            question: 'How accurate are the calculations?',
            answer: 'Our calculators use industry-standard formulas and are regularly tested for accuracy.'
        },
        {
            question: 'Can I use the calculators on mobile devices?',
            answer: 'Yes, our website is fully responsive and works on all devices.'
        }
    ];
    
    return faqs.map((faq, index) => `
        <div class="faq-item" data-index="${index}">
            <div class="faq-question">${faq.question}</div>
            <div class="faq-answer">${faq.answer}</div>
        </div>
    `).join('');
}

// Get calculator categories
function getCalculatorCategories() {
    const categories = [
        {
            id: 'mortgage',
            name: 'Mortgage Calculators',
            description: 'Calculate mortgage payments, interest, and more.',
            calculators: [
                { id: 'mortgage', name: 'Mortgage Calculator' },
                { id: 'amortization', name: 'Amortization Calculator' },
                { id: 'mortgage-payoff', name: 'Mortgage Payoff Calculator' }
            ]
        },
        {
            id: 'loan',
            name: 'Loan Calculators',
            description: 'Calculate loan payments, interest, and more.',
            calculators: [
                { id: 'loan', name: 'Loan Calculator' },
                { id: 'auto-loan', name: 'Auto Loan Calculator' },
                { id: 'personal-loan', name: 'Personal Loan Calculator' }
            ]
        },
        {
            id: 'investment',
            name: 'Investment Calculators',
            description: 'Calculate investment returns, growth, and more.',
            calculators: [
                { id: 'investment', name: 'Investment Calculator' },
                { id: 'compound-interest', name: 'Compound Interest Calculator' },
                { id: 'roi', name: 'ROI Calculator' }
            ]
        }
    ];
    
    return categories.map(category => `
        <div class="category-card">
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <ul class="calculator-list">
                ${category.calculators.map(calc => `
                    <li>
                        <a href="/calculator/${calc.id}">${calc.name}</a>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

// Get calculator by ID
function getCalculatorById(id) {
    // This would typically come from a database or API
    // For now, we'll return a mock calculator
    return {
        id: id,
        name: 'Mortgage Calculator',
        description: 'Calculate your monthly mortgage payments and total interest.',
        getFormHTML: () => `
            <form>
                <div class="form-group">
                    <label for="loanAmount" class="form-label">Loan Amount ($)</label>
                    <input type="number" id="loanAmount" name="loanAmount" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label for="interestRate" class="form-label">Interest Rate (%)</label>
                    <input type="number" id="interestRate" name="interestRate" class="form-input" step="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="loanTerm" class="form-label">Loan Term (years)</label>
                    <input type="number" id="loanTerm" name="loanTerm" class="form-input" required>
                </div>
                
                <button type="submit" class="btn btn-primary">Calculate</button>
            </form>
        `,
        calculate: (formData) => {
            const loanAmount = parseFloat(formData.get('loanAmount'));
            const interestRate = parseFloat(formData.get('interestRate')) / 100 / 12;
            const loanTerm = parseFloat(formData.get('loanTerm')) * 12;
            
            const monthlyPayment = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) / (Math.pow(1 + interestRate, loanTerm) - 1);
            const totalPayment = monthlyPayment * loanTerm;
            const totalInterest = totalPayment - loanAmount;
            
            return {
                monthlyPayment: monthlyPayment.toFixed(2),
                totalPayment: totalPayment.toFixed(2),
                totalInterest: totalInterest.toFixed(2)
            };
        },
        getResultsHTML: (results) => `
            <h3>Results</h3>
            <div class="result-item">
                <span>Monthly Payment:</span>
                <span>$${results.monthlyPayment}</span>
            </div>
            <div class="result-item">
                <span>Total Payment:</span>
                <span>$${results.totalPayment}</span>
            </div>
            <div class="result-item">
                <span>Total Interest:</span>
                <span>$${results.totalInterest}</span>
            </div>
        `
    };
} 