import {
  color,
  Fn,
  mix,
  mx_noise_float,
  positionLocal,
  screenUV,
  ShaderNodeObject,
  step,
  time,
} from "three/tsl";
import { Color, UniformNode } from "three/webgpu";

interface WaveyUniforms {
  bigNoiseAmp: ShaderNodeObject<UniformNode<number>>;
  noiseTime: ShaderNodeObject<UniformNode<number>>;
  smallNoiseAmp: ShaderNodeObject<UniformNode<number>>;
}

export const noiseTexture = ({
  bigNoiseAmp,
  noiseTime,
  smallNoiseAmp,
}: WaveyUniforms) => {
  return Fn(() => {
    const t = time;

    const bigWaves = mx_noise_float(
      positionLocal.xy.div(bigNoiseAmp).add(noiseTime.mul(0.1)),
      5,
      2
    );
    const texSpace = positionLocal.xy.add(bigWaves).add(noiseTime);
    const noiseStripesMap = mx_noise_float(
      texSpace.add(noiseTime.mul(1.5)).div(smallNoiseAmp),
      20,
      1
    );
    return noiseStripesMap;
  })();
};
