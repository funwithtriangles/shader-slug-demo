import { engineStore } from "./engine";
import "@theatre/core";
import { getProject, types } from "@theatre/core";
import studio from "@theatre/studio";

import theatreState from "./theatre.json";

const { updateNodeValue, ...state } = engineStore.getState();

studio.initialize();

const project = getProject("Shader Slug", { state: theatreState });

Object.entries(state.sketches).forEach(([id, sketch]) => {
  const sheet = project.sheet(sketch.title);

  sketch.paramIds.forEach((paramId) => {
    const param = state.nodes[paramId];

    let obj;
    let colorObj;

    switch (param.valueType) {
      case "number":
        obj = sheet.object(param.title, {
          [param.key]: types.number(param.defaultValue, {
            range: [param.sliderMin ?? 0, param.sliderMax ?? 1],
          }),
        });
        break;
      case "boolean":
        obj = sheet.object(param.title, {
          [param.key]: types.boolean(param.defaultValue),
        });
        break;
      case "rgb":
        const [r, g, b] = param.defaultValue;
        colorObj = sheet.object(param.title, {
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
