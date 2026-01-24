import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import c from "./controls.module.css";

function Controls() {
  return (
    <div className={c.controls}>
      <h2>Controls</h2>
      {/* Add your controls here */}
    </div>
  );
}

export function mountControls() {
  const container = document.getElementById("controls");
  if (!container) {
    console.error("Controls container not found");
    return;
  }

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <Controls />
    </StrictMode>,
  );
}

export default Controls;
