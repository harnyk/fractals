import { FC } from "react";
import { TbZoomIn, TbZoomInArea, TbZoomOut } from "react-icons/tb";
import { RadioButtonsGroup } from "./RadioButtonsGroup";
import { MouseTool } from "./tools";

interface ToolSelectProps {
  value: MouseTool;
  onChange: (tool: MouseTool) => void;
}

export const ToolSelect: FC<ToolSelectProps> = ({ value, onChange }) => {
  return (
    <RadioButtonsGroup
      value={value}
      onChange={onChange}
      options={[
        { value: MouseTool.ZoomIn, icon: <TbZoomIn />, label: "Zoom In" },
        { value: MouseTool.ZoomOut, icon: <TbZoomOut />, label: "Zoom Out" },
        {
          value: MouseTool.ZoomWindow,
          icon: <TbZoomInArea />,
          label: "Zoom Window",
        },
      ]}
    />
  );
};
