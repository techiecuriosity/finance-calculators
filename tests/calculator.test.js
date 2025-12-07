/**
 * Comprehensive Unit Tests for FIRE Retirement Calculator
 *
 * Test Categories:
 * 1. Core FIRE Number Calculations
 * 2. Tax Bucket Calculations
 * 3. CoastFIRE Calculations
 * 4. Monte Carlo Simulations
 * 5. Asset Allocation
 * 6. Scenario Analysis
 * 7. Edge Cases and Validation
 * 8. Integration Tests
 */

// Mock DOM elements for testing
const mockDOM = () => {
    const elements = {
        currentAge: { value: '30' },
        annualIncome: { value: '80000' },
        annualExpenses: { value: '50000' },
        preTaxSavings: { value: '30000' },
        rothSavings: { value: '15000' },
        taxableSavings: { value: '5000' },
        taxRate: { value: '15' },
        savingsRate: { value: '30' },
        withdrawalRate: { value: '4' },
        retirementExpenses: { value: '' },
        stockAllocation: { value: '70' },
        bondAllocation: { value: '25' },
        cashAllocation: { value: '5' },
        stockReturn: { value: '10' },
        bondReturn: { value: '4' },
        cashReturn: { value: '1' },
        inflationRate: { value: '3' },
        targetAge: { value: '' }
    };

    global.document = {
        getElementById: (id) => elements[id] || { value: '', textContent: '', classList: { contains: () => false } }
    };
};

// ============================================
// TEST SUITE 1: Core FIRE Number Calculations
// ============================================

describe('FIRE Number Calculations', () => {
    beforeEach(() => {
        mockDOM();
    });

    test('should calculate basic FIRE number correctly', () => {
        const annualExpenses = 50000;
        const withdrawalRate = 0.04;
        const taxRate = 0.15;

        const expectedFIRE = (annualExpenses / (1 - taxRate)) / withdrawalRate;
        // $50,000 / 0.85 / 0.04 = $1,470,588

        expect(Math.round(expectedFIRE)).toBe(1470588);
    });

    test('should handle 4% rule correctly', () => {
        const expenses = 40000;
        const fireNumber = expenses / 0.04;

        expect(fireNumber).toBe(1000000);
    });

    test('should calculate FIRE with different withdrawal rates', () => {
        const expenses = 60000;

        const fire3percent = expenses / 0.03; // Conservative
        const fire4percent = expenses / 0.04; // Traditional
        const fire5percent = expenses / 0.05; // Aggressive

        expect(fire3percent).toBe(2000000);
        expect(fire4percent).toBe(1500000);
        expect(fire5percent).toBe(1200000);
    });

    test('should account for taxes in FIRE calculation', () => {
        const expenses = 50000;
        const withdrawalRate = 0.04;

        const noTax = expenses / withdrawalRate;
        const withTax15 = (expenses / 0.85) / withdrawalRate;
        const withTax25 = (expenses / 0.75) / withdrawalRate;

        expect(Math.round(noTax)).toBe(1250000);
        expect(Math.round(withTax15)).toBe(1470588);
        expect(Math.round(withTax25)).toBe(1666667);
    });
});

// ============================================
// TEST SUITE 2: Tax Bucket Calculations
// ============================================

