import Switch from "./Switch";
import Util from "./Util";

import React from "react";
import mortgageJs from "mortgage-js";
import pjson from "../package.json";
import DefaultStyles from "./DefaultStyle.css";
import PaymentSchedule from "./PaymentSchedule";
import InputWrapper from "./InputWrapper";
import IconInput from "./IconInput";

const DefaultPrice = 900000;
const DefaultDownPayment = (DefaultPrice * 20) / 100;
const DefaultInterestRate = 0.045;
const DefaultTermMonths = 360;
const DefaultTaxRate = 0.0125;
const DefaultInsuranceRate = 0.0014;
const DefaultMortgageInsuranceRate = 0.011;
const DefaultDownPaymentPercent = 0.2;
const DefaultAdditionalPrincipalPayment = 0;

const numberOfOptions = 8;

export default class MortgageCalculator extends React.Component {
  mortgageCalculator = mortgageJs.createMortgageCalculator();

  constructor(props) {
    super(props);

    this.mortgageCalculator.totalPrice = Util.numberValueOrDefault(
      props.price,
      0,
      DefaultPrice
    );
    this.mortgageCalculator.downPayment = Util.numberValueOrDefault(
      props.downPayment,
      0,
      DefaultDownPayment
    );
    this.mortgageCalculator.interestRate = Util.numberValueOrDefault(
      props.interestRate,
      0,
      DefaultInterestRate
    );
    this.mortgageCalculator.monthsArr = Util.getValidTermMonths(
      numberOfOptions
    );
    this.mortgageCalculator.months = Util.numberValueInSetOrDefault(
      props.months,
      Util.getValidTermMonths(numberOfOptions),
      DefaultTermMonths
    );
    this.mortgageCalculator.taxRate = Util.numberValueOrDefault(
      props.taxRate,
      0,
      DefaultTaxRate
    );
    this.mortgageCalculator.insuranceRate = Util.numberValueOrDefault(
      props.insuranceRate,
      0,
      DefaultInsuranceRate
    );
    this.mortgageCalculator.mortgageInsuranceRate = Util.numberValueOrDefault(
      props.mortgageInsuranceRate,
      0,
      DefaultMortgageInsuranceRate
    );
    this.mortgageCalculator.mortgageInsuranceEnabled =
      props.mortgageInsuranceEnabled !== false;
    this.mortgageCalculator.additionalPrincipal = Util.numberValueOrDefault(
      props.additionalPrincipalPayment,
      0,
      DefaultAdditionalPrincipalPayment
    );

    this.state = {
      totalPrice: this.mortgageCalculator.totalPrice,
      downPayment: this.mortgageCalculator.downPayment,
      mortgageInsuranceEnabled: this.mortgageCalculator
        .mortgageInsuranceEnabled,
      additionalPrincipal: 0,
      mortgage: this.mortgageCalculator.calculatePayment(),
    };

    this.onPriceChange = this.onPriceChange.bind(this);
    this.onDownPaymentChange = this.onDownPaymentChange.bind(this);
    this.onDownPaymentPercentChange = this.onDownPaymentPercentChange.bind(
      this
    );
    this.onInterestRateChange = this.onInterestRateChange.bind(this);
    this.onTermMonthsChange = this.onTermMonthsChange.bind(this);
    this.onAdditionalPrincipalChange = this.onAdditionalPrincipalChange.bind(
      this
    );
    this.onTaxRateChange = this.onTaxRateChange.bind(this);
    this.onInsuranceRateChange = this.onInsuranceRateChange.bind(this);
    this.onMortgageInsuranceRateChange = this.onMortgageInsuranceRateChange.bind(
      this
    );
    this.onMortgageInsuranceEnabledChange = this.onMortgageInsuranceEnabledChange.bind(
      this
    );
  }

  onMortgageChange(mortgage) {}

