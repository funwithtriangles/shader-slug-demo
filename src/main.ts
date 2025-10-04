import { clock, engineStore } from "./engine";
import "@theatre/core";
import { getProject, onChange, types } from "@theatre/core";
import studio from "@theatre/studio";
import audio from "./audio.mp3";

import theatreJson from "./theatre.json";

const { updateNodeValue, ...state } = engineStore.getState();

if (import.meta.env.DEV) {
  studio.initialize();
}

// const theatreState = undefined;
const theatreState = theatreJson as any;

const project = getProject("Shader Slug", { state: theatreState });

const AUTOPLAY = true;

const sheet = project.sheet("Timeline");

const button = document.querySelector("#play-button")!;

if (import.meta.env.DEV) {
  sheet.sequence.attachAudio({ source: audio });
} else if (AUTOPLAY) {
  project.ready.then(async () => {
    await sheet.sequence.attachAudio({ source: audio });
    sheet.sequence.play();
    document.body.classList.add("playing");
  });
}

onChange(sheet.sequence.pointer.playing, (playing) => {
  if (playing) {
    clock.start(true);
    button.classList.add("hidden");
  } else {
    clock.stop();
  }
});

if (!AUTOPLAY) {
  button.classList.remove("hidden");
}

button.addEventListener("click", async () => {
  await project.ready;
  await sheet.sequence.attachAudio({ source: audio });
  sheet.sequence.play();
  clock.start(true);
  document.body.classList.add("playing");
  button.classList.add("hidden");
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
      updateNodeValue(paramId, v[param.key]);
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
