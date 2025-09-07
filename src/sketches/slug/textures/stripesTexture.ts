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
  smoothstep,
  min,
  max,
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

    const waves = sin(positionLocal.y.mul(0.7)).mul(2);
    const straightStripes = positionLocal.x.mul(2);
    const stripesMap = straightStripes.add(waves);
    const stripes = smoothstep(0.9, 1.0, sin(stripesMap));

    const wipeTime = noiseTime.mul(0.5).add(stripesMap.mul(2));

    const pulseOffset = wipeTime.add(stripesMap.mul(0.3));

    const wipeY = sin(positionLocal.y.mul(0.5).add(pulseOffset));

    const wipe = max(0, wipeY);

    // return wipe;

    const mask = mix(stripes, 0, wipe.oneMinus());

    return mix(colorA, colorB, mask);
  })();
};