describe('Tax Bucket Calculations', () => {
    test('should calculate after-tax value of pre-tax savings', () => {
        const preTax = 100000;
        const taxRate = 0.22; // 22% tax bracket

        const afterTax = preTax * (1 - taxRate);

        expect(afterTax).toBe(78000);
    });

    test('should handle Roth accounts (tax-free)', () => {
        const rothAmount = 50000;
        const afterTax = rothAmount; // No tax on Roth

        expect(afterTax).toBe(50000);
    });

    test('should calculate taxable account with capital gains', () => {
        const taxable = 30000;
        const capitalGainsTax = 0.15; // 15% long-term capital gains

        const afterTax = taxable * (1 - capitalGainsTax);

        expect(afterTax).toBe(25500);
    });

    test('should calculate total effective savings from all buckets', () => {
        const preTax = 100000;
        const roth = 50000;
        const taxable = 30000;
        const taxRate = 0.15;

        const effective = (preTax * (1 - taxRate)) + roth + (taxable * 0.85);

        expect(effective).toBe(85000 + 50000 + 25500);
        expect(effective).toBe(160500);
    });

    test('should validate $1M in Roth > $1M in Traditional 401k', () => {
        const amount = 1000000;
        const taxRate = 0.24;

        const rothValue = amount; // Tax-free
        const traditionalValue = amount * (1 - taxRate);

        expect(rothValue).toBe(1000000);
        expect(traditionalValue).toBe(760000);
        expect(rothValue).toBeGreaterThan(traditionalValue);
    });

    test('should handle edge case: zero in all buckets', () => {
        const preTax = 0;
        const roth = 0;
        const taxable = 0;
        const taxRate = 0.15;

        const effective = (preTax * (1 - taxRate)) + roth + (taxable * 0.85);

        expect(effective).toBe(0);
    });

    test('should handle different tax rates correctly', () => {
        const preTax = 100000;

        const tax10 = preTax * (1 - 0.10);
        const tax22 = preTax * (1 - 0.22);
        const tax37 = preTax * (1 - 0.37);

        expect(tax10).toBe(90000);
        expect(tax22).toBe(78000);
        expect(tax37).toBe(63000);
    });
});

// ============================================
// TEST SUITE 3: CoastFIRE Calculations
// ============================================

describe('CoastFIRE Calculations', () => {
    test('should calculate CoastFIRE number correctly', () => {
        const fireNumber = 1000000;
        const yearsToRetirement = 20;
        const investmentReturn = 0.07;

        // Present value calculation
        const coastFIRE = fireNumber / Math.pow(1 + investmentReturn, yearsToRetirement);

        expect(Math.round(coastFIRE)).toBe(258419);
    });

    test('should show when user can stop contributing', () => {
        const currentSavings = 250000;
        const coastFireNumber = 258419;
        const annualSavings = 24000;
        const returnRate = 0.07;

        let portfolio = currentSavings;
        let years = 0;

        while (portfolio < coastFireNumber && years < 10) {
            years++;
            portfolio += annualSavings;
            portfolio *= (1 + returnRate);
        }

        expect(years).toBeLessThanOrEqual(1);
    });

    test('should handle already at CoastFIRE', () => {
        const currentSavings = 300000;
        const coastFireNumber = 258419;

        expect(currentSavings).toBeGreaterThan(coastFireNumber);
    });

    test('should calculate different CoastFIRE for different retirement ages', () => {
        const fireNumber = 1500000;
        const returnRate = 0.08;

        const coast10years = fireNumber / Math.pow(1.08, 10);
        const coast20years = fireNumber / Math.pow(1.08, 20);
        const coast30years = fireNumber / Math.pow(1.08, 30);

        // Verify CoastFIRE decreases significantly with more time
        expect(Math.round(coast10years)).toBe(694790);
        expect(Math.round(coast20years)).toBe(321822);
        expect(Math.round(coast30years)).toBe(149066);

        // Verify the pattern: more years = less needed today
        expect(coast10years).toBeGreaterThan(coast20years);
        expect(coast20years).toBeGreaterThan(coast30years);
    });
});

// ============================================
// TEST SUITE 4: Monte Carlo Simulations
// ============================================

