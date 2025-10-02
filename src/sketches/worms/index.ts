import * as THREE from "three";
import { MathNodeParameter } from "three/src/nodes/TSL.js";
import {
  abs,
  add,
  clamp,
  color,
  cos,
  densityFogFactor,
  float,
  Fn,
  fog,
  hash,
  instanceIndex,
  max,
  mix,
  mul,
  positionView,
  range,
  sin,
  smoothstep,
  step,
  sub,
  time,
  uniform,
  uv,
  vec3,
  vec4,
} from "three/tsl";
import { SpriteNodeMaterial } from "three/webgpu";
import config from "./config";
import { convertParamsToUniforms, updateUniforms } from "../slug/uniformsUtils";

interface UpdateParams {
  params: Record<string, any>;
  deltaFrame: number;
}

const wormLength = 20;
const numWorms = 1000;
const instanceCount = wormLength * numWorms;

export default class Worms {
  uniforms = convertParamsToUniforms(config.params);
  particleMaterial = new SpriteNodeMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  instancedSprite = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    this.particleMaterial
  );
  root = new THREE.Group();
  particleTime = uniform(0);
  swimTime = uniform(0);

  constructor() {
    const xRange = 100;
    const yRange = 100;
    const zRange = float(100);
    this.instancedSprite.count = instanceCount;
    this.root.add(this.instancedSprite);

    const startRange = hash(instanceIndex.div(numWorms)).mul(zRange);
    // const baseX = hash(instanceIndex.div(wormLength)).sub(0.5).mul(xRange);
    const baseX = hash(instanceIndex.add(321).div(wormLength))
      .sub(0.5)
      .mul(xRange);
    const baseY = hash(instanceIndex.div(wormLength)).sub(0.5).mul(yRange);

    const scale = range(0.1, 1);

    // const lifeTime = scaledTime.add(lifeRange);
    const basePosZ = startRange
      .add(this.particleTime)
      .mod(zRange)
      .sub(zRange.mul(0.5));
    // const scaleRange = range(0.3, 2);
    // const rotateRange = range(0.1, 4);

    // const life = lifeTime.div(lifeRange);

    this.particleMaterial.transparent = true;

    this.particleMaterial.colorNode = Fn(() => {
      const solidAlpha = float(1);
      const ringRad = float(0.05);
      const ringThickness = float(0.01);
      const glowSpread = float(0.02);
      const opacity = float(0.2);

      const distanceToCenter = uv().sub(0.5).length();

      const alphaSolid = step(ringRad.div(2), distanceToCenter)
        .oneMinus()
        .mul(solidAlpha);

      // const alphaSolid = stroke(distanceToCenter, ringRad, ringThickness).mul(
      //   solidAlpha
      // );

      // const alphaSolid = stroke(hexSDF(uv()), 0.8, 0.02);

      const alphaGlow = glowSpread.div(distanceToCenter).sub(glowSpread.mul(2));
      alphaGlow.mulAssign(alphaSolid.oneMinus());
      ``;
      const alphaFinal = max(alphaGlow, alphaSolid).mul(opacity);

      const finalColor = mix(vec3(1, 1, 1), vec3(1, 1, 1), 1);
      // return vec4(1, 0, 0);
      return vec4(vec3(this.uniforms.color), alphaFinal);
    })();

    this.particleMaterial.opacityNode = Fn(() => {
      const d = float(0.05);
      return densityFogFactor(d).oneMinus();
    })();

    const delta = float(instanceIndex).mul(0.05);

    // this.particleMaterial.positionNode = offsetRange.sub(vec3(0, 0, basePosZ));
    this.particleMaterial.positionNode = vec3(
      baseX.add(cos(delta.add(this.swimTime).mul(0.7))),
      baseY.add(sin(delta.add(this.swimTime))),
      basePosZ.add(cos(delta.add(this.swimTime)))
    );
    this.particleMaterial.rotationNode = vec3(0, 2, 0);
    this.particleMaterial.scaleNode = scale;
  }

  update({ params: p, deltaFrame: f }: UpdateParams) {
    this.particleTime.value += p.speed * f;
    this.swimTime.value += p.swimSpeed * f;

    updateUniforms(config.params, this.uniforms, p);
  }
}
