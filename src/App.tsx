import Complex from "complex.js";
import { useState } from "react";
import { ColorizerSelect } from "./ColorizerSelect";
import { Colorizer, complexToScreenCoordinates } from "./fractals";
import { FractalView } from "./FractalView";

function App() {
  const [[x, y, c], setHoverPoint] = useState([0, 0, new Complex(0, 0)]);
  const [colorizer, setColorizer] = useState<Colorizer>(
    Colorizer.BlackAndWhite
  );

  const [renderWindow, setRenderWindow] = useState({
    size: 600,
    zoom: 4,
    centerX: 300,
    centerY: 300,
  });

  const handleMouseMove = (x: number, y: number, c: Complex) => {
    setHoverPoint([x, y, c]);
  };

  const handleClick = (x: number, y: number, c: Complex) => {
    const newCenter = complexToScreenCoordinates(renderWindow, c.mul(-1));

    setRenderWindow({
      ...renderWindow,
      centerX: newCenter.x,
      centerY: newCenter.y,
      zoom: renderWindow.zoom / 2,
    });
  };

  return (
    <div>
      <FractalView
        size={renderWindow.size}
        zoom={renderWindow.zoom}
        centerX={renderWindow.centerX}
        centerY={renderWindow.centerY}
        iterations={200}
        colorizer={colorizer}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />

      <div>
        <ColorizerSelect value={colorizer} onChange={setColorizer} />
      </div>

      <pre>{JSON.stringify({ x, y, c }, null, 2)}</pre>
    </div>
  );
}

export default App;
