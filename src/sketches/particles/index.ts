import * as THREE from "three";
import { MathNodeParameter } from "three/src/nodes/TSL.js";
import {
  abs,
  add,
  clamp,
  color,
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

interface UpdateParams {
  params: Record<string, any>;
  deltaFrame: number;
}

const stroke = (
  p: MathNodeParameter,
  size: MathNodeParameter,
  edge: MathNodeParameter
) => {
  const d = step(p, add(size, edge)).sub(step(p, sub(size, edge)));
  return clamp(d, 0, 1);
};

const hexSDF = (st: MathNodeParameter) => {
  st = mul(st, 2.0).sub(1.0).abs();

  return max(abs(st.y), mul(st.x, 0.866025).add(mul(st.y, 0.5)));
};

export default class Particles {
  scene: THREE.Scene;
  particleMaterial = new SpriteNodeMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  instancedSprite = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    this.particleMaterial
  );
  root = new THREE.Group();

  constructor() {
    const zRange = float(100);
    const xyRange = 100;
    this.instancedSprite.count = 10000;
    this.root.add(this.instancedSprite);

    const startRange = range(0, zRange);
    const offsetRange = range(
      vec3(-xyRange, -xyRange, 0),
      vec3(xyRange, xyRange, 0)
    );
    const scale = range(0.1, 1);

    const speed = uniform(5);
    const scaledTime = time.add(5).mul(speed);

    // const lifeTime = scaledTime.add(lifeRange);
    const posZ = startRange.add(scaledTime).mod(zRange).sub(zRange.mul(0.5));
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
      return vec4(vec3(0.5, 0.7, 0.6), alphaFinal);
    })();

    this.particleMaterial.opacityNode = Fn(() => {
      const d = float(0.05);
      return densityFogFactor(d).oneMinus();
    })();

    this.particleMaterial.positionNode = offsetRange.sub(vec3(0, 0, posZ));
    this.particleMaterial.rotationNode = vec3(0, 2, 0);
    this.particleMaterial.scaleNode = scale;
  }

  update({ params: p, deltaFrame: f }: UpdateParams) {}
}
function tslFn(arg0: () => any) {
  throw new Error("Function not implemented.");
}
