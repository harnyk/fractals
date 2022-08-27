import { css } from "@emotion/css";
import { FC, ReactNode } from "react";

interface RadioButtonsGroupProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; icon: ReactNode; label: string }[];
}

export const RadioButtonsGroup = function RadioButtonsGroup<T>({
  value,
  onChange,
  options,
}: RadioButtonsGroupProps<T>) {
  return (
    <div
      className={css({
        display: "inline-flex",
        flexDirection: "row",
        padding: 0,
        border: "1px solid #ddd",
      })}
    >
      {options.map(({ value: optionValue, icon, label }) => (
        <div
          key={`${optionValue}`}
          className={css({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px",
            border: "1px solid #ddd",
            cursor: "pointer",
            backgroundColor: optionValue === value ? "#ddd" : "transparent",
          })}
          onClick={() => onChange(optionValue)}
        >
          <div
            className={css({
              fontSize: "2em",
            })}
          >
            {icon}
          </div>
          <div>{label}</div>
        </div>
      ))}
    </div>
  );
};
