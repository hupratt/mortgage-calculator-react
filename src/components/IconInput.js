import React from "react";

const IconInput = ({ styles, icon, ...rest }) => {
  return (
    <div className={styles.inputField}>
      <div className={styles.inputIcon}>{icon}</div>
      <input {...rest} />
    </div>
  );
};

export default IconInput;
