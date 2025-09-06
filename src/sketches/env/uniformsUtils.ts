import { uniform } from "three/tsl";
import { Color } from "three/webgpu";

// Define the shape of a uniform parameter with better typing
interface UniformParamConfig {
  key: string;
  defaultValue: any;
  valueType?: "rgb" | "number";
}

// Helper type to infer the correct uniform type based on valueType
type UniformValueType<T extends UniformParamConfig> =
  T["valueType"] extends "rgb"
    ? Color
    : T["valueType"] extends "number"
    ? number
    : T["defaultValue"];

// Create a mapped type that converts the params array to the correct uniform object shape
type UniformsFromParams<T extends readonly UniformParamConfig[]> = {
  [K in T[number]["key"]]: ReturnType<
    typeof uniform<UniformValueType<Extract<T[number], { key: K }>>>
  >;
};

export const convertParamsToUniforms = <
  T extends readonly UniformParamConfig[]
>(
  params: T
): UniformsFromParams<T> => {
  const uniforms = {} as UniformsFromParams<T>;
  for (const param of params) {
    switch (param.valueType) {
      case "rgb":
        uniforms[param.key] = uniform(new Color(...param.defaultValue));
        break;
      case "number":
      default:
        uniforms[param.key] = uniform(param.defaultValue);
        break;
    }
  }

  return uniforms;
};

export const updateUniforms = (
  uniformParamConfig: readonly UniformParamConfig[],
  uniforms: UniformsFromParams<any>,
  params: any
) => {
  for (const cfg of uniformParamConfig) {
    if (!(cfg.key in params)) continue;
    switch (cfg.valueType) {
      case "rgb":
        uniforms[cfg.key].value.set(...params[cfg.key]);
        break;
      case "number":
      default:
        uniforms[cfg.key].value = params[cfg.key];
        break;
    }
  }
};