  onPriceChange(e) {
    let value = e.target.value;
    if (value.length === 0) {
      this.setState({
        totalPrice: value,
      });
      return;
    }
    value = Util.moneyToValue(value);
    if (isNaN(value)) return;
    this.mortgageCalculator.totalPrice = value;
    let downPaymentPercent =
      this.state.totalPrice > 0
        ? this.state.downPayment / this.state.totalPrice
        : DefaultDownPaymentPercent;
    let downPayment = downPaymentPercent * value;
    this.mortgageCalculator.downPayment = downPayment;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      totalPrice: value,
      downPayment: downPayment,
      mortgage: mortgage,
    });
    this.onMortgageChange(mortgage);
  }

  onDownPaymentChange(e) {
    let value = e.target.value;
    if (value.length === 0) {
      this.setState({
        downPayment: value,
      });
      return;
    }
    value = Util.moneyToValue(value);
    if (isNaN(value)) return;
    this.mortgageCalculator.downPayment = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      downPayment: value,
      mortgage: mortgage,
    });
    this.onMortgageChange(mortgage);
  }

  onDownPaymentPercentChange(e) {
    let value = e.target.value;
    if (value.length === 0) {
      this.setState({
        downPayment: value,
      });
      return;
    }
    if (isNaN(value)) return;
    let downPayment = Math.round((value / 100) * this.state.totalPrice);
    this.mortgageCalculator.downPayment = downPayment;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      downPayment: downPayment,
      mortgage: mortgage,
    });
    this.onMortgageChange(mortgage);
  }

  onInterestRateChange(e) {
    let value = Util.percentToValue(e.target.value);
    if (isNaN(value)) return;
    this.mortgageCalculator.interestRate = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
    this.onMortgageChange(mortgage);
  }

  onTermMonthsChange(e) {
    let value = e.target.value;
    if (isNaN(value)) return;
    this.mortgageCalculator.months = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
    this.onMortgageChange(mortgage);
  }

  onAdditionalPrincipalChange(e) {
    let value = Util.moneyToValue(e.target.value);
    this.mortgageCalculator.additionalPrincipalPayment = !isNaN(value)
      ? value
      : 0;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      additionalPrincipal: value,
      mortgage: mortgage,
    });
    this.onMortgageChange(mortgage);
  }

  onTaxRateChange(e) {
    let value = Util.percentToValue(e.target.value);
    if (isNaN(value)) return;
    this.mortgageCalculator.taxRate = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
    this.onMortgageChange(mortgage);
  }

  onInsuranceRateChange(e) {
    let value = Util.percentToValue(e.target.value);
    if (isNaN(value)) return;
    this.mortgageCalculator.insuranceRate = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
    this.onMortgageChange(mortgage);
  }

  onMortgageInsuranceRateChange(e) {
    let value = Util.percentToValue(e.target.value);
    if (isNaN(value)) return;
    this.mortgageCalculator.mortgageInsuranceRate = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
    this.onMortgageChange(mortgage);
  }

  onMortgageInsuranceEnabledChange(e) {
    this.mortgageCalculator.mortgageInsuranceEnabled = e;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgageInsuranceEnabled: this.mortgageCalculator
        .mortgageInsuranceEnabled,
      mortgage: mortgage,
    });
    this.onMortgageChange(mortgage);
  }

  renderMonths = (months) => {
    let output = [];
    months.map((element, index) => {
      output.push(
        <option key={index} value={element}>
          {element} years
        </option>
      );
    });
    return output;
  };

  render() {
    const {
      totalPrice,
      downPayment,
      showAdvanced,
      additionalPrincipal,
    } = this.state;
    const {
      loanAmount,
      principalAndInterest,
      tax,
      insurance,
      mortgageInsurance,
      total,
    } = this.state.mortgage;
    const {
      interestRate,
      taxRate,
      insuranceRate,
      mortgageInsuranceRate,
      mortgageInsuranceEnabled,
      months,
      monthsArr,
    } = this.mortgageCalculator;
    const styles = this.props.styles || DefaultStyles;
    let paymentCount = this.state.mortgage.paymentSchedule.length;
    let years = Math.floor(paymentCount / 12);
    let remainingMonths = paymentCount % 12;
    let yearsLabel = years === 1 ? "year" : "years";
    let monthsLabel = remainingMonths === 1 ? "month" : "months";
    let separatorLabel = years > 0 && remainingMonths > 0 ? " and " : "";
    let payoffMessage = "";
    if (years > 0) payoffMessage += `${years} ${yearsLabel}`;
    payoffMessage += separatorLabel;
    if (remainingMonths > 0)
      payoffMessage += `${remainingMonths} ${monthsLabel}`;
    if (payoffMessage.length > 0)
      payoffMessage = `Fully paid in ${payoffMessage}`;

    const downPaymentPercent =
      downPayment.length === 0
        ? ""
        : totalPrice > 0 && downPayment > 0
        ? downPayment / totalPrice
        : DefaultDownPaymentPercent;
    // alert(Util.moneyValue(totalPrice, false, false))
    // alert(Util.percentValue(downPaymentPercent, false))
    return (
      <div className={styles.container}>
        <form className={styles.inputForm}>
          <InputWrapper styles={styles} label="Home Price">
            <IconInput
              styles={styles}
              icon="€"
              type="text"
              name="price"
              value={Util.moneyValue(totalPrice, false, false)}
              onChange={this.onPriceChange}
            />
          </InputWrapper>

          <InputWrapper styles={styles} label="Down Payment">
            <IconInput
              styles={styles}
              icon="€"
              type="text"
              name="downPayment"
              value={Util.moneyValue(downPayment, false, false)}
              onChange={this.onDownPaymentChange}
            />
            <IconInput
              styles={styles}
              icon="%"
              type="number"
              name="downPaymentPercent"
              value={Util.percentValue(downPaymentPercent, false)}
              onChange={this.onDownPaymentPercentChange}
            />
          </InputWrapper>

          <InputWrapper styles={styles} label="Interest Rate">
            <IconInput
              styles={styles}
              icon="%"
              type="number"
              name="interestRate"
              defaultValue={Util.percentValue(interestRate, false)}
              step="0.01"
              onInput={this.onInterestRateChange}
            />
          </InputWrapper>

          <InputWrapper styles={styles} label="Loan Term">
            <select
              className="custom-select"
              name="termMonths"
              onInput={this.onTermMonthsChange}
              defaultValue={months}
            >
              {this.renderMonths(monthsArr)}
            </select>
          </InputWrapper>
        </form>

        {this.props.showPaymentSchedule ? (
          <div className={styles.schedule}>
            <h3>Comparison</h3>
            <PaymentSchedule mortgage={this.state.mortgage} />
          </div>
        ) : null}
      </div>
    );
  }
}
