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

    /*
    TODO: 
    Make stripes more spaced out
    add noise to wipe, so different stripes are targeted at different times
    might need to mix in the same waves to the wipe so it matches the stripes
    */
    const wavesTime = sin(positionLocal.y.mul(0.7)).mul(2);
    const waveyTime = straightStripes;
    const wipeTime = noiseTime.mul(0.5).add(stripesMap.mul(2));

    const wipeY = smoothstep(
      0.2,
      0.3,
      sin(positionLocal.y.mul(0.5).add(wipeTime))
    );
    const wipe = max(0, wipeY);

    return mix(stripes, 0, wipe.oneMinus());
  })();
};
