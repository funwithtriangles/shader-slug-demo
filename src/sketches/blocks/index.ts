import * as THREE from "three";
import { MeshBasicNodeMaterial } from "three/webgpu";

interface UpdateParams {
  params: Record<string, any>;
  deltaFrame: number;
}

export default class Blocks {
  count = 10000;
  material = new MeshBasicNodeMaterial({
    wireframe: true,
  });
  instancedMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    this.material,
    this.count
  );
  root = new THREE.Group();
  dummy = new THREE.Object3D();
  zTime = 0;
  rotTime = 0;

  constructor() {
    this.root.add(this.instancedMesh);

    this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }

  update({ params: p, deltaFrame: f }: UpdateParams) {
    const rad = 10;
    this.zTime += f * p.speed;
    this.rotTime += f * p.rotSpeed;

    // const sc = Math.sin(this.tick) * 3;
    const sc = p.scale;

    for (let i = 0; i < this.count; i++) {
      const z = ((i * 0.1 + this.zTime) % 1000) - 500;
      const x = Math.sin(i) * rad;
      const y = Math.cos(i) * rad;

      this.dummy.position.set(x, y, -z);
      this.dummy.scale.set(sc, sc, sc);
      this.dummy.rotation.set(this.rotTime * 0.1, this.rotTime * 0.2, 0);
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
    }
  }
}
