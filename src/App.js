import React from "react";
import MortgageCalculator from "./MortgageCalculator";
import "./App.css";

const App = () => {
  return (
    <React.Fragment>
      <MortgageCalculator showPaymentSchedule />
    </React.Fragment>
  );
};

export default App;
