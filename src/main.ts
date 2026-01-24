import { clock, engineStore } from "./engine";
import "@theatre/core";
import { getProject, onChange, types, val } from "@theatre/core";
import studio from "@theatre/studio";
import audioUrl from "./audio.mp3";

import theatreJson from "./theatre.json";
import { createAudioBuffer } from "./utils";
import { Param } from "@hedron-gl/engine";
import { appCallbacks, appSetters } from "./components/App";

export function initEngine() {
  // might help with iOS audio playback when silent mode is on
  if ("audioSession" in navigator) {
    navigator.audioSession.type = "playback";
  }

  const { updateNodeValue, ...state } = engineStore.getState();

  let aspectRatio = window.innerWidth / window.innerHeight;

  if (import.meta.env.DEV) {
    studio.initialize();
  }

  // create an AudioContext using the Audio API
  const audioContext = new AudioContext();

  // const theatreState = undefined;
  const theatreState = theatreJson as any;

  const project = getProject("Shader Slug", { state: theatreState });

  const sheet = project.sheet("Timeline");

  // the audio output.
  const destinationNode = audioContext.destination;

  createAudioBuffer(audioUrl, audioContext).then(async (buffer) => {
    await project.ready;
    await sheet.sequence.attachAudio({
      source: buffer,
      audioContext,
      destinationNode,
    });

    appSetters.setAudioLoaded(true);
    appSetters.setButtonText("Play");
  });

  let isBeginning = true;

  onChange(sheet.sequence.pointer.playing, (playing) => {
    if (playing) {
      clock.start(isBeginning);
      isBeginning = false;
      appSetters.setIsPlaying(true);
    } else {
      clock.stop();
      appSetters.setIsPlaying(false);

      if (
        val(sheet.sequence.pointer.position) ===
        val(sheet.sequence.pointer.length)
      ) {
        isBeginning = true;
        appSetters.setButtonText("Replay");
      }
    }
  });

  const pause = () => {
    sheet.sequence.pause();
  };

  const play = async () => {
    const requestFullscreen =
      document.body.requestFullscreen || document.body.webkitRequestFullscreen;
    if (requestFullscreen) {
      await requestFullscreen.call(document.body);
    }
    appSetters.setButtonText("Play");
    if (isBeginning) {
      sheet.sequence.position = 0;
    }
    sheet.sequence.play();
  };

  // Set up callbacks for React
  appCallbacks.onPlay = play;
  appCallbacks.onPause = pause;

  document.body.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      e.stopPropagation();
      console.log(val(sheet.sequence.pointer.playing));
      if (val(sheet.sequence.pointer.playing)) {
        pause();
      } else {
        play();
      }
    }
  });

  window.addEventListener("resize", () => {
    aspectRatio = window.innerWidth / window.innerHeight;
  });

  Object.entries(state.sketches).forEach(([sketchId, sketch]) => {
    sketch.nodeIds.forEach((paramId) => {
      const param = state.nodes[paramId] as Param;

      let obj;
      let colorObj;

      switch (param.valueType) {
        case "number":
          const sliderMin = state.nodeValues[`${paramId}-sliderMin`] as number;
          const sliderMax = state.nodeValues[`${paramId}-sliderMax`] as number;
          obj = sheet.object(`${sketch.title} / ${param.key}`, {
            [param.key]: types.number(param.defaultValue, {
              range: [sliderMin ?? 0, sliderMax ?? 1],
            }),
          });
          break;
        case "boolean":
          obj = sheet.object(`${sketch.title} / ${param.key}`, {
            [param.key]: types.boolean(param.defaultValue),
          });
          break;
        case "string":
          obj = sheet.object(`${sketch.title} / ${param.key}`, {
            [param.key]: types.string(param.defaultValue),
          });
          break;
        case "rgb":
          const [r, g, b] = param.defaultValue;
          colorObj = sheet.object(`${sketch.title} / ${param.key}`, {
            [param.key]: types.rgba({ r, g, b, a: 1 }),
          });

          colorObj.onValuesChange((v) => {
            const { r, g, b } = v[param.key];
            const ch = [r, g, b];
            param.childNodeIds.forEach((childId, index) => {
              updateNodeValue(childId, ch[index]);
            });
          });
          break;
      }

      obj?.onValuesChange((v) => {
        let value = v[param.key];
        if (param.key === "orbitRad" && aspectRatio < 1) {
          // quick hack to get slug in shot on mobile
          value *= 2.5;
        }
        updateNodeValue(paramId, value);
      });
    });
  });

  const particlesLFOEnabled = "6dd885cc5f2061cb";
  const wormsLFOEnabled = "2a69db3e1cbecefa";
  const stripesLFOEnabled = "25ef78c1445a6021";
  const noiseSpeedLFOEnabled = "070f884120ad4f1c";
  const bigWormsLFOEnabled = "ea0f1f0adb98d0ee";

  const lfoObj = sheet.object("LFO", {
    particlesEnabled: types.boolean(false),
    wormsEnabled: types.boolean(false),
    bigWormsLFOEnabled: types.boolean(false),
    stripesEnabled: types.boolean(false),
    noiseSpeedEnabled: types.boolean(false),
  });

  lfoObj.onValuesChange((v) => {
    updateNodeValue(particlesLFOEnabled, v.particlesEnabled);
    updateNodeValue(wormsLFOEnabled, v.wormsEnabled);
    updateNodeValue(stripesLFOEnabled, v.stripesEnabled);
    updateNodeValue(noiseSpeedLFOEnabled, v.noiseSpeedEnabled);
    updateNodeValue(bigWormsLFOEnabled, v.bigWormsLFOEnabled);
  });
}
