// Calculator implementations

// Base calculator class
class Calculator {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.utils = window.utils;
    }
    
    getFormHTML() {
        return '';
    }
    
    getResultsHTML(results) {
        return '';
    }
    
    calculate(formData) {
        return {};
    }

    formatCurrency(amount) {
        return this.utils.formatCurrency(amount);
    }

    formatPercentage(value) {
        return this.utils.formatPercentage(value);
    }

    formatNumber(value, decimals = 2) {
        return this.utils.formatNumber(value, decimals);
    }
}

// Mortgage calculator
class MortgageCalculator extends Calculator {
    constructor() {
        super(
            'mortgage',
            'Mortgage Calculator',
            'Calculate your monthly mortgage payments and total interest.'
        );
    }
    
    getFormHTML() {
        return `
            <div class="form-group">
                <label for="propertyValue" class="form-label">Property Value ($)</label>
                <input type="number" id="propertyValue" name="propertyValue" class="form-input calculator-input" required>
            </div>
            
            <div class="form-group">
                <label for="downPayment" class="form-label">Down Payment ($)</label>
                <input type="number" id="downPayment" name="downPayment" class="form-input calculator-input" required>
            </div>
            
            <div class="form-group">
                <label for="interestRate" class="form-label">Interest Rate (%)</label>
                <input type="number" id="interestRate" name="interestRate" class="form-input calculator-input" step="0.01" required>
            </div>
            
            <div class="form-group">
                <label for="loanTerm" class="form-label">Loan Term (years)</label>
                <input type="number" id="loanTerm" name="loanTerm" class="form-input calculator-input" required>
            </div>
            
            <div class="form-group">
                <label for="propertyTaxRate" class="form-label">Property Tax Rate (%)</label>
                <input type="number" id="propertyTaxRate" name="propertyTaxRate" class="form-input calculator-input" step="0.01" value="1.2">
            </div>
            
            <div class="form-group">
                <label for="homeInsuranceRate" class="form-label">Home Insurance Rate (%)</label>
                <input type="number" id="homeInsuranceRate" name="homeInsuranceRate" class="form-input calculator-input" step="0.01" value="0.35">
            </div>
            
            <button type="submit" class="btn btn-primary">Calculate</button>
        `;
    }
    
    getResultsHTML(results) {
        return `
            <h3>Results</h3>
            <div class="result-item">
                <span>Monthly Payment:</span>
                <span>${this.formatCurrency(results.monthlyPayment)}</span>
            </div>
            <div class="result-item">
                <span>Total Payment:</span>
                <span>${this.formatCurrency(results.totalPayment)}</span>
            </div>
            <div class="result-item">
                <span>Total Interest:</span>
                <span>${this.formatCurrency(results.totalInterest)}</span>
            </div>
            <div class="result-item">
                <span>Monthly Property Tax:</span>
                <span>${this.formatCurrency(results.monthlyPropertyTax)}</span>
            </div>
            <div class="result-item">
                <span>Monthly Home Insurance:</span>
                <span>${this.formatCurrency(results.monthlyHomeInsurance)}</span>
            </div>
            <div class="result-item">
                <span>Monthly PMI:</span>
                <span>${this.formatCurrency(results.monthlyPMI)}</span>
            </div>
            <div class="result-item">
                <span>Total Monthly Payment:</span>
                <span>${this.formatCurrency(results.totalMonthlyPayment)}</span>
            </div>
            <div class="result-item">
                <span>Loan-to-Value Ratio:</span>
                <span>${this.formatPercentage(results.ltvRatio)}</span>
            </div>
        `;
    }
    
