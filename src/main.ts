import { clock, engineStore } from "./engine";
import "@theatre/core";
import { getProject, onChange, types, val } from "@theatre/core";
import studio from "@theatre/studio";
import audioUrl from "./audio.mp3";

import theatreJson from "./theatre.json";
import { createAudioBuffer } from "./utils";

const button = document.querySelector("#play-button")!;

// might help with iOS audio playback when silent mode is on
if ("audioSession" in navigator) {
  navigator.audioSession.type = "playback";
}

const { updateNodeValue, ...state } = engineStore.getState();

let aspectRatio = window.innerWidth / window.innerHeight;

if (import.meta.env.DEV) {
  studio.initialize();
}

document.querySelector("#item-code")!.classList.add("loaded");

// create an AudioContext using the Audio API
const audioContext = new AudioContext();

createAudioBuffer(audioUrl, audioContext).then(async (buffer) => {
  await project.ready;
  await sheet.sequence.attachAudio({
    source: buffer,
    audioContext,
    destinationNode,
  });

  document.querySelector("#item-audio")!.classList.add("loaded");
  button.classList.add("loaded");
  button.textContent = "Play";
});

// the audio output.
const destinationNode = audioContext.destination;

// const theatreState = undefined;
const theatreState = theatreJson as any;

const project = getProject("Shader Slug", { state: theatreState });

const sheet = project.sheet("Timeline");

let isBeginning = true;

onChange(sheet.sequence.pointer.playing, (playing) => {
  if (playing) {
    clock.start(isBeginning);
    isBeginning = false;
    document.body.classList.add("playing");
  } else {
    clock.stop();
    document.body.classList.remove("playing");

    if (
      val(sheet.sequence.pointer.position) ===
      val(sheet.sequence.pointer.length)
    ) {
      isBeginning = true;
      button.textContent = "Replay";
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
  button.textContent = "Play";
  sheet.sequence.play();
};

button.addEventListener("click", async (e) => {
  e.stopPropagation();

  if (isBeginning) {
    sheet.sequence.position = 0;
  }
  play();
});

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
document.body.addEventListener("click", pause);

window.addEventListener("resize", () => {
  aspectRatio = window.innerWidth / window.innerHeight;
});

Object.entries(state.sketches).forEach(([sketchId, sketch]) => {
  sketch.paramIds.forEach((paramId) => {
    const param = state.nodes[paramId];

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

// const CAM_Y = "ff6d8b05f5f49617";

// const cameraObj = sheet.object("Camera", {
//   camY: types.number(0, { range: [-5, 5] }),
// });

// cameraObj.onValuesChange((v) => {
//   updateNodeValue(CAM_Y, v.camY);
// });
