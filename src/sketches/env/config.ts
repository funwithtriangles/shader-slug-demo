import { convertParamsToUniforms } from "../slug/uniformsUtils";

export const uniformsParamsConfig = [
  {
    key: "color",
    defaultValue: [1, 0, 0],
    valueType: "rgb",
  },
] as const;

export default {
  title: "Env",
  description: "Environment",
  params: [
    ...uniformsParamsConfig,
    {
      key: "intensity",
      defaultValue: 1.0,
    },
  ],
};

export const sketchUniforms = convertParamsToUniforms([
  ...uniformsParamsConfig,
]);
