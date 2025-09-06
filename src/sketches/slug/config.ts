import { uniform } from "three/tsl";
import { numSlugs, uniformsParamsConfig } from "./uniformsParamsConfig";

export default {
  title: "Slug",
  description: "Wavey boi",
  params: [
    {
      key: "metalness",
      defaultValue: 0.2,
    },
    {
      key: "roughness",
      defaultValue: 0.2,
    },
    {
      key: "waveSpeed",
      defaultValue: 0.1,
      sliderMin: 0.01,
      sliderMax: 0.5,
    },
    {
      key: "finWaveSpeed",
      defaultValue: 0.1,
      sliderMin: 0.01,
      sliderMax: 0.5,
    },
    {
      key: "noiseSpeed",
      defaultValue: 1,
      sliderMin: 0.01,
      sliderMax: 0.5,
    },
    {
      key: "matChannelA",
      valueType: "enum",
      defaultValue: "0",
      options: new Array(numSlugs).fill(0).map((_, i) => ({
        label: `Slug ${i}`,
        value: `${i}`,
      })),
    },
    ...uniformsParamsConfig,
    {
      key: "isVisible",
      title: "Visible",
      valueType: "boolean",
      defaultValue: true,
    },
  ],
};
