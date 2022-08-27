import { renderFractalOnImageData } from "./fractals";

onmessage = (event) => {
  const { data } = event;
  console.log("worker received message", data);

  const {
    data: imageData,
    size,
    maxIterations,
    center,
    zoom,
    colorizer,
  } = data;
  console.log("start rendering");
  renderFractalOnImageData(imageData, {
    size,
    maxIterations,
    center,
    zoom,
    colorizer,
  });
    console.log("done rendering");
    console.log("start sending message");

    postMessage({ HUY: imageData });
    console.log("done sending message");
};

export {};
