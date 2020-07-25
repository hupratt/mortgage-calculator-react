const defaultPrice = 500000;
const defaultDownPayment = 100000;
const defaultInterestRate = 0.05;
const defaultReturnRate = 0.05;
const defaultHouseAppreciationRate = 0.01;
const defaultMonths = 360;
const defaultTaxRate = 0.0126;
const defaultInsuranceRate = 0.0014;
const defaultMortgageInsuranceRate = 0.011;
const defaultMortgageInsuranceEnabled = true;
const defaultMortgageInsuranceThreshold = 1;
const defaultAdditionalPrincipalPayment = 0;

const calculateMonthlyRate = (rate) => {
  return Math.pow(1 + rate, 1 / 12) - 1;
};
class MortgageCalculator {
  constructor() {
    this.houseAppreciationRate = defaultHouseAppreciationRate;
    this.houseAppreciationRate = defaultHouseAppreciationRate;
    this.totalPrice = defaultPrice;
    this.downPayment = defaultDownPayment;
    this.returnRate = defaultReturnRate;
    this.months = defaultMonths;
    this.taxRate = defaultTaxRate;
    this.insuranceRate = defaultInsuranceRate;
    this.mortgageInsuranceRate = defaultMortgageInsuranceRate;
    this.mortgageInsuranceEnabled = defaultMortgageInsuranceEnabled;
    this.mortgageInsuranceThreshold = defaultMortgageInsuranceThreshold;
    this.additionalPrincipalPayment = defaultAdditionalPrincipalPayment;
  }

  calculatePayment() {
    let loanAmount = this.totalPrice - this.downPayment;
    let paymentSchedule = MortgageCalculator.calculatePaymentSchedule(
      loanAmount,
      this.interestRate,
      this.months,
      this.totalPrice,
      this.houseAppreciationRate,
      this.returnRate,
      this.additionalPrincipalPayment
    );
    let piPayment = paymentSchedule.length
      ? paymentSchedule[0].totalPayment
      : 0;
    let downPaymentPercentage = this.downPayment / this.totalPrice;
    let mortgageInsurance = 0;
    if (
      this.mortgageInsuranceEnabled &&
      downPaymentPercentage < this.mortgageInsuranceThreshold
    ) {
      mortgageInsurance = (loanAmount * this.mortgageInsuranceRate) / 12;
    }

    let propertyTax = (this.totalPrice * this.taxRate) / 12;
    let homeOwnerInsurance = MortgageCalculator.roundPenny(
      (this.totalPrice * this.insuranceRate) / 12
    );
    console.log({
      loanAmount: loanAmount,
      principalAndInterest: piPayment,
      tax: propertyTax,
      insurance: homeOwnerInsurance,
      total: piPayment + propertyTax + homeOwnerInsurance + mortgageInsurance,
      termMonths: this.months,
      paymentSchedule: paymentSchedule,
      mortgageInsurance: mortgageInsurance,
    });
    return {
      loanAmount: loanAmount,
      principalAndInterest: piPayment,
      tax: propertyTax,
      insurance: homeOwnerInsurance,
      total: piPayment + propertyTax + homeOwnerInsurance + mortgageInsurance,
      termMonths: this.months,
      paymentSchedule: paymentSchedule,
      mortgageInsurance: mortgageInsurance,
    };
  }

  static calculatePaymentSchedule(
    loanAmount,
    annualRate,
    termMonths,
    totalPrice,
    houseAppreciationRate,
    returnRate,
    additionalPrincipalPayments = 0
  ) {
    const monthlyRate = calculateMonthlyRate(annualRate);
    const monthlyPayment = MortgageCalculator.calculateMonthlyPIPayment(
      loanAmount,
      annualRate,
      termMonths
    );
    let principal = MortgageCalculator.roundPenny(loanAmount);
    let housePrice = totalPrice;
    let payments = [];
    let totalInterest = 0;
    let totalPayments = 0;
    let i = 0;
    while (principal > 0 && i < termMonths) {
      housePrice = MortgageCalculator.roundPenny(
        housePrice * (1 + calculateMonthlyRate(houseAppreciationRate))
      );
      let interestPayment = MortgageCalculator.roundPenny(
        principal * monthlyRate
      );
      let principalPayment = MortgageCalculator.roundPenny(
        monthlyPayment - interestPayment + additionalPrincipalPayments
      );
      if (principal > principalPayment) {
        principal = MortgageCalculator.roundPenny(principal - principalPayment);
      } else {
        principalPayment = principal;
        principal = 0;
      }
      let totalPayment = interestPayment + principalPayment;
      totalInterest += interestPayment;
      totalPayments += totalPayment;
      payments[i] = {
        count: i + 1,
        interestPayment,
        totalInterest,
        principalPayment,
        totalPayment,
        totalPayments,
        balance: principal,
        housePrice,
        returnRate,
      };
      i++;
    }

    return payments;
  }

  static calculateMonthlyPIPayment(loanAmount, annualRate, termMonths) {
    let monthlyRate = calculateMonthlyRate(annualRate);
    let payment =
      (monthlyRate * loanAmount * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    return this.nextPenny(payment);
  }

  static roundPenny(value) {
    return Math.round(value * 100) / 100;
  }

  static nextPenny(value) {
    return Math.ceil(value * 100) / 100;
  }
}

const _calc = new MortgageCalculator();

module.exports = {
  calculateMonthlyRate,
  createMortgageCalculator: function () {
    return new MortgageCalculator();
  },
  calculatePayment: function (
    houseAppreciationRate = defaultHouseAppreciationRate,
    totalPrice = defaultPrice,
    downPayment = defaultDownPayment,
    interestRate = defaultInterestRate,
    months = defaultMonths,
    taxRate = defaultTaxRate,
    insuranceRate = defaultInsuranceRate,
    mortgageInsuranceRate = defaultMortgageInsuranceRate,
    mortgageInsuranceEnabled = defaultMortgageInsuranceEnabled,
    mortgageInsuranceThreshold = defaultMortgageInsuranceThreshold,
    additionalPrincipalPayment = defaultAdditionalPrincipalPayment
  ) {
    _calc.houseAppreciationRate = houseAppreciationRate;
    _calc.totalPrice = totalPrice;
    _calc.downPayment = downPayment;
    _calc.interestRate = interestRate;
    _calc.months = months;
    _calc.taxRate = taxRate;
    _calc.insuranceRate = insuranceRate;
    _calc.mortgageInsuranceRate = mortgageInsuranceRate;
    _calc.mortgageInsuranceEnabled = mortgageInsuranceEnabled;
    _calc.mortgageInsuranceThreshold = mortgageInsuranceThreshold;
    _calc.additionalPrincipalPayment = additionalPrincipalPayment;
    return _calc.calculatePayment();
  },
  nextPenny: MortgageCalculator.nextPenny,
};
