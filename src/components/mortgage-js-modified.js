const defaultPrice = 500000;
const defaultNotaryFee = 33000;
const defaultYearlyMaintenanceFee = 1000;
const defaultMonthlyRent = 500;
const defaultDownPayment = 100000;
const defaultInterestRate = 0.05;
const defaultTransactionFeeRate = 0.003;
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
    this.interestRate = defaultInterestRate;
    this.notaryFee = defaultNotaryFee;
    this.yearlyMaintenanceFee = defaultYearlyMaintenanceFee;
    this.houseAppreciationRate = defaultHouseAppreciationRate;
    this.transactionFeeRate = defaultTransactionFeeRate;
    this.monthlyRent = defaultMonthlyRent;
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
    let mortgageInsurance = 0;
    if (this.mortgageInsuranceEnabled) {
      mortgageInsurance = (loanAmount * this.mortgageInsuranceRate) / 12;
    }
    let propertyTax = (this.totalPrice * this.taxRate) / 12;
    let homeOwnerInsurance = MortgageCalculator.roundPenny(
      (this.totalPrice * this.insuranceRate) / 12
    );
    const monthlyMaintenanceFee = this.yearlyMaintenanceFee / 12;

    let paymentSchedule = MortgageCalculator.calculatePaymentSchedule(
      loanAmount,
      this.interestRate,
      this.months,
      this.totalPrice,
      this.houseAppreciationRate,
      this.returnRate,
      this.transactionFeeRate,
      this.monthlyRent,
      this.notaryFee,
      monthlyMaintenanceFee,
      mortgageInsurance,
      propertyTax,
      homeOwnerInsurance,
      this.downPayment,
      this.additionalPrincipalPayment
    );
    let piPayment = paymentSchedule.length
      ? paymentSchedule[0].totalPayment
      : 0;
    return {
      loanAmount,
      principalAndInterest: piPayment,
      tax: propertyTax,
      insurance: homeOwnerInsurance,
      total: piPayment + propertyTax + homeOwnerInsurance + mortgageInsurance,
      termMonths: this.months,
      paymentSchedule,
      mortgageInsurance,
    };
  }

  static calculatePaymentSchedule(
    loanAmount,
    annualRate,
    termMonths,
    totalPrice,
    houseAppreciationRate,
    returnRate,
    transactionFeeRate,
    monthlyRent,
    notaryFee,
    monthlyMaintenanceFee,
    mortgageInsurance,
    propertyTax,
    homeOwnerInsurance,
    downPayment,
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
    let valueOption2 = 0;
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

      let costOption1 =
        interestPayment +
        principalPayment +
        mortgageInsurance +
        propertyTax +
        homeOwnerInsurance +
        monthlyMaintenanceFee;
      if (i === 0) {
        costOption1 += downPayment;
        costOption1 += notaryFee;
      }

      const costOption2 = monthlyRent + costOption1 * transactionFeeRate;
      const monthlyETFreturnRate = 1 + calculateMonthlyRate(returnRate);
      const valueInvestedInETF =
        (costOption1 - costOption2) * monthlyETFreturnRate;

      if (i !== 0) {
        valueOption2 += valueInvestedInETF;
      } else {
        console.log(
          "Rendement mensuel de lETF",
          1 + calculateMonthlyRate(returnRate)
        );
        console.log("Valeur investie dans lETF année 1", valueInvestedInETF);
        console.log("Coût en année 1 de la première option", costOption1);
        console.log("Coût en année 1 de la deuxième option", costOption2);
        valueOption2 = valueInvestedInETF;
      }
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
        costOption1,
        costOption2,
        valueOption2,
        monthlyETFreturnRate,
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
  createMortgageCalculator: () => new MortgageCalculator(),
  calculatePayment: () => _calc.calculatePayment(),
  nextPenny: MortgageCalculator.nextPenny,
};
