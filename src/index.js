import React from "react";
import ReactDOM from "react-dom";
import MortgageCalculator from "./MortgageCalculator";
import PaymentSchedule from "./PaymentSchedule";
// import redStyles from "./RedStyle.css";

const root = (
  <div className="container">
    <MortgageCalculator showPaymentSchedule />
  </div>
);

ReactDOM.render(root, document.getElementById("root"));
