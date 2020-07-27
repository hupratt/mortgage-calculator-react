import Util from "../Util";
import React from "react";
import DefaultStyles from "../DefaultStyle.css";
import ReactTooltip from "react-tooltip";

const PaymentSchedule = ({ mortgage: { paymentSchedule, total }, styles }) => {
  const _styles = styles || DefaultStyles;
  const showPennies = false;
  const paymentRows = paymentSchedule.map(function (payment) {
    let rowClass = _styles.paymentRow;
    const isYearlyPayment = payment.count % 12 === 0;
    if (isYearlyPayment) {
      rowClass += " " + _styles.paymentRowYear;
    }
    return (
      <li key={payment.count} className={rowClass}>
        <div>
          {!isYearlyPayment ? payment.count : "Année " + payment.count / 12}
        </div>
        <div>{Util.moneyValue(payment.principalPayment, showPennies)}</div>
        <div>{Util.moneyValue(payment.interestPayment, showPennies)}</div>
        <div>{Util.moneyValue(payment.totalInterest, showPennies)}</div>
        <div>{Util.moneyValue(payment.balance, showPennies)}</div>
        <div>{Util.moneyValue(payment.housePrice, showPennies)}</div>
        <div>{Util.moneyValue(payment.costOption1, showPennies)}</div>
        <div>{Util.moneyValue(payment.costOption2, showPennies)}</div>
        <div>{Util.moneyValue(payment.valueOption2, showPennies)}</div>
      </li>
    );
  });
  const returnParagraph = (arr) => {
    const val1 = arr[arr.length - 1].housePrice;
    const val2 = arr[arr.length - 1].valueOption2;
    const monthlyETFreturnRate = arr[0].monthlyETFreturnRate;
    const investETFyear1 = arr[0].costOption1 - arr[0].costOption2;
    const investETFyear2 = arr[1].costOption1 - arr[1].costOption2;
    const etf = `Le rendement mensuel de l'ETF est de ${Util.percentValue(
      monthlyETFreturnRate - 1
    )} sachant qu'on investit ici ${Util.moneyValue(
      investETFyear1
    )} la première année et ${Util.moneyValue(investETFyear2)} tous les mois`;
    if (val1 > val2) {
      return (
        `À maturité l'option 1 est la meilleure option avec une valeur de ${Util.moneyValue(
          arr[arr.length - 1].housePrice,
          showPennies
        )}. ` + etf
      );
    } else {
      return (
        `À maturité l'option 2 est la meilleure option avec une valeur de ${Util.moneyValue(
          arr[arr.length - 1].valueOption2,
          showPennies
        )}. ` + etf
      );
    }
  };
  return (
    <React.Fragment>
      <p style={{ textAlign: "center" }}>{returnParagraph(paymentSchedule)}</p>
      <ul className={_styles.paymentList}>
        <ReactTooltip
          place="bottom"
          effect="solid"
          // delayHide={1000}
          data-event="click"
        />

        <li className={_styles.paymentRow + " " + _styles.paymentHeader}>
          <div>Mois</div>

          <div data-tip="Mensualité - Remboursement des Intérêts">
            Remboursement du Principal
          </div>
          <div data-tip="Principal * tauxMensuel">
            Remboursement des Intérêts
          </div>
          <div data-tip="Σ Principal * tauxMensuel">Intérêts payés cumulés</div>
          <div data-tip="Solde restant à payer">Principal </div>
          <div data-tip="Valeur du bien * (1 + Taux d'intérêt mensuel)">
            Valeur de l'option 1: Acheter
          </div>
          <div data-tip="Acompte + Frais de notaire + Remboursement du Principal + Remboursement des Intérêts + Assurance habitation + Assurance du prêt + Taxe foncière mensuelle + Frais mensuels de maintenance">
            Coûts liés à l'option 1
          </div>
          <div data-tip="Loyer + Coûts liés à l'option 1 x Frais de transaction mensuel ETF">
            Coûts liés à l'option 2
          </div>
          <div data-tip="(Coûts liés à l'option 1 -  Coûts liés à l'option 2) x (1 + Rendement mensuel de l'ETF )">
            Valeur de l'option 2: Louer
          </div>
        </li>
        {paymentRows}
      </ul>
    </React.Fragment>
  );
};

export default PaymentSchedule;
