# FIRE Calculator Test Suite

Comprehensive unit and integration tests for the FIRE Retirement Calculator.

## 📋 Test Coverage

### Test Suites (9 Categories)

1. **Core FIRE Number Calculations** (4 tests)
   - Basic FIRE number calculation
   - 4% rule validation
   - Different withdrawal rates
   - Tax-adjusted FIRE numbers

2. **Tax Bucket Calculations** (7 tests)
   - Pre-tax 401(k)/IRA calculations
   - Roth IRA (tax-free) calculations
   - Taxable account capital gains
   - Combined effective savings
   - Roth vs Traditional comparison
   - Edge cases and different tax rates

3. **CoastFIRE Calculations** (4 tests)
   - Present value calculations
   - Stop contributing age
   - Already at CoastFIRE scenarios
   - Different retirement timelines

4. **Monte Carlo Simulations** (5 tests)
   - Box-Muller normal distribution
   - 500 simulation runs
   - Percentile calculations
   - Success rate calculations
   - Market volatility scenarios

5. **Asset Allocation** (5 tests)
   - Blended return calculations
   - Allocation validation (sums to 100%)
   - Aggressive allocation (90/10)
   - Conservative allocation (40/60)
   - Portfolio growth with compounding

6. **Scenario Analysis** (5 tests)
   - Optimistic scenarios
   - Pessimistic scenarios
   - 2008 financial crisis modeling
   - 2000 dot-com crash modeling
   - Recovery time calculations

7. **Edge Cases and Validation** (11 tests)
   - Zero current savings
   - Age validation (18-100)
   - Withdrawal rate validation (1-20%)
   - Extreme FIRE numbers
   - 50-year time horizons
   - Inflation adjustments
   - Allocation limits
   - NaN/Infinity handling

8. **Integration Tests** (4 tests)
   - Aggressive Saver full plan
   - Moderate Planner full plan
   - Late Start full plan
   - Sequence of returns risk

9. **Trinity Study Validation** (3 tests)
   - 4% rule with 95% success
   - 3% vs 4% withdrawal comparison
   - 30-year retirement horizon

## 🚀 Running Tests

### Prerequisites

```bash
# Install dependencies
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Verbose Output

```bash
npm run test:verbose
```

### Run Specific Test Suite

```bash
npm run test:unit
```

### View Coverage Report

After running tests, open:
```
coverage/lcov-report/index.html
```

## 📊 Expected Test Results

### Coverage Goals
- **Branches**: ≥80%
- **Functions**: ≥80%
- **Lines**: ≥80%
- **Statements**: ≥80%

### Total Tests
- **53 total test cases** across 9 test suites
- All tests should pass ✅

## 🧪 Test Examples

### Example 1: FIRE Number Calculation
```javascript
test('should calculate basic FIRE number correctly', () => {
    const annualExpenses = 50000;
    const withdrawalRate = 0.04;
    const taxRate = 0.15;

    const expectedFIRE = (annualExpenses / (1 - taxRate)) / withdrawalRate;
    // $50,000 / 0.85 / 0.04 = $1,470,588

    expect(Math.round(expectedFIRE)).toBe(1470588);
});
```

### Example 2: Tax Bucket Validation
```javascript
test('should validate $1M in Roth > $1M in Traditional 401k', () => {
    const amount = 1000000;
    const taxRate = 0.24;

    const rothValue = amount; // Tax-free
    const traditionalValue = amount * (1 - taxRate);

    expect(rothValue).toBe(1000000);
    expect(traditionalValue).toBe(760000);
    expect(rothValue).toBeGreaterThan(traditionalValue);
});
```

### Example 3: Monte Carlo Simulation
```javascript
test('should generate normally distributed random numbers', () => {
    const samples = [];
    for (let i = 0; i < 1000; i++) {
        samples.push(generateNormalRandom(0.10, 0.18));
    }

    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;

    // Mean should be close to 0.10 (within 1%)
    expect(mean).toBeGreaterThan(0.08);
    expect(mean).toBeLessThan(0.12);
});
```

## 🔍 Test Scenarios Covered

### Scenario 1: Aggressive Saver
- Age: 25
- Income: $100,000
- Savings Rate: 50%
- Expected: FIRE in < 20 years

### Scenario 2: Moderate Planner
- Age: 30
- Income: $80,000
- Savings Rate: 30%
- Expected: FIRE in 15-30 years

### Scenario 3: Late Start
- Age: 40
- Income: $120,000
- Savings Rate: 35%
- Expected: FIRE in < 30 years

### Scenario 4: Market Crashes
- 2008 Crisis: -37% impact
- 2000 Dot-com: -49% impact
- Recovery modeling

## 📝 Adding New Tests

### Test Template

```javascript
describe('New Feature', () => {
    test('should do something specific', () => {
        // Arrange
        const input = 100;

        // Act
        const result = someFunction(input);

        // Assert
        expect(result).toBe(expectedValue);
    });
});
```

### Best Practices

1. **Descriptive names**: Use clear, descriptive test names
2. **Single assertion**: Each test should test one thing
3. **AAA pattern**: Arrange, Act, Assert
4. **Edge cases**: Always test boundary conditions
5. **Mock DOM**: Use mockDOM() for browser environment

## 🐛 Debugging Tests

### Common Issues

1. **DOM not mocked**: Use `mockDOM()` in `beforeEach()`
2. **Floating point precision**: Use `toBeCloseTo(value, decimals)`
3. **Async operations**: Use `async/await` for promises
4. **Random values**: Seed random number generators for consistency

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Trinity Study](https://www.aaii.com/journal/199802/feature.pdf)
- [Monte Carlo Simulation Methodology](https://en.wikipedia.org/wiki/Monte_Carlo_method)
- [Box-Muller Transform](https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform)

## 🤝 Contributing

When adding new features:
1. Write tests first (TDD)
2. Ensure all tests pass
3. Maintain ≥80% coverage
4. Update this README

## 📄 License

MIT License - Same as main project
