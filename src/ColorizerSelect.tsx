import { FC, useCallback } from "react";
import { TbRainbow } from "react-icons/tb";
import {GiEmptyChessboard, GiSuperMushroom} from 'react-icons/gi'
import { Colorizer } from "./fractals";
import { RadioButtonsGroup } from "./RadioButtonsGroup";

interface ColorizerSelectProps {
  value: Colorizer;
  onChange: (colorizer: Colorizer) => void;
}

export const ColorizerSelect: FC<ColorizerSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <RadioButtonsGroup
      value={value}
      onChange={onChange}
      options={[
        { value: Colorizer.BlackAndWhite, icon: <GiEmptyChessboard />, label: "Black and White" },
        { value: Colorizer.Rainbow, icon: <TbRainbow />, label: "Rainbow" },
        { value: Colorizer.Psychedelic, icon: <GiSuperMushroom />, label: "Psychedelic" },
      ]}
    />
  );
};
