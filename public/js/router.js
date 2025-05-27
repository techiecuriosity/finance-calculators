// Client-side router
class Router {
    constructor() {
        this.routes = [
            { path: '/', handler: () => this.loadHomePage() },
            { path: '/calculators', handler: () => this.loadCalculatorsPage() },
            { path: /^\/calculator\/(.+)$/, handler: (params) => this.loadCalculatorPage(params[1]) },
            { path: '/about', handler: () => this.loadAboutPage() },
            { path: '/contact', handler: () => this.loadContactPage() }
        ];

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname);
        });

        // Handle initial route
        this.handleRoute(window.location.pathname);
    }

    handleRoute(path) {
        const route = this.routes.find(route => {
            if (route.path instanceof RegExp) {
                const match = path.match(route.path);
                if (match) {
                    route.params = match.slice(1);
                    return true;
                }
                return false;
            }
            return route.path === path;
        });

        if (route) {
            route.handler(route.params);
        } else {
            this.handle404();
        }
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute(path);
    }

    async loadHomePage() {
        const app = document.getElementById('app');
        app.innerHTML = `
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
                    ${this.generateFeaturedCalculators()}
                </div>
            </section>
        `;
    }

    async loadCalculatorsPage() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <section class="calculators">
                <h1>Financial Calculators</h1>
                <p class="lead">Choose from our comprehensive collection of financial calculators</p>
                
                <div class="calculator-categories">
                    ${this.generateCalculatorCategories()}
                </div>
            </section>
        `;
    }

    async loadCalculatorPage(calculatorId) {
        const app = document.getElementById('app');
        const calculator = window.calculators[calculatorId];
        
        if (!calculator) {
            return this.handle404();
        }

        app.innerHTML = `
            <section class="calculator">
                <h1>${calculator.name}</h1>
                <p class="lead">${calculator.description}</p>
                
                <div class="calculator-form">
                    ${calculator.getFormHTML()}
                </div>
                
                <div id="${calculatorId}-results" class="calculator-results"></div>
            </section>
        `;
    }

    async loadAboutPage() {
        const app = document.getElementById('app');
        app.innerHTML = `
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

    async loadContactPage() {
        const app = document.getElementById('app');
        app.innerHTML = `
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

    handle404() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <section class="error-404">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" class="btn btn-primary">Go Home</a>
            </section>
        `;
    }

    generateFeaturedCalculators() {
        const featured = [
            {
                id: 'mortgage',
                name: 'Mortgage Calculator',
                description: 'Calculate your monthly mortgage payments and total interest.'
            },
            {
                id: 'amortization',
                name: 'Amortization Calculator',
                description: 'View your complete loan amortization schedule.'
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

    generateCalculatorCategories() {
        const categories = [
            {
                id: 'mortgage',
                name: 'Mortgage Calculators',
                description: 'Calculate mortgage payments, interest, and more.',
                calculators: [
                    { id: 'mortgage', name: 'Mortgage Calculator' },
                    { id: 'amortization', name: 'Amortization Calculator' }
                ]
            },
            {
                id: 'investment',
                name: 'Investment Calculators',
                description: 'Calculate investment returns, growth, and more.',
                calculators: [
                    { id: 'investment', name: 'Investment Calculator' }
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
}

// Export router instance
window.router = new Router(); 