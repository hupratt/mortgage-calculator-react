import React from "react";
import ReactDOM from "react-dom";
import MortgageCalculator from "./MortgageCalculator";
import ReactTooltip from "react-tooltip";
import "./App.css";

const root = (
  <React.Fragment>
    <ReactTooltip
      place="bottom"
      effect="solid"
      delayHide={1000}
      data-event="click"
    />
    <MortgageCalculator showPaymentSchedule />
  </React.Fragment>
);

ReactDOM.render(root, document.getElementById("root"));
