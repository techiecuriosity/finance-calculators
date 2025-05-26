// Calculator categories configuration
window.calculatorCategories = [
    {
        id: 'mortgage',
        name: 'Mortgage Calculators',
        description: 'Calculate mortgage payments, interest, and more.',
        calculators: [
            {
                id: 'mortgage',
                name: 'Mortgage Calculator',
                description: 'Calculate your monthly mortgage payments and total interest.',
                calculator: 'MortgageCalculator'
            },
            {
                id: 'amortization',
                name: 'Amortization Calculator',
                description: 'View your complete loan amortization schedule.',
                calculator: 'AmortizationCalculator'
            },
            { id: 'mortgage-payoff', name: 'Mortgage Payoff Calculator' },
            { id: 'house-affordability', name: 'House Affordability Calculator' },
            { id: 'rent-vs-buy', name: 'Rent vs. Buy Calculator' },
            { id: 'refinance', name: 'Refinance Calculator' }
        ]
    },
    {
        id: 'loan',
        name: 'Loan Calculators',
        description: 'Calculate loan payments, interest, and more.',
        calculators: [
            { id: 'loan', name: 'Loan Calculator' },
            { id: 'auto-loan', name: 'Auto Loan Calculator' },
            { id: 'personal-loan', name: 'Personal Loan Calculator' },
            { id: 'student-loan', name: 'Student Loan Calculator' },
            { id: 'business-loan', name: 'Business Loan Calculator' }
        ]
    },
    {
        id: 'investment',
        name: 'Investment Calculators',
        description: 'Calculate investment returns, growth, and more.',
        calculators: [
            {
                id: 'investment',
                name: 'Investment Calculator',
                description: 'Calculate investment returns and growth over time.',
                calculator: 'InvestmentCalculator'
            },
            { id: 'compound-interest', name: 'Compound Interest Calculator' },
            { id: 'roi', name: 'ROI Calculator' },
            { id: 'retirement', name: 'Retirement Calculator' },
            { id: 'stock-return', name: 'Stock Return Calculator' }
        ]
    },
    {
        id: 'tax',
        name: 'Tax Calculators',
        description: 'Calculate taxes, deductions, and more.',
        calculators: [
            { id: 'income-tax', name: 'Income Tax Calculator' },
            { id: 'sales-tax', name: 'Sales Tax Calculator' },
            { id: 'property-tax', name: 'Property Tax Calculator' },
            { id: 'capital-gains', name: 'Capital Gains Calculator' }
        ]
    },
    {
        id: 'auto',
        name: 'Auto Calculators',
        description: 'Calculate car-related costs and payments.',
        calculators: [
            { id: 'auto-loan', name: 'Auto Loan Calculator' },
            { id: 'car-lease', name: 'Car Lease Calculator' },
            { id: 'car-depreciation', name: 'Car Depreciation Calculator' },
            { id: 'car-fuel-cost', name: 'Car Fuel Cost Calculator' },
            { id: 'car-maintenance', name: 'Car Maintenance Cost Calculator' }
        ]
    }
]; 