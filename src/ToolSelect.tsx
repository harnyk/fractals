import { ChangeEvent, FC, useCallback } from "react";
import { MouseTool } from "./tools";
import { TbZoomInArea, TbZoomIn, TbZoomOut } from "react-icons/tb";

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
    <div>
      <label>
        <input
          type="radio"
          name="tool"
          value={MouseTool.ZoomIn}
          checked={value === MouseTool.ZoomIn}
          onChange={handleToolChange}
        />
          <TbZoomIn />
      </label>
      <label>
        <input
          type="radio"
          name="tool"
          value={MouseTool.ZoomWindow}
          checked={value === MouseTool.ZoomWindow}
          onChange={handleToolChange}
        />
        <TbZoomInArea />
      </label>
      <label>
        <input
          type="radio"
          name="tool"
          value={MouseTool.ZoomOut}
          checked={value === MouseTool.ZoomOut}
          onChange={handleToolChange}
        />
        <TbZoomOut />
      </label>
    </div>
  );
};
