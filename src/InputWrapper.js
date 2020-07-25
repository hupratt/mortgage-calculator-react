import React from "react";

const InputWrapper = ({ label, styles, children, subtext }) => {
  const inputs = React.Children.toArray(children).map((child, index) => (
    <div className={styles.inputSection} key={index}>
      {child}
    </div>
  ));
  return (
    <div className={styles.inputWrapper}>
      <label>{label}</label>
      {inputs}
      {subtext ? <div className={styles.subtext}>{subtext}</div> : null}
    </div>
  );
};

export default InputWrapper;
