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
  waveAmp: ShaderNodeObject<UniformNode<number>>;
  waveLength: ShaderNodeObject<UniformNode<number>>;
  stripeLength: ShaderNodeObject<UniformNode<number>>;
  stripeOffset: ShaderNodeObject<UniformNode<number>>;
  stripeTime: ShaderNodeObject<UniformNode<number>>;
  colorA: ShaderNodeObject<UniformNode<Color>>;
  colorB: ShaderNodeObject<UniformNode<Color>>;
}

export const stripesTexture = ({
  waveAmp,
  waveLength,
  stripeTime,
  stripeLength,
  stripeOffset,
  colorA,
  colorB,
}: WaveyUniforms) => {
  return Fn(() => {
    const t = time;

    const waves = sin(positionLocal.y.mul(waveLength)).mul(waveAmp);
    const straightStripes = positionLocal.x.mul(2);
    const stripesMap = straightStripes.add(waves);
    const stripes = smoothstep(0.9, 1.0, sin(stripesMap));

    const wipeTime = stripeTime.mul(0.5).add(stripesMap.mul(2));

    const pulseOffset = wipeTime.add(stripesMap.mul(stripeOffset));

    const wipeY = sin(positionLocal.y.mul(stripeLength).add(pulseOffset));

    const wipe = max(0, wipeY);

    const mask = mix(stripes, 0, wipe.oneMinus());

    return mix(colorA, colorB, mask);
  })();
};
