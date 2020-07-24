import Switch from "./Switch";
import React from "react";
import Util from "./Util";
import mortgageJs from "mortgage-js";
import DefaultStyles from "./DefaultStyle.css";
import PaymentSchedule from "./PaymentSchedule";
import InputWrapper from "./InputWrapper";
import IconInput from "./IconInput";

const DefaultPrice = 800000;
const DefaultInterestRate = 0.01;
const numberOfOptions = 10;
const stepYears = 5;
const DefaultTaxRate = 0.01;
const DefaultInsuranceRate = 0;
const DefaultMortgageInsuranceRate = 0;
const DefaultDownPaymentPercent = 0.2;
const DefaultAdditionalPrincipalPayment = 0;

const DefaultTermMonths = numberOfOptions * 12 * stepYears;
const DefaultDownPayment = (DefaultPrice * 20) / 100;

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
    this.mortgageCalculator.mortgageInsuranceEnabled = false;
    this.mortgageCalculator.insuranceEnabled = false;
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
      showMonthlyPayments: false,
      insuranceEnabled: this.mortgageCalculator.insuranceEnabled,
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
    this.mortgageCalculator.months = parseInt(value) * 12;
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
    let value = e.target ? Util.percentToValue(e.target.value) : "";
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

    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState((prevState) => {
      this.mortgageCalculator.mortgageInsuranceRate = value;
      return {
        ...prevState,
        mortgage: mortgage,
      };
    });
    this.onMortgageChange(mortgage);
  }

  onMortgageInsuranceEnabledChange(e) {
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState((prevState) => {
      this.mortgageCalculator.mortgageInsuranceEnabled = !prevState.mortgageInsuranceEnabled;
      return {
        ...prevState,
        mortgageInsuranceEnabled: !prevState.mortgageInsuranceEnabled,
        mortgage: mortgage,
      };
    });
    this.onMortgageChange(mortgage);
  }
  onInsuranceEnabledChange = (e) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        insuranceEnabled: !prevState.insuranceEnabled,
      };
    });
  };

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
      showMonthlyPayments,
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

    const downPaymentPercent =
      downPayment.length === 0
        ? ""
        : totalPrice > 0 && downPayment > 0
        ? downPayment / totalPrice
        : DefaultDownPaymentPercent;
    // alert(Util.moneyValue(totalPrice, false, false))
    // alert(Util.percentValue(downPaymentPercent, false))
    // alert(Util.percentValue(interestRate, false));
    return (
      <div className={styles.container}>
        <form className={styles.inputForm}>
          <InputWrapper styles={styles} label="Prix du bien">
            <IconInput
              styles={styles}
              icon="€"
              type="text"
              name="price"
              value={Util.moneyValue(totalPrice, false, false)}
              onChange={this.onPriceChange}
            />
          </InputWrapper>

          <InputWrapper styles={styles} label="Acompte">
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
              step="0.01"
              onChange={this.onDownPaymentPercentChange}
            />
          </InputWrapper>

          <InputWrapper styles={styles} label="Taux d'intérêt effectif TAEG">
            <IconInput
              styles={styles}
              icon="%"
              type="number"
              name="interestRate"
              step="0.01"
              defaultValue={Util.percentValue(interestRate, false)}
              onInput={this.onInterestRateChange}
            />
          </InputWrapper>

          <InputWrapper styles={styles} label="Horizon de l'emprunt">
            <select
              className="custom-select"
              name="termMonths"
              onInput={this.onTermMonthsChange}
              defaultValue={months}
            >
              {this.renderMonths(monthsArr)}
            </select>
          </InputWrapper>
          <InputWrapper styles={styles} label="Taxe Foncière">
            <IconInput
              styles={styles}
              icon="%"
              type="number"
              name="taxRate"
              defaultValue={Util.percentValue(taxRate, false)}
              step="0.01"
              onInput={this.onTaxRateChange}
            />
          </InputWrapper>

          <InputWrapper styles={styles} label="Assurance habitation">
            <Switch
              active={this.state.insuranceEnabled}
              onChange={this.onInsuranceEnabledChange}
            />
          </InputWrapper>
          {this.state.insuranceEnabled ? (
            <InputWrapper styles={styles}>
              <IconInput
                styles={styles}
                icon="%"
                type="number"
                name="insuranceRate"
                defaultValue={Util.percentValue(insuranceRate, false)}
                step="0.01"
                onInput={this.onInsuranceRateChange}
              />
            </InputWrapper>
          ) : null}

          <InputWrapper styles={styles} label="Assurance du prêt">
            <Switch
              active={mortgageInsuranceEnabled}
              onChange={this.onMortgageInsuranceEnabledChange}
            />
          </InputWrapper>
          {mortgageInsuranceEnabled ? (
            <InputWrapper styles={styles}>
              <IconInput
                styles={styles}
                icon="%"
                type="number"
                name="mortgageInsuranceRate"
                defaultValue={Util.percentValue(mortgageInsuranceRate, false)}
                step="0.01"
                onInput={this.onMortgageInsuranceRateChange}
              />
            </InputWrapper>
          ) : null}
        </form>
        <div className={styles.results}>
          <div className={styles.resultRow}>
            <div className={styles.resultLabel}>Montant emprunté:</div>
            <div className={styles.resultValue}>
              {Util.moneyValue(loanAmount)}
            </div>
          </div>
          <div className={styles.resultRow}>
            <div className={styles.resultLabel}>
              Principal + Intérêts mensuels:
            </div>
            <div className={styles.resultValue}>
              {Util.moneyValue(principalAndInterest)}
            </div>
          </div>
          <div className={styles.resultRow}>
            <div className={styles.resultLabel}>Taxe foncière mensuelle:</div>
            <div className={styles.resultValue}>{Util.moneyValue(tax)}</div>
          </div>
          {this.state.insuranceEnabled ? (
            <div className={styles.resultRow}>
              <div className={styles.resultLabel}>Assurance habitation:</div>
              <div className={styles.resultValue}>
                {Util.moneyValue(insurance)}
              </div>
            </div>
          ) : null}
          {mortgageInsuranceEnabled ? (
            <div className={styles.resultRow}>
              <div className={styles.resultLabel}>Assurance du prêt:</div>
              <div className={styles.resultValue}>
                {Util.moneyValue(mortgageInsurance)}
              </div>
            </div>
          ) : null}
          <div className={`${styles.resultRow} ${styles.totalPayment}`}>
            <div className={styles.resultLabel}>Coût Total Mensuel:</div>
            <div className={styles.resultValue}>{Util.moneyValue(total)}</div>
          </div>
        </div>

        <div className={styles.advancedButton}>
          <button
            type="button"
            onClick={() =>
              this.setState({ showMonthlyPayments: !showMonthlyPayments })
            }
          >
            {showMonthlyPayments ? "Cacher" : "Afficher"} le détail des
            paiements mensuels
          </button>
        </div>
        {showMonthlyPayments && this.props.showPaymentSchedule ? (
          <div className={styles.schedule}>
            <PaymentSchedule mortgage={this.state.mortgage} />
          </div>
        ) : null}
      </div>
    );
  }
}
