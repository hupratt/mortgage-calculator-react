import Switch from "./Switch";
import React from "react";
import Util from "./Util";
import mortgageJs, { calculateMonthlyRate } from "./mortgage-js-modified";
import DefaultStyles from "./DefaultStyle.css";
import PaymentSchedule from "./PaymentSchedule";
import InputWrapper from "./InputWrapper";
import IconInput from "./IconInput";

const numberOfOptions = 10;
const stepYears = 5;

const DefaultPrice = 800000;
const DefaultNotaryFee = 30000;
const DefaultYearlyMaintenanceFee = 1000;
const DefaultInterestRate = 0.01;
const DefaultReturnRate = 0.085;
const DefaultMonthlyRent = 900;
const DefaultTransactionFeeRate = 0.003;
const DefaultYearlyAppreciationRate = 0.03;
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
    this.mortgageCalculator.transactionFeeRate = Util.numberValueOrDefault(
      props.transactionFeeRate,
      0,
      DefaultTransactionFeeRate
    );
    this.mortgageCalculator.yearlyMaintenanceFee = Util.numberValueOrDefault(
      props.yearlyMaintenanceFee,
      0,
      DefaultYearlyMaintenanceFee
    );
    this.mortgageCalculator.monthlyRent = Util.numberValueOrDefault(
      props.monthlyRent,
      0,
      DefaultMonthlyRent
    );
    this.mortgageCalculator.notaryFee = Util.numberValueOrDefault(
      props.notaryFee,
      0,
      DefaultNotaryFee
    );
    this.mortgageCalculator.returnRate = Util.numberValueOrDefault(
      props.returnRate,
      0,
      DefaultReturnRate
    );
    this.mortgageCalculator.yearlyAppreciationRate = Util.numberValueOrDefault(
      props.yearlyAppreciationRate,
      0,
      DefaultYearlyAppreciationRate
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
  }

  onPriceChange = (e) => {
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
  };

  onDownPaymentChange = (e) => {
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
  };

  onDownPaymentPercentChange = (e) => {
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
  };

  onInterestRateChange = (e) => {
    let value = Util.percentToValue(e.target.value);
    if (isNaN(value)) return;
    this.mortgageCalculator.interestRate = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
  };

  onReturnRateChange = (e) => {
    let value = Util.percentToValue(e.target.value);
    if (isNaN(value)) return;
    this.mortgageCalculator.returnRate = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
  };

  onYearlyAppreciationRate = (e) => {
    let value = Util.percentToValue(e.target.value);
    console.log("value", value);
    if (isNaN(value)) return;
    this.mortgageCalculator.houseAppreciationRate = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
  };

  onTermMonthsChange = (e) => {
    let value = e.target.value;
    if (isNaN(value)) return;
    this.mortgageCalculator.months = parseInt(value) * 12;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
  };

  onAdditionalPrincipalChange = (e) => {
    let value = Util.moneyToValue(e.target.value);
    this.mortgageCalculator.additionalPrincipalPayment = !isNaN(value)
      ? value
      : 0;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      additionalPrincipal: value,
      mortgage: mortgage,
    });
  };

  onTaxRateChange = (e) => {
    let value = Util.percentToValue(e.target.value);
    if (isNaN(value)) return;
    this.mortgageCalculator.taxRate = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
  };
  onTransactionFeeChange = (e) => {
    let value = Util.percentToValue(e.target.value);
    if (isNaN(value)) return;
    this.mortgageCalculator.transactionFeeRate = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
  };
  onRentChange = (e) => {
    let value = Util.moneyToValue(e.target.value);
    if (isNaN(value)) return;
    this.mortgageCalculator.monthlyRent = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
  };
  onNotaryFeeChange = (e) => {
    let value = Util.moneyToValue(e.target.value);
    if (isNaN(value)) return;
    this.mortgageCalculator.notaryFee = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
  };
  onYearlyMaintenanceFeeChange = (e) => {
    let value = Util.moneyToValue(e.target.value);
    if (isNaN(value)) return;
    this.mortgageCalculator.yearlyMaintenanceFee = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
  };

  onInsuranceRateChange = (e) => {
    let value = e.target ? Util.percentToValue(e.target.value) : "";
    if (isNaN(value)) return;
    this.mortgageCalculator.insuranceRate = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState({
      mortgage: mortgage,
    });
  };

  onMortgageInsuranceRateChange = (e) => {
    let value = Util.percentToValue(e.target.value);
    if (isNaN(value)) return;

    this.mortgageCalculator.mortgageInsuranceRate = value;
    let mortgage = this.mortgageCalculator.calculatePayment();
    this.setState((prevState) => {
      return {
        ...prevState,
        mortgage: mortgage,
      };
    });
  };

  onMortgageInsuranceEnabledChange = (e) => {
    let mortgage;
    this.setState((prevState) => {
      this.mortgageCalculator.mortgageInsuranceEnabled = !prevState.mortgageInsuranceEnabled;
      mortgage = this.mortgageCalculator.calculatePayment();
      return {
        ...prevState,
        mortgageInsuranceEnabled: !prevState.mortgageInsuranceEnabled,
        mortgage: mortgage,
      };
    });
  };
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
          {element} ans
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
      yearlyAppreciationRate,
      returnRate,
      transactionFeeRate,
      monthlyRent,
      notaryFee,
      yearlyMaintenanceFee,
    } = this.mortgageCalculator;
    const styles = this.props.styles || DefaultStyles;
    const downPaymentPercent =
      downPayment.length === 0
        ? ""
        : totalPrice > 0 && downPayment > 0
        ? downPayment / totalPrice
        : DefaultDownPaymentPercent;
    return (
      <React.Fragment>
        <div className="container">
          <div className="grid">
            <div id="west" className="column">
              <div className="content">
                <h2>Acheter un bien</h2>
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
                  <InputWrapper styles={styles} label="TAEG">
                    <IconInput
                      data-tip="Taux d'intérêt effectif annuel TAEG: comprend le taux d’intérêt, l’assurance, et les frais éventuels liés au crédit tels que les frais de dossier"
                      styles={styles}
                      icon="%"
                      type="number"
                      name="interestRate"
                      step="0.01"
                      defaultValue={Util.percentValue(interestRate, false)}
                      onInput={this.onInterestRateChange}
                    />
                  </InputWrapper>
                  <InputWrapper styles={styles} label="Appréciation du bien">
                    <IconInput
                      data-tip="Taux d'appréciation annuel du bien"
                      styles={styles}
                      icon="%"
                      type="number"
                      name="yearlyAppreciationRate"
                      step="0.01"
                      defaultValue={Util.percentValue(
                        yearlyAppreciationRate,
                        false
                      )}
                      onInput={this.onYearlyAppreciationRate}
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
                  <InputWrapper styles={styles} label="Frais de notaire">
                    <IconInput
                      styles={styles}
                      icon="€"
                      type="number"
                      name="notaryFee"
                      defaultValue={parseInt(notaryFee)}
                      step="1"
                      onInput={this.onNotaryFeeChange}
                    />
                  </InputWrapper>
                  <InputWrapper styles={styles} label="Frais de maintenance">
                    <IconInput
                      styles={styles}
                      icon="€"
                      data-tip="Frais de maintenance de du bien immobilier"
                      type="number"
                      name="maintenanceFee"
                      defaultValue={parseInt(yearlyMaintenanceFee)}
                      step="1"
                      onInput={this.onYearlyMaintenanceFeeChange}
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
                        defaultValue={Util.percentValue(
                          mortgageInsuranceRate,
                          false
                        )}
                        step="0.01"
                        onInput={this.onMortgageInsuranceRateChange}
                      />
                    </InputWrapper>
                  ) : null}
                </form>
              </div>
            </div>
            <div id="east" className="column">
              <div className="content">
                <h2>Louer & Investir dans un ETF</h2>
                <form className={styles.inputForm}>
                  <InputWrapper styles={styles} label="Rendement ETF">
                    <IconInput
                      styles={styles}
                      icon="%"
                      data-tip="Rendement annuel de l'ETF ou autre instrument financier"
                      type="number"
                      name="returnRate"
                      defaultValue={Util.percentValue(returnRate, false)}
                      step="0.01"
                      onInput={this.onReturnRateChange}
                    />
                  </InputWrapper>
                  <InputWrapper
                    styles={styles}
                    label="Frais de transaction ETF"
                  >
                    <IconInput
                      styles={styles}
                      icon="%"
                      data-tip="Frais de transaction lié à l'ETF"
                      type="number"
                      name="transactionFeeRate"
                      defaultValue={Util.percentValue(
                        transactionFeeRate,
                        false
                      )}
                      step="0.001"
                      onInput={this.onTransactionFeeChange}
                    />
                  </InputWrapper>
                  <InputWrapper styles={styles} label="Loyer">
                    <IconInput
                      styles={styles}
                      icon="€"
                      type="number"
                      name="monthlyRent"
                      defaultValue={Util.moneyValue(monthlyRent, false, false)}
                      step="1"
                      onInput={this.onRentChange}
                    />
                  </InputWrapper>
                </form>
              </div>
            </div>

            <div className={styles.results}>
              <div className={styles.resultRow} data-tip="Montant emprunté">
                <div className={styles.resultLabel}>Emprunt:</div>
                <div className={styles.resultValue}>
                  {Util.moneyValue(loanAmount)}
                </div>
              </div>
              <div
                className={styles.resultRow}
                data-tip={`tauxMensuel* montantEmprunté * Math.pow(1 + tauxMensuel, horizon)) /(Math.pow(1 + tauxMensuel, horizon) - 1);`}
              >
                <div className={styles.resultLabel}>Mensualité:</div>
                <div className={styles.resultValue}>
                  {Util.moneyValue(principalAndInterest)}
                </div>
              </div>
              <div
                className={styles.resultRow}
                data-tip="Taxe foncière mensuelle: (Prix du bien * taux)/12"
              >
                <div className={styles.resultLabel}>Taxe foncière</div>
                <div className={styles.resultValue}>{Util.moneyValue(tax)}</div>
              </div>
              <div
                className={styles.resultRow}
                data-tip="Math.pow(1 + TAEG, 1 / 12) - 1;"
              >
                <div className={styles.resultLabel}>Taux d'intérêt mensuel</div>
                <div className={styles.resultValue}>
                  {Util.percentValue(calculateMonthlyRate(interestRate))}
                </div>
              </div>
              {this.state.insuranceEnabled ? (
                <div
                  className={styles.resultRow}
                  data-tip="Assurance habitation mensuelle: (Prix du bien * taux)/12"
                >
                  <div className={styles.resultLabel}>Assurance habitation</div>
                  <div className={styles.resultValue}>
                    {Util.moneyValue(insurance)}
                  </div>
                </div>
              ) : null}
              {mortgageInsuranceEnabled ? (
                <div
                  className={styles.resultRow}
                  data-tip="Assurance mensuelle du prêt: (Montant emprunté * taux)/12"
                >
                  <div className={styles.resultLabel}>Assurance du prêt:</div>
                  <div className={styles.resultValue}>
                    {Util.moneyValue(mortgageInsurance)}
                  </div>
                </div>
              ) : null}
              <div
                className={`${styles.resultRow} ${styles.totalPayment}`}
                data-tip="Coût Total Mensuel"
              >
                <div className={styles.resultLabel}>Total:</div>
                <div className={styles.resultValue}>
                  {Util.moneyValue(total)}
                </div>
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
            {showMonthlyPayments ? (
              <div className={styles.schedule}>
                <PaymentSchedule mortgage={this.state.mortgage} />
              </div>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
