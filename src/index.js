import React from 'react';
import ReactDOM from 'react-dom';
import MortgageCalculator from "./MortgageCalculator";
import PaymentSchedule from "./PaymentSchedule";
// import redStyles from "./RedStyle.css";



const root = (
    <React.Fragment>
        <MortgageCalculator showPaymentSchedule />
    </React.Fragment>
);

ReactDOM.render(
    root,
    document.getElementById('root')
);