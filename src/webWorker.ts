import { renderFractalOnImageData } from "./fractals";

onmessage = (event) => {
  const { data } = event;
  console.log("worker received message", data);

  const { imageData, ...options } = data;


  console.time("renderFractalOnImageData");
  renderFractalOnImageData(imageData, options);
  console.timeEnd("renderFractalOnImageData");

  console.log("done rendering");
  console.log("start sending message");

  postMessage(imageData);
  console.log("done sending message");
};

export {};
