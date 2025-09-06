import * as THREE from "three";

export class Shoutout {
  plane: THREE.Mesh;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  textX: number = 0;

  constructor() {
    // Create canvas for text texture
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1024;
    this.canvas.height = 512;
    this.context = this.canvas.getContext("2d")!;

    // Set up canvas styling
    this.context.font = '48px "Chivo Mono"';
    this.context.textAlign = "left"; // Change to left align for scrolling
    this.context.textBaseline = "middle";

    // Create texture from canvas
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.flipY = false;

    // Initialize text position to start from right edge
    this.textX = this.canvas.width;
  }

  update({
    params: p,
  }: {
    params: {
      message: string;
      color: [number, number, number];
      scrollSpeed: number;
      positionX: number;
      positionY: number;
      scale: number;
      rotation: number;
      opacity: number;
    };
  }) {
    this.context.fillStyle = `rgba(${p.color.map((c) => c * 255).join(", ")}, ${
      p.opacity
    })`;

    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Move text to the left
    this.textX -= p.scrollSpeed;

    // Calculate base position from manual positioning
    const baseX = p.positionX * this.canvas.width;
    const baseY = this.canvas.height / 2 + p.positionY * this.canvas.height;

    // Save the current context state
    this.context.save();

    // Apply transformations: translate to screen center, rotate, then translate to position and scale
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.context.rotate(p.rotation);
    this.context.translate(
      baseX - this.canvas.width / 2,
      baseY - this.canvas.height / 2
    );
    this.context.scale(p.scale, p.scale);

    // Get text width with current scaling applied
    const textWidth = this.context.measureText(p.message).width;

    // Reset position when text has completely scrolled off screen (accounting for scale)
    if (this.textX + textWidth < 0) {
      this.textX = this.canvas.width / p.scale;
    }

    // Draw the text with scrolling applied in the rotated coordinate space
    this.context.fillText(p.message, this.textX, 0);

    // Restore the context state
    this.context.restore();

    // Update texture
    this.texture.needsUpdate = true;
  }
}
