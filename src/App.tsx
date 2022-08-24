import Complex from "complex.js";
import { useState } from "react";
import { ColorizerSelect } from "./ColorizerSelect";
import {
  Colorizer,
  complexToScreenCoordinates,
  RenderFractalWindow,
} from "./fractals";
import { FractalView } from "./FractalView";

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

  const handleMouseMove = (x: number, y: number, c: Complex) => {
    setHoverPoint([x, y, c]);
  };

  return (
    <div>
      <FractalView
        size={renderWindow.size}
        zoom={renderWindow.zoom}
        center={renderWindow.center}
        iterations={200}
        colorizer={colorizer}
        onMouseMove={handleMouseMove}
        onChangeRenderWindow={setRenderWindow}
      />

      <div>
        <ColorizerSelect value={colorizer} onChange={setColorizer} />
      </div>

      <pre>{JSON.stringify({ x, y, c }, null, 2)}</pre>
    </div>
  );
}

export default App;