    calculate(formData) {
        const propertyValue = parseFloat(formData.get('propertyValue'));
        const downPayment = parseFloat(formData.get('downPayment'));
        const interestRate = parseFloat(formData.get('interestRate'));
        const loanTerm = parseFloat(formData.get('loanTerm'));
        const propertyTaxRate = parseFloat(formData.get('propertyTaxRate'));
        const homeInsuranceRate = parseFloat(formData.get('homeInsuranceRate'));

        const loanAmount = this.utils.calculateLoanAmount(propertyValue, downPayment);
        const monthlyPayment = this.utils.calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
        const totalPayment = this.utils.calculateTotalPayment(monthlyPayment, loanTerm);
        const totalInterest = this.utils.calculateTotalInterest(totalPayment, loanAmount);

        const annualPropertyTax = this.utils.calculatePropertyTax(propertyValue, propertyTaxRate);
        const annualHomeInsurance = this.utils.calculateHomeInsurance(propertyValue, homeInsuranceRate);
        const monthlyPropertyTax = this.utils.calculateMonthlyPropertyTax(annualPropertyTax);
        const monthlyHomeInsurance = this.utils.calculateMonthlyHomeInsurance(annualHomeInsurance);

        const ltvRatio = this.utils.calculateLoanToValueRatio(loanAmount, propertyValue);
        const annualMortgageInsurance = this.utils.calculateMortgageInsurance(loanAmount, ltvRatio);
        const monthlyMortgageInsurance = this.utils.calculateMonthlyMortgageInsurance(annualMortgageInsurance);

        const totalMonthlyPayment = this.utils.calculateTotalMonthlyPayment(
            monthlyPayment,
            monthlyPropertyTax,
            monthlyHomeInsurance,
            monthlyMortgageInsurance
        );

        return {
            loanAmount: this.formatCurrency(loanAmount),
            monthlyPayment: this.formatCurrency(monthlyPayment),
            totalPayment: this.formatCurrency(totalPayment),
            totalInterest: this.formatCurrency(totalInterest),
            monthlyPropertyTax: this.formatCurrency(monthlyPropertyTax),
            monthlyHomeInsurance: this.formatCurrency(monthlyHomeInsurance),
            monthlyMortgageInsurance: this.formatCurrency(monthlyMortgageInsurance),
            totalMonthlyPayment: this.formatCurrency(totalMonthlyPayment),
            ltvRatio: this.formatPercentage(ltvRatio)
        };
    }
}

// Amortization calculator
class AmortizationCalculator extends Calculator {
    constructor() {
        super(
            'amortization',
            'Amortization Calculator',
            'Calculate your loan amortization schedule.'
        );
    }
    
    getFormHTML() {
        return `
            <div class="form-group">
                <label for="loanAmount" class="form-label">Loan Amount ($)</label>
                <input type="number" id="loanAmount" name="loanAmount" class="form-input calculator-input" required>
            </div>
            
            <div class="form-group">
                <label for="interestRate" class="form-label">Interest Rate (%)</label>
                <input type="number" id="interestRate" name="interestRate" class="form-input calculator-input" step="0.01" required>
            </div>
            
            <div class="form-group">
                <label for="loanTerm" class="form-label">Loan Term (years)</label>
                <input type="number" id="loanTerm" name="loanTerm" class="form-input calculator-input" required>
            </div>
            
            <button type="submit" class="btn btn-primary">Calculate</button>
        `;
    }
    
