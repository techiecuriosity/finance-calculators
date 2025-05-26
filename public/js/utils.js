// Utility functions for financial calculations
const utils = {
    // Formatting functions
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    formatPercentage: (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    },

    formatNumber: (value, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    },

    // Loan calculations
    calculateMonthlyPayment: (principal, interestRate, years) => {
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = years * 12;
        return principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
               (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    },

    calculateTotalPayment: (monthlyPayment, years) => {
        return monthlyPayment * years * 12;
    },

    calculateTotalInterest: (totalPayment, principal) => {
        return totalPayment - principal;
    },

    // Investment calculations
    calculateCompoundInterest: (principal, rate, years, compoundsPerYear = 12) => {
        const ratePerPeriod = rate / 100 / compoundsPerYear;
        const numberOfPeriods = years * compoundsPerYear;
        return principal * Math.pow(1 + ratePerPeriod, numberOfPeriods);
    },

    calculateFutureValue: (presentValue, rate, years, compoundsPerYear = 12) => {
        return utils.calculateCompoundInterest(presentValue, rate, years, compoundsPerYear);
    },

    calculatePresentValue: (futureValue, rate, years, compoundsPerYear = 12) => {
        const ratePerPeriod = rate / 100 / compoundsPerYear;
        const numberOfPeriods = years * compoundsPerYear;
        return futureValue / Math.pow(1 + ratePerPeriod, numberOfPeriods);
    },

    calculateROI: (initialInvestment, finalValue) => {
        return ((finalValue - initialInvestment) / initialInvestment) * 100;
    },

    calculatePaybackPeriod: (initialInvestment, annualCashFlow) => {
        return initialInvestment / annualCashFlow;
    },

    // Mortgage specific calculations
    calculateDebtToIncomeRatio: (monthlyDebtPayments, monthlyIncome) => {
        return (monthlyDebtPayments / monthlyIncome) * 100;
    },

    calculateLoanToValueRatio: (loanAmount, propertyValue) => {
        return (loanAmount / propertyValue) * 100;
    },

    calculateMortgageInsurance: (loanAmount, ltvRatio) => {
        if (ltvRatio <= 80) return 0;
        if (ltvRatio <= 85) return loanAmount * 0.005;
        if (ltvRatio <= 90) return loanAmount * 0.01;
        if (ltvRatio <= 95) return loanAmount * 0.015;
        return loanAmount * 0.02;
    },

    calculatePropertyTax: (propertyValue, taxRate) => {
        return propertyValue * (taxRate / 100);
    },

    calculateHomeInsurance: (propertyValue, coverageRate = 0.35) => {
        return propertyValue * (coverageRate / 100);
    },

    calculateClosingCosts: (propertyValue, closingCostRate = 2) => {
        return propertyValue * (closingCostRate / 100);
    },

    calculateDownPayment: (propertyValue, downPaymentRate) => {
        return propertyValue * (downPaymentRate / 100);
    },

    calculateLoanAmount: (propertyValue, downPayment) => {
        return propertyValue - downPayment;
    },

    // Monthly payment components
    calculateMonthlyPropertyTax: (annualPropertyTax) => {
        return annualPropertyTax / 12;
    },

    calculateMonthlyHomeInsurance: (annualHomeInsurance) => {
        return annualHomeInsurance / 12;
    },

    calculateMonthlyMortgageInsurance: (annualMortgageInsurance) => {
        return annualMortgageInsurance / 12;
    },

    calculateTotalMonthlyPayment: (monthlyPayment, monthlyPropertyTax, monthlyHomeInsurance, monthlyMortgageInsurance) => {
        return monthlyPayment + monthlyPropertyTax + monthlyHomeInsurance + monthlyMortgageInsurance;
    },

    // Amortization schedule
    calculateAmortizationSchedule: (loanAmount, interestRate, years) => {
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = years * 12;
        const monthlyPayment = utils.calculateMonthlyPayment(loanAmount, interestRate, years);
        
        let balance = loanAmount;
        const schedule = [];

        for (let month = 1; month <= numberOfPayments; month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;

            schedule.push({
                month,
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: Math.max(0, balance)
            });
        }

        return schedule;
    },

    // Early payoff calculations
    calculateEarlyPayoff: (loanAmount, interestRate, years, extraPayment) => {
        const monthlyPayment = utils.calculateMonthlyPayment(loanAmount, interestRate, years);
        const totalPayment = utils.calculateTotalPayment(monthlyPayment, years);
        
        const newMonthlyPayment = monthlyPayment + extraPayment;
        const newNumberOfPayments = Math.ceil(loanAmount / newMonthlyPayment);
        const newTotalPayment = newMonthlyPayment * newNumberOfPayments;
        
        return {
            originalTotalPayment: totalPayment,
            newTotalPayment,
            savings: totalPayment - newTotalPayment,
            monthsSaved: (years * 12) - newNumberOfPayments
        };
    },

    // House affordability
    calculateHouseAffordability: (annualIncome, monthlyDebts, downPaymentRate, interestRate, years, propertyTaxRate, homeInsuranceRate) => {
        const monthlyIncome = annualIncome / 12;
        const maxDebtToIncomeRatio = 43; // Standard maximum DTI ratio
        const maxMonthlyDebt = monthlyIncome * (maxDebtToIncomeRatio / 100);
        const availableForMortgage = maxMonthlyDebt - monthlyDebts;
        
        // Calculate maximum loan amount based on available monthly payment
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = years * 12;
        const maxLoanAmount = availableForMortgage * 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1) / 
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
        
        // Calculate maximum house price based on down payment
        const maxHousePrice = maxLoanAmount / (1 - (downPaymentRate / 100));
        
        return {
            maxHousePrice,
            maxLoanAmount,
            downPayment: maxHousePrice * (downPaymentRate / 100),
            monthlyPayment: availableForMortgage,
            propertyTax: utils.calculatePropertyTax(maxHousePrice, propertyTaxRate),
            homeInsurance: utils.calculateHomeInsurance(maxHousePrice, homeInsuranceRate)
        };
    }
};

// Export utils
window.utils = utils; 