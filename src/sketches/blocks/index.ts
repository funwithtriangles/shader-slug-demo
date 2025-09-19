import * as THREE from "three";
import { MeshNormalNodeMaterial } from "three/webgpu";

interface UpdateParams {
  params: Record<string, any>;
  deltaFrame: number;
}

export default class Blocks {
  count = 10000;
  material = new MeshNormalNodeMaterial();
  instancedMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    this.material,
    this.count
  );
  root = new THREE.Group();
  dummy = new THREE.Object3D();
  tick = 0;

  constructor() {
    this.root.add(this.instancedMesh);

    this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }

  update({ params: p, deltaFrame: f }: UpdateParams) {
    const rad = 10;
    this.tick += f * p.speed;

    // const sc = Math.sin(this.tick) * 3;
    const sc = p.scale;

    for (let i = 0; i < this.count; i++) {
      const z = ((i * 0.1 + this.tick) % 1000) - 500;
      const x = Math.sin(i) * rad;
      const y = Math.cos(i) * rad;

      this.dummy.position.set(x, y, z);
      this.dummy.scale.set(sc, sc, sc);
      this.dummy.rotation.set(this.tick * 0.1, this.tick * 0.2, 0);
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
    }
  }
}
