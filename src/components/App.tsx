import { StrictMode, useState, useCallback, useEffect } from "react";
import { createRoot } from "react-dom/client";
import MainCard from "./MainCard";
import Controls from "./Controls";
import type { HedronEngine } from "@hedron-gl/engine";
import type { Clock } from "@hedron-gl/clock";
import { EngineStoreProvider } from "@hedron-gl/ui-core";

// Callbacks that main.ts will set
export const appCallbacks = {
  onPlay: () => {},
  onPause: () => {},
};

// Setters that main.ts can call to update React state
export const appSetters = {
  setSlugLoaded: (_: boolean) => {},
  setAudioLoaded: (_: boolean) => {},
  setIsPlaying: (_: boolean) => {},
  setButtonText: (_: string) => {},
  setEngineReady: () => {},
};

// Engine reference - populated by main.ts when engine loads
export type EngineRef = {
  engine: HedronEngine | null;
  engineStore: ReturnType<HedronEngine["getStore"]> | null;
  clock: Clock | null;
};

export const engineRef: EngineRef = {
  engine: null,
  engineStore: null,
  clock: null,
};

function App() {
  const [slugLoaded, setSlugLoaded] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buttonText, setButtonText] = useState("Loading");
  const [controlsOpen, setControlsOpen] = useState(false);
  const [engineReady, setEngineReady] = useState(false);

  const isLoaded = slugLoaded && audioLoaded;

  // Expose setters to rest of app (e.g. sketches and main.ts)
  useEffect(() => {
    appSetters.setSlugLoaded = setSlugLoaded;
    appSetters.setAudioLoaded = setAudioLoaded;
    appSetters.setIsPlaying = setIsPlaying;
    appSetters.setButtonText = setButtonText;
    appSetters.setEngineReady = () => setEngineReady(true);
  }, []);

  const handleBodyClick = useCallback(() => {
    if (controlsOpen) {
      setControlsOpen(false);
    } else if (isPlaying) {
      appCallbacks.onPause();
    }
  }, [controlsOpen, isPlaying]);

  const handlePlayClick = useCallback(() => {
    appCallbacks.onPlay();
  }, []);

  const handleToggleControls = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setControlsOpen((prev) => !prev);
  }, []);

  return (
    <EngineStoreProvider value={engineRef.engineStore}>
      <div onClick={handleBodyClick} style={{ position: "fixed", inset: 0 }}>
        <MainCard
          codeLoaded={true}
          slugLoaded={slugLoaded}
          audioLoaded={audioLoaded}
          isLoaded={isLoaded}
          isPlaying={isPlaying}
          buttonText={buttonText}
          onPlayClick={handlePlayClick}
        />
        {isPlaying && (
          <Controls isOpen={controlsOpen} onToggle={handleToggleControls} />
        )}
      </div>
    </EngineStoreProvider>
  );
}

export function mountApp() {
  const container = document.getElementById("app")!;

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
