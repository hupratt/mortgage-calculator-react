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
      </li>
    );
  });
  return (
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
        <div data-tip="Principal * tauxMensuel">Remboursement des Intérêts</div>
        <div data-tip="Σ Principal * tauxMensuel">Intérêts payés cumulés</div>
        <div data-tip="Solde restant à payer">Principal </div>
        <div data-tip="Valeur de l'investissement: achat d'une propriété">
          Valeur de l'option 1: Acheter
        </div>
        <div data-tip="Acompte + Frais de notaire + Remboursement du Principal + Remboursement des Intérêts + Assurance habitation + Assurance du prêt + Taxe foncière mensuelle + Frais mensuels de maintenance">
          {/* <div data-tip="Valeur de l'investissement: location d'une propriété + ETF"> */}
          Coûts liés à l'option 1
        </div>
      </li>
      {paymentRows}
    </ul>
  );
};

export default PaymentSchedule;
