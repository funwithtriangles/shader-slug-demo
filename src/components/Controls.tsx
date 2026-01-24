import c from "./controls.module.css";
import { PiFaders } from "react-icons/pi";

interface ControlsProps {
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

function Controls({ isOpen, onToggle }: ControlsProps) {
  return (
    <div className={c.controls}>
      <button
        className={c.toggleButton}
        onClick={onToggle}
        aria-label="Toggle controls"
      >
        <PiFaders />
      </button>

      {isOpen && (
        <div className={c.panel} onClick={(e) => e.stopPropagation()}>
          <h2>Controls</h2>
          {/* Add your controls here */}
        </div>
      )}
    </div>
  );
}

export default Controls;
