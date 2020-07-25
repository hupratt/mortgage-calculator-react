import React from "react";
import ReactDOM from "react-dom";
import MortgageCalculator from "./MortgageCalculator";

const root = (
  <div className="container">
    <MortgageCalculator showPaymentSchedule />
  </div>
);

ReactDOM.render(root, document.getElementById("root"));
