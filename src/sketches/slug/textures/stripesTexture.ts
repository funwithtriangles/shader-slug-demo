import {
  color,
  Fn,
  mix,
  mx_noise_float,
  positionLocal,
  positionWorld,
  screenUV,
  ShaderNodeObject,
  step,
  sin,
  time,
  vec3,
} from "three/tsl";
import { Color, UniformNode } from "three/webgpu";

interface WaveyUniforms {
  bigNoiseAmp: ShaderNodeObject<UniformNode<number>>;
  noiseTime: ShaderNodeObject<UniformNode<number>>;
  smallNoiseAmp: ShaderNodeObject<UniformNode<number>>;
  colorA: ShaderNodeObject<UniformNode<Color>>;
  colorB: ShaderNodeObject<UniformNode<Color>>;
}

export const stripesTexture = ({
  bigNoiseAmp,
  noiseTime,
  smallNoiseAmp,
  colorA,
  colorB,
}: WaveyUniforms) => {
  return Fn(() => {
    const t = time;

    const waves = sin(positionLocal.z.mul(2)).mul(5);
    const noiseStripesMap = sin(positionLocal.x.mul(5).add(waves));
    return mix(colorA, colorB, noiseStripesMap);
  })();
};
