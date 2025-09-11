import * as THREE from "three";
import { range, time, uniform } from "three/tsl";
import { SpriteNodeMaterial } from "three/webgpu";

interface UpdateParams {
  params: Record<string, any>;
  deltaFrame: number;
}

export default class Particles {
  scene: THREE.Scene;
  particleMaterial = new SpriteNodeMaterial();
  instancedSprite = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    this.particleMaterial
  );
  root = new THREE.Group();

  constructor() {
    this.instancedSprite.count = 1000;
    this.root.add(this.instancedSprite);

    const lifeRange = range(0.1, 1);
    const offsetRange = range(
      new THREE.Vector3(-2, 3, -2),
      new THREE.Vector3(2, 5, 2)
    );

    const speed = uniform(0.2);
    const scaledTime = time.add(5).mul(speed);

    const lifeTime = scaledTime.mul(lifeRange).mod(1);
    const scaleRange = range(0.3, 2);
    const rotateRange = range(0.1, 4);

    const life = lifeTime.div(lifeRange);

    this.particleMaterial.positionNode = offsetRange.mul(lifeTime);
  }

  update({ params: p, deltaFrame: f }: UpdateParams) {}
}