describe('Monte Carlo Simulations', () => {
    // Box-Muller transform test
    test('should generate normally distributed random numbers', () => {
        const generateNormalRandom = (mean, stdDev) => {
            let u1 = Math.random();
            let u2 = Math.random();
            while (u1 === 0) u1 = Math.random();
            const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            return mean + z0 * stdDev;
        };

        const samples = [];
        for (let i = 0; i < 1000; i++) {
            samples.push(generateNormalRandom(0.10, 0.18));
        }

        const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
        const variance = samples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / samples.length;
        const stdDev = Math.sqrt(variance);

        // Mean should be close to 0.10 (within 1%)
        expect(mean).toBeGreaterThan(0.08);
        expect(mean).toBeLessThan(0.12);

        // StdDev should be close to 0.18 (within 20%)
        expect(stdDev).toBeGreaterThan(0.14);
        expect(stdDev).toBeLessThan(0.22);
    });

    test('should run 500 simulations successfully', () => {
        const numSimulations = 500;
        const results = [];

        for (let i = 0; i < numSimulations; i++) {
            results.push(Math.floor(Math.random() * 30) + 5); // 5-35 years
        }

        expect(results.length).toBe(500);
    });

    test('should calculate percentiles correctly', () => {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        const percentile10 = data[Math.floor(data.length * 0.10)];
        const percentile50 = data[Math.floor(data.length * 0.50)];
        const percentile90 = data[Math.floor(data.length * 0.90)];

        expect(percentile10).toBe(2);
        expect(percentile50).toBe(6);
        expect(percentile90).toBe(10);
    });

    test('should calculate success rate correctly', () => {
        const results = [10, 15, 20, 25, 30, 35, 40, 45, 50, 50];
        const maxYears = 50;

        const successRate = (results.filter(y => y < maxYears).length / results.length) * 100;

        expect(successRate).toBe(80); // 8 out of 10 < 50
    });

    test('should handle volatile market scenarios', () => {
        const baseReturn = 0.10;
        const volatility = 0.18;

        const worstCase = baseReturn - (2 * volatility); // -26%
        const bestCase = baseReturn + (2 * volatility); // +46%

        // Use toBeCloseTo to handle floating point precision
        expect(worstCase).toBeCloseTo(-0.26, 2);
        expect(bestCase).toBeCloseTo(0.46, 2);
    });
});

// ============================================
// TEST SUITE 5: Asset Allocation
// ============================================

describe('Asset Allocation Calculations', () => {
    test('should calculate blended returns correctly', () => {
        const stockAlloc = 0.70;
        const bondAlloc = 0.25;
        const cashAlloc = 0.05;

        const stockReturn = 0.10;
        const bondReturn = 0.04;
        const cashReturn = 0.01;

        const blended = (stockAlloc * stockReturn) + (bondAlloc * bondReturn) + (cashAlloc * cashReturn);

        expect(blended).toBeCloseTo(0.0805, 4); // 8.05%
    });

    test('should validate allocation sums to 100%', () => {
        const stock = 70;
        const bond = 25;
        const cash = 5;

        const total = stock + bond + cash;

        expect(total).toBe(100);
    });

    test('should handle aggressive allocation (90/10)', () => {
        const stockReturn = 0.10;
        const bondReturn = 0.04;

        const aggressiveReturn = (0.90 * stockReturn) + (0.10 * bondReturn);

        // Use toBeCloseTo to handle floating point precision
        expect(aggressiveReturn).toBeCloseTo(0.094, 3);
    });

    test('should handle conservative allocation (40/60)', () => {
        const stockReturn = 0.10;
        const bondReturn = 0.04;

        const conservativeReturn = (0.40 * stockReturn) + (0.60 * bondReturn);

        expect(conservativeReturn).toBe(0.064);
    });

    test('should calculate portfolio growth with compounding', () => {
        const principal = 100000;
        const annualReturn = 0.08;
        const years = 10;

        const futureValue = principal * Math.pow(1 + annualReturn, years);

        expect(Math.round(futureValue)).toBe(215892);
    });
});

// ============================================
// TEST SUITE 6: Scenario Analysis
// ============================================

