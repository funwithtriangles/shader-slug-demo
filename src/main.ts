import { engineStore } from "./engine";
import "@theatre/core";
import { getProject, types } from "@theatre/core";
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

const sheet = project.sheet("Timeline");

const button = document.querySelector("#play-button")!;

if (import.meta.env.DEV) {
  sheet.sequence.attachAudio({ source: audio });
} else {
  project.ready.then(async () => {
    await sheet.sequence.attachAudio({ source: audio });
    sheet.sequence.play();
    document.body.classList.add("playing");
  });
}

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

// const CAM_Y = "ff6d8b05f5f49617";

// const cameraObj = sheet.object("Camera", {
//   camY: types.number(0, { range: [-5, 5] }),
// });

// cameraObj.onValuesChange((v) => {
//   updateNodeValue(CAM_Y, v.camY);
// });
