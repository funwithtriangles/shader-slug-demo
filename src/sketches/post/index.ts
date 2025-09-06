import { Node } from "three/webgpu";
import {
  color,
  luminance,
  mix,
  sample,
  screenUV,
  texture,
  uniform,
  type ShaderNodeObject,
} from "three/tsl";
import { convertParamsToUniforms, updateUniforms } from "../slug/uniformsUtils";
import {
  gradientMapParamsConfig,
  HSLParamsConfig,
  logoParamsConfig,
  waterParamsConfig,
} from "./config";
import { hsl } from "./effects/hsl";
import { water } from "./effects/water";
import { Shoutout } from "./effects/shoutout";
import { gradientMap } from "./effects/gradientMap";
import Logo from "./effects/logo";

const uniformsParamsConfig = [
  ...HSLParamsConfig,
  ...waterParamsConfig,
  ...gradientMapParamsConfig,
  ...logoParamsConfig,
];

export default class Post {
  uniforms = convertParamsToUniforms(uniformsParamsConfig);
  water_waveTime = uniform(0);
  shoutout = new Shoutout();
  shoutoutTex = texture(this.shoutout.texture);
  logo = new Logo();

  constructor() {
    window._xray_mask = this.shoutoutTex.context({ getUV: () => screenUV }).r;
    console.log(window._xray_mask);
  }

  getWebGPUPass(prevPass: ShaderNodeObject<Node>): ShaderNodeObject<Node> {
    let p = prevPass;

    // console.log();
    p = water(
      p.getTextureNode(),
      this.uniforms.water_intensity,
      this.water_waveTime
    );

    p = gradientMap(
      p,
      this.uniforms.gradientMap_intensity,
      this.uniforms.gradientMap_color0,
      this.uniforms.gradientMap_pos0,
      this.uniforms.gradientMap_color1,
      this.uniforms.gradientMap_pos1,
      this.uniforms.gradientMap_color2,
      this.uniforms.gradientMap_pos2
    );

    p = hsl(
      p,
      this.uniforms.hsl_hue,
      this.uniforms.hsl_saturation,
      this.uniforms.hsl_luminance
    );

    const logoTex = texture(this.logo.texture);

    p = mix(p, this.shoutoutTex, this.shoutoutTex.a);
    p = mix(p, logoTex, logoTex.a.mul(this.uniforms.logo_opacity));

    return p;
  }

  update({ params, deltaFrame, scene }) {
    this.water_waveTime.value += params.water_speed * deltaFrame;

    this.shoutout.update({
      params: {
        message: params.shoutout_message,
        scrollSpeed: params.shoutout_scrollSpeed,
        color: params.shoutout_color,
        positionX: params.shoutout_positionX,
        positionY: params.shoutout_positionY,
        scale: params.shoutout_scale,
        rotation: params.shoutout_rotation,
        opacity: params.shoutout_opacity,
      },
    });

    this.logo.update({ scene, params: { scale: params.logo_scale } });

    updateUniforms(uniformsParamsConfig, this.uniforms, params);
  }
}