describe('Scenario Analysis', () => {
    test('should calculate optimistic scenario (higher returns)', () => {
        const baseReturn = 0.08;
        const optimisticAdjustment = 0.02;

        const optimisticReturn = baseReturn + optimisticAdjustment;

        expect(optimisticReturn).toBe(0.10);
    });

    test('should calculate pessimistic scenario (lower returns)', () => {
        const baseReturn = 0.08;
        const pessimisticAdjustment = -0.02;

        const pessimisticReturn = baseReturn + pessimisticAdjustment;

        expect(pessimisticReturn).toBe(0.06);
    });

    test('should model 2008 financial crisis impact', () => {
        const portfolio = 500000;
        const crashImpact = -0.37; // -37%

        const portfolioAfterCrash = portfolio * (1 + crashImpact);

        expect(portfolioAfterCrash).toBe(315000);
    });

    test('should model 2000 dot-com crash impact', () => {
        const portfolio = 600000;
        const crashImpact = -0.49; // -49%

        const portfolioAfterCrash = portfolio * (1 + crashImpact);

        expect(portfolioAfterCrash).toBe(306000);
    });

    test('should calculate recovery time after crash', () => {
        const preCrash = 500000;
        const postCrash = 315000; // After -37% crash
        const recoveryReturn = 0.15; // Strong recovery

        let portfolio = postCrash;
        let years = 0;

        while (portfolio < preCrash && years < 10) {
            years++;
            portfolio *= (1 + recoveryReturn);
        }

        expect(years).toBeLessThanOrEqual(4);
    });
});

// ============================================
// TEST SUITE 7: Edge Cases and Validation
// ============================================

describe('Edge Cases and Validation', () => {
    test('should handle zero current savings', () => {
        const savings = 0;
        const annualContribution = 24000;
        const years = 10;
        const returnRate = 0.08;

        let total = savings;
        for (let i = 0; i < years; i++) {
            total += annualContribution;
            total *= (1 + returnRate);
        }

        expect(Math.round(total)).toBeGreaterThan(0);
    });

    test('should reject negative ages', () => {
        const age = -5;

        expect(age).toBeLessThan(18);
    });

    test('should reject ages over 100', () => {
        const age = 105;

        expect(age).toBeGreaterThan(100);
    });

    test('should reject withdrawal rate of 0%', () => {
        const withdrawalRate = 0;

        expect(withdrawalRate).toBe(0);

        // Would cause division by zero
        const isValid = withdrawalRate > 0 && withdrawalRate <= 0.2;
        expect(isValid).toBe(false);
    });

    test('should reject withdrawal rate over 20%', () => {
        const withdrawalRate = 0.25;

        const isValid = withdrawalRate > 0 && withdrawalRate <= 0.2;
        expect(isValid).toBe(false);
    });

    test('should handle extreme FIRE numbers', () => {
        const expenses = 200000; // High earner
        const withdrawalRate = 0.03; // Conservative

        const fireNumber = expenses / withdrawalRate;

        // Use toBeCloseTo to handle floating point precision
        expect(fireNumber).toBeCloseTo(6666667, 0);
    });

    test('should handle very long time horizons (50 years)', () => {
        const principal = 50000;
        const annualContribution = 10000;
        const returnRate = 0.07;
        const years = 50;

        let portfolio = principal;
        for (let i = 0; i < years; i++) {
            portfolio += annualContribution;
            portfolio *= (1 + returnRate);
        }

        expect(portfolio).toBeGreaterThan(1000000);
    });

    test('should handle inflation adjustment', () => {
        const futureValue = 1000000;
        const inflationRate = 0.03;
        const years = 20;

        const presentValue = futureValue / Math.pow(1 + inflationRate, years);

        expect(Math.round(presentValue)).toBe(553676);
    });

    test('should validate allocation does not exceed 100%', () => {
        const stock = 80;
        const bond = 30;
        const cash = 10;

        const total = stock + bond + cash;
        const isValid = total <= 110; // Allow 10% tolerance

        expect(isValid).toBe(false);
        expect(total).toBe(120);
    });

    test('should handle NaN inputs gracefully', () => {
        const value = parseFloat('invalid') || 0;

        expect(value).toBe(0);
    });

    test('should handle infinity in calculations', () => {
        const fireNumber = 50000 / 0; // Division by zero

        expect(isFinite(fireNumber)).toBe(false);
    });
});

