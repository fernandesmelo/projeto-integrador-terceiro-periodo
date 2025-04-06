import React from "react";
import styles from "./Button.module.css";
import clsx from "clsx";

const Button = ({children, onClick, type, variant, disabled}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.button, styles[variant], disabled ? styles.disabled : null)}
    >
      {children}
    </button>
  );
};

export default Button;