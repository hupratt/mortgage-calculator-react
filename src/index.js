import React from "react";
import ReactDOM from "react-dom";
import MortgageCalculator from "./MortgageCalculator";
import ReactTooltip from "react-tooltip";

const root = (
  <div className="container">
    <ReactTooltip
      place="bottom"
      effect="solid"
      delayHide={1000}
      data-event="click"
    />
    <MortgageCalculator showPaymentSchedule />
  </div>
);

ReactDOM.render(root, document.getElementById("root"));
