import React from "react";
import BuyOrRent from "./features/BuyOrRent";
import "./App.css";

const App = () => {
  return (
    <React.Fragment>
      <BuyOrRent showPaymentSchedule />
    </React.Fragment>
  );
};

export default App;
