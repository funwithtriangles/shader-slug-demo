import * as THREE from "three";

interface CameraConstructorParams {
  camera: THREE.Camera;
  scene: THREE.Scene;
}

interface UpdateParams {
  params: Record<string, any>;
  deltaFrame: number;
}

export default class Camera {
  root: THREE.Group;
  scene: THREE.Scene;
  camera: THREE.Camera;
  lookAtPos: THREE.Vector3;
  orbitDelta: number;
  head: THREE.Object3D | null = null;
  currentMode: "orbit" | "closeUp" = "orbit";

  constructor({ camera, scene }: CameraConstructorParams) {
    this.root = new THREE.Group();
    this.scene = scene;
    this.scene.add(camera);

    this.camera = camera;
    this.lookAtPos = new THREE.Vector3();

    this.orbitDelta = 0;

    // Hack to position cameras on JBoys head
    setTimeout(() => {
      const item = scene.getObjectByName("mixamorigHead");
      if (item) {
        this.head = item;
      }
    }, 3000);
  }

  closeUp() {
    if (this.head) {
      this.head.add(this.camera);
      this.currentMode = "closeUp";
    }
  }

  orbitCam() {
    this.scene.add(this.camera);
    this.currentMode = "orbit";
  }

  update({ params: p, deltaFrame: f }: UpdateParams) {
    this.orbitDelta += f * p.rotSpeed;

    if (this.currentMode != p.mode) {
      if (p.mode === "closeUp") {
        this.closeUp();
      } else {
        this.orbitCam();
      }
    }

    if (this.currentMode === "orbit") {
      const x = Math.sin(this.orbitDelta) * p.orbitRad * p.bigZoom;
      const z = Math.cos(this.orbitDelta) * p.orbitRad * p.bigZoom;
      this.lookAtPos.set(0, p.lookAtPosY, 0);
      this.camera.position.set(x, p.camY, z);
      this.camera.lookAt(this.lookAtPos);
    } else {
      this.camera.rotation.set(0, 0, 0);
      this.camera.position.set(0, 0, p.headCamDistance * 80);
    }
  }
}
