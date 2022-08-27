import { ChangeEvent, FC, useCallback } from "react";
import { MouseTool } from "./tools";
import { TbZoomInArea, TbZoomIn, TbZoomOut } from "react-icons/tb";
import { RadioButtonsGroup } from "./RadioButtonsGroup";

interface ToolSelectProps {
  value: MouseTool;
  onChange: (tool: MouseTool) => void;
}

export const ToolSelect: FC<ToolSelectProps> = ({ value, onChange }) => {
  const handleToolChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value as MouseTool);
    },
    [onChange]
  );
  //Radio buttons with icons
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