    getResultsHTML(results) {
        let scheduleHTML = `
            <h3>Amortization Schedule</h3>
            <div class="schedule-table">
                <table>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Payment</th>
                            <th>Principal</th>
                            <th>Interest</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        results.schedule.forEach(entry => {
            scheduleHTML += `
                <tr>
                    <td>${entry.month}</td>
                    <td>${this.formatCurrency(entry.payment)}</td>
                    <td>${this.formatCurrency(entry.principal)}</td>
                    <td>${this.formatCurrency(entry.interest)}</td>
                    <td>${this.formatCurrency(entry.balance)}</td>
                </tr>
            `;
        });
        
        scheduleHTML += `
                    </tbody>
                </table>
            </div>
            
            <div class="summary">
                <div class="result-item">
                    <span>Total Payment:</span>
                    <span>${this.formatCurrency(results.totalPayment)}</span>
                </div>
                <div class="result-item">
                    <span>Total Interest:</span>
                    <span>${this.formatCurrency(results.totalInterest)}</span>
                </div>
            </div>
        `;
        
        return scheduleHTML;
    }
    
    calculate(formData) {
        const loanAmount = parseFloat(formData.get('loanAmount'));
        const interestRate = parseFloat(formData.get('interestRate'));
        const loanTerm = parseFloat(formData.get('loanTerm'));
        
        const schedule = this.utils.calculateAmortizationSchedule(loanAmount, interestRate, loanTerm);
        const monthlyPayment = schedule[0].payment;
        const totalPayment = this.utils.calculateTotalPayment(monthlyPayment, loanTerm);
        const totalInterest = this.utils.calculateTotalInterest(totalPayment, loanAmount);
        
        return {
            monthlyPayment: this.formatCurrency(monthlyPayment),
            totalPayment: this.formatCurrency(totalPayment),
            totalInterest: this.formatCurrency(totalInterest),
            schedule: schedule.map(entry => ({
                month: entry.month,
                payment: this.formatCurrency(entry.payment),
                principal: this.formatCurrency(entry.principal),
                interest: this.formatCurrency(entry.interest),
                balance: this.formatCurrency(entry.balance)
            }))
        };
    }
}

// Investment calculator
class InvestmentCalculator extends Calculator {
    constructor() {
        super(
            'investment',
            'Investment Calculator',
            'Calculate investment returns and growth over time.'
        );
    }
    
    getFormHTML() {
        return `
            <div class="form-group">
                <label for="initialInvestment" class="form-label">Initial Investment ($)</label>
                <input type="number" id="initialInvestment" name="initialInvestment" class="form-input calculator-input" required>
            </div>
            
            <div class="form-group">
                <label for="monthlyContribution" class="form-label">Monthly Contribution ($)</label>
                <input type="number" id="monthlyContribution" name="monthlyContribution" class="form-input calculator-input" value="0">
            </div>
            
            <div class="form-group">
                <label for="interestRate" class="form-label">Expected Annual Return (%)</label>
                <input type="number" id="interestRate" name="interestRate" class="form-input calculator-input" step="0.01" required>
            </div>
            
            <div class="form-group">
                <label for="years" class="form-label">Investment Period (years)</label>
                <input type="number" id="years" name="years" class="form-input calculator-input" required>
            </div>
            
            <button type="submit" class="btn btn-primary">Calculate</button>
        `;
    }
    
    getResultsHTML(results) {
        return `
            <h3>Results</h3>
            <div class="result-item">
                <span>Final Balance:</span>
                <span>${this.formatCurrency(results.futureValue)}</span>
            </div>
            <div class="result-item">
                <span>Total Contributions:</span>
                <span>${this.formatCurrency(results.totalContributions)}</span>
            </div>
            <div class="result-item">
                <span>Total Interest:</span>
                <span>${this.formatCurrency(results.interestEarned)}</span>
            </div>
            <div class="result-item">
                <span>Return on Investment:</span>
                <span>${this.formatPercentage(results.roi)}</span>
            </div>
        `;
    }
    
    calculate(formData) {
        const initialInvestment = parseFloat(formData.get('initialInvestment'));
        const monthlyContribution = parseFloat(formData.get('monthlyContribution'));
        const interestRate = parseFloat(formData.get('interestRate'));
        const years = parseFloat(formData.get('years'));
        
        const futureValue = this.calculateFutureValue(initialInvestment, monthlyContribution, interestRate, years);
        const totalContributions = initialInvestment + (monthlyContribution * 12 * years);
        const interestEarned = futureValue - totalContributions;
        const roi = this.utils.calculateROI(totalContributions, futureValue);
        
        return {
            futureValue: this.formatCurrency(futureValue),
            totalContributions: this.formatCurrency(totalContributions),
            interestEarned: this.formatCurrency(interestEarned),
            roi: this.formatPercentage(roi)
        };
    }

    calculateFutureValue(initialInvestment, monthlyContribution, interestRate, years) {
        const monthlyRate = interestRate / 100 / 12;
        const numberOfMonths = years * 12;
        
        let futureValue = initialInvestment * Math.pow(1 + monthlyRate, numberOfMonths);
        
        if (monthlyContribution > 0) {
            futureValue += monthlyContribution * 
                ((Math.pow(1 + monthlyRate, numberOfMonths) - 1) / monthlyRate);
        }
        
        return futureValue;
    }
}

// Export calculators
window.calculators = {
    MortgageCalculator,
    AmortizationCalculator,
    InvestmentCalculator
}; 