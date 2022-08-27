import { ChangeEvent, FC, useCallback } from "react";
import { MouseTool } from "./tools";

interface ToolSelectProps {
    value: MouseTool;
    onChange: (tool: MouseTool) => void;
}


export const ToolSelect: FC<ToolSelectProps> = ({
    value,
    onChange,
    }) => {
    const handleToolChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            onChange(event.target.value as MouseTool);
        },
        [onChange]
    );
    return (
        <select value={value} onChange={handleToolChange}>
            <option value={MouseTool.ZoomIn}>Zoom In</option>
            <option value={MouseTool.ZoomWindow}>Zoom Window</option>
        </select>
    );
}