import c from "./controls.module.css";
import { PiFaders } from "react-icons/pi";

import { ControlGrid, NodeContainer } from "@hedron-gl/ui-core";

const CRUSH_ID = "12617f97ba0acdde";

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
          <ControlGrid>
            <NodeContainer nodeId={CRUSH_ID} layout="vertical" />
          </ControlGrid>
        </div>
      )}
    </div>
  );
}

export default Controls;
