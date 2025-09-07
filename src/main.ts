import { engineStore } from "./engine";
import "@theatre/core";
import { getProject, types } from "@theatre/core";
import studio from "@theatre/studio";

const { updateNodeValue } = engineStore.getState();

studio.initialize();

const CAM_Y = "ff6d8b05f5f49617";

const project = getProject("Shader Slug");
const sheet = project.sheet("Scene");

const cameraObj = sheet.object("Camera", {
  camY: types.number(0, { range: [-5, 5] }),
});

cameraObj.onValuesChange((v) => {
  updateNodeValue(CAM_Y, v.camY);
});
