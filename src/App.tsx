import Complex from "complex.js";
import { useState } from "react";
import { ColorizerSelect } from "./ColorizerSelect";
import { Colorizer, RenderFractalWindow } from "./fractals";
import { FractalView } from "./FractalView";
import { MouseTool } from "./tools";
import { ToolSelect } from "./ToolSelect";

function App() {
  const [[x, y, c], setHoverPoint] = useState([0, 0, new Complex(0, 0)]);
  const [colorizer, setColorizer] = useState<Colorizer>(
    Colorizer.BlackAndWhite
  );

  const [renderWindow, setRenderWindow] = useState<RenderFractalWindow>({
    size: 600,
    zoom: 4,
    center: new Complex(0, 0),
  });

  const [mouseTool, setMouseTool] = useState<MouseTool>(MouseTool.ZoomIn);

  const handleMouseMove = (x: number, y: number, c: Complex) => {
    setHoverPoint([x, y, c]);
  };

  return (
    <div
      style={{
        margin: 100,
        padding: 100,
      }}
    >
      <div>
        <ColorizerSelect value={colorizer} onChange={setColorizer} />
        <ToolSelect value={mouseTool} onChange={setMouseTool} />
      </div>
      <FractalView
        size={renderWindow.size}
        zoom={renderWindow.zoom}
        center={renderWindow.center}
        iterations={200}
        colorizer={colorizer}
        mouseTool={mouseTool}
        onMouseMove={handleMouseMove}
        onChangeRenderWindow={setRenderWindow}
      />

      <pre>{JSON.stringify({ x, y, c }, null, 2)}</pre>
    </div>
  );
}

export default App;
