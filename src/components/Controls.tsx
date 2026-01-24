import { IoSettingsSharp } from "react-icons/io5";
import c from "./controls.module.css";

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
        <IoSettingsSharp />
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
