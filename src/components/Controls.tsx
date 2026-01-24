import c from "./controls.module.css";
import { PiFaders } from "react-icons/pi";

import { ControlGrid, NodeContainer } from "@hedron-gl/ui-core";

const CRUSH_ID = "12617f97ba0acdde";
const COS_ID = "4b4563d5bb481028";
const SIN_ID = "94b4563d5bb48102";
const WAVE_LENGTH_ID = "d0694b4563d5bb48";
const WAVE_AMP_ID = "5d0694b4563d5bb4";
const OPACITY_ID = "27e122b2c069676e";

const nodeIds = [
  CRUSH_ID,
  COS_ID,
  SIN_ID,
  WAVE_LENGTH_ID,
  WAVE_AMP_ID,
  OPACITY_ID,
];

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
            {nodeIds.map((id) => (
              <NodeContainer key={id} nodeId={id} layout="vertical" />
            ))}
          </ControlGrid>
        </div>
      )}
    </div>
  );
}

export default Controls;
