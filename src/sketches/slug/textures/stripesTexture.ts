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

    const waves = sin(positionLocal.y.mul(0.7)).mul(5);
    const noiseStripesMap = sin(positionLocal.x.mul(5).add(waves));
    const stripes = mix(0, 1, noiseStripesMap);

    /*
    TODO: 
    Make stripes more spaced out
    add noise to wipe, so different stripes are targeted at different times
    might need to mix in the same waves to the wipe so it matches the stripes
    */
    const wipeY = positionLocal.y.mul(0.1).add(noiseTime.mul(2));
    const wipe = max(0, sin(wipeY));
    return mix(stripes, 0, wipe.oneMinus());
  })();
};
