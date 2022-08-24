import { FC, useCallback } from "react";
import { Colorizer } from "./fractals";

interface ColorizerSelectProps {
  value: Colorizer;
  onChange: (colorizer: Colorizer) => void;
}

export const ColorizerSelect: FC<ColorizerSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      {Object.entries(Colorizer).map(([name, colorizer]) => (
        <label key={name}>
          <input
            type="radio"
            name="colorizer"
            value={name}
            checked={value === colorizer}
            onChange={() => onChange(colorizer)}
          />
          {name}
        </label>
      ))}
    </div>
  );
};
