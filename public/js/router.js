// Client-side router
class Router {
    constructor() {
        this.routes = [
            {
                path: '/',
                handler: () => this.loadHomePage()
            },
            {
                path: '/calculators',
                handler: () => this.loadCalculatorsPage()
            },
            {
                path: /^\/calculator\/(.+)$/,
                handler: (match) => this.loadCalculatorPage(match[1])
            },
            {
                path: '/about',
                handler: () => this.loadAboutPage()
            },
            {
                path: '/contact',
                handler: () => this.loadContactPage()
            }
        ];

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname);
        });
    }

    handleRoute(path) {
        // Remove trailing slash
        path = path.replace(/\/$/, '');

        // Find matching route
        const route = this.routes.find(route => {
            if (route.path instanceof RegExp) {
                const match = path.match(route.path);
                if (match) {
                    route.params = match;
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

    loadHomePage() {
        const main = document.querySelector('#app');
        main.innerHTML = `
            <section class="hero">
                <h1>Financial Calculators</h1>
                <p class="lead">Make informed financial decisions with our professional-grade calculators</p>
                <div class="calculator-grid">
                    ${this.generateFeaturedCalculators()}
                </div>
            </section>
        `;
    }

    loadCalculatorsPage() {
        const main = document.querySelector('#app');
        main.innerHTML = `
            <h1>Financial Calculators</h1>
            <div class="calculator-categories">
                ${this.generateCalculatorCategories()}
            </div>
        `;
    }

    loadCalculatorPage(calculatorId) {
        const calculator = window.calculatorCategories
            .flatMap(category => category.calculators)
            .find(calc => calc.id === calculatorId);

        if (!calculator) {
            this.handle404();
            return;
        }

        const CalculatorClass = window.calculators[calculator.calculator];
        if (!CalculatorClass) {
            this.handle404();
            return;
        }

        const calculatorInstance = new CalculatorClass();
        const main = document.querySelector('#app');
        main.innerHTML = `
            <h1>${calculator.name}</h1>
            <p class="lead">${calculator.description}</p>
            <div class="calculator-container">
                <form class="calculator-form" data-calculator="${calculatorId}" data-realtime="true">
                    ${calculatorInstance.getFormHTML()}
                </form>
                <div id="${calculatorId}-results" class="calculator-results"></div>
            </div>
        `;

        // Initialize calculator functionality
        const form = main.querySelector('.calculator-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const results = calculatorInstance.calculate(formData);
            const resultsDiv = document.getElementById(`${calculatorId}-results`);
            resultsDiv.innerHTML = calculatorInstance.getResultsHTML(results);
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }

    loadAboutPage() {
        const main = document.querySelector('#app');
        main.innerHTML = `
            <h1>About Us</h1>
            <p>We provide professional-grade financial calculators to help you make informed decisions about your finances.</p>
        `;
    }

    loadContactPage() {
        const main = document.querySelector('#app');
        main.innerHTML = `
            <h1>Contact Us</h1>
            <p>Have questions or feedback? We'd love to hear from you.</p>
        `;
    }

    handle404() {
        const main = document.querySelector('#app');
        main.innerHTML = `
            <div class="error-page">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" class="btn">Return Home</a>
            </div>
        `;
    }

    generateFeaturedCalculators() {
        const featuredCalculators = [
            { id: 'mortgage', name: 'Mortgage Calculator' },
            { id: 'investment', name: 'Investment Calculator' },
            { id: 'amortization', name: 'Amortization Calculator' }
        ];

        return featuredCalculators.map(calc => `
            <div class="calculator-card">
                <h3>${calc.name}</h3>
                <a href="/calculator/${calc.id}" class="btn">Calculate Now</a>
            </div>
        `).join('');
    }

    generateCalculatorCategories() {
        return window.calculatorCategories.map(category => `
            <div class="category-section">
                <h2>${category.name}</h2>
                <p>${category.description}</p>
                <div class="calculator-grid">
                    ${category.calculators.map(calc => `
                        <div class="calculator-card">
                            <h3>${calc.name}</h3>
                            <p>${calc.description}</p>
                            <a href="/calculator/${calc.id}" class="btn">Calculate Now</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
}

// Export router instance
window.router = new Router(); 