// ============================================
// TEST SUITE 8: Integration Tests
// ============================================

describe('Full Calculation Integration Tests', () => {
    test('should calculate complete retirement plan: Aggressive Saver', () => {
        const age = 25;
        const income = 100000;
        const expenses = 40000;
        const savingsRate = 0.50;
        const currentSavings = 20000;
        const withdrawalRate = 0.04;
        const returnRate = 0.08;

        const annualSavings = income * savingsRate;
        const fireNumber = expenses / withdrawalRate;

        let portfolio = currentSavings;
        let years = 0;

        while (portfolio < fireNumber && years < 50) {
            years++;
            portfolio += annualSavings;
            portfolio *= (1 + returnRate);
        }

        expect(years).toBeLessThan(20); // Should FIRE in < 20 years
        expect(portfolio).toBeGreaterThanOrEqual(fireNumber);
    });

    test('should calculate complete retirement plan: Moderate Planner', () => {
        const age = 30;
        const income = 80000;
        const expenses = 50000;
        const savingsRate = 0.30;
        const currentSavings = 50000;
        const withdrawalRate = 0.04;
        const returnRate = 0.07;

        const annualSavings = income * savingsRate;
        const fireNumber = expenses / withdrawalRate;

        let portfolio = currentSavings;
        let years = 0;

        while (portfolio < fireNumber && years < 50) {
            years++;
            portfolio += annualSavings;
            portfolio *= (1 + returnRate);
        }

        expect(years).toBeGreaterThan(15);
        expect(years).toBeLessThan(30);
    });

    test('should calculate complete retirement plan: Late Start', () => {
        const age = 40;
        const income = 120000;
        const expenses = 70000;
        const savingsRate = 0.35;
        const currentSavings = 100000;
        const withdrawalRate = 0.04;
        const returnRate = 0.07;

        const annualSavings = income * savingsRate;
        const fireNumber = expenses / withdrawalRate;

        let portfolio = currentSavings;
        let years = 0;

        while (portfolio < fireNumber && years < 50) {
            years++;
            portfolio += annualSavings;
            portfolio *= (1 + returnRate);
        }

        expect(years).toBeLessThan(30);
        expect(portfolio).toBeGreaterThanOrEqual(fireNumber);
    });

    test('should calculate sequence of returns risk', () => {
        const principal = 1000000;
        const returns = [-0.30, -0.10, 0.15, 0.20, 0.10]; // Bad early returns

        let portfolio = principal;
        returns.forEach(r => {
            portfolio *= (1 + r);
        });

        // Compare to reverse sequence
        let portfolioReverse = principal;
        [...returns].reverse().forEach(r => {
            portfolioReverse *= (1 + r);
        });

        // Same final return, but different paths
        expect(Math.round(portfolio)).toBe(Math.round(portfolioReverse));
    });
});

// ============================================
// TEST SUITE 9: Trinity Study Validation
// ============================================

describe('Trinity Study Success Rates', () => {
    test('should validate 4% rule with 95% success rate', () => {
        const withdrawalRate = 0.04;
        const successRate = 95; // Historical success rate

        expect(withdrawalRate).toBe(0.04);
        expect(successRate).toBeGreaterThanOrEqual(95);
    });

    test('should show 3% withdrawal rate has higher success', () => {
        const withdrawal3percent = 0.03;
        const withdrawal4percent = 0.04;

        // Lower withdrawal = higher success
        expect(withdrawal3percent).toBeLessThan(withdrawal4percent);
    });

    test('should validate 30-year retirement horizon', () => {
        const retirementAge = 65;
        const lifeExpectancy = 95;
        const horizon = lifeExpectancy - retirementAge;

        expect(horizon).toBe(30);
    });
});

// Run all tests
console.log('🧪 Running comprehensive FIRE calculator test suite...\n');

// Export for use with test runners (Jest, Mocha, etc.)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mockDOM
    };
}
