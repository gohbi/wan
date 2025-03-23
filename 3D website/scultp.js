import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
import { OBJExporter } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/exporters/OBJExporter.js';

// Setup Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("3d-container").appendChild(renderer.domElement);

// Create Sculptable Mesh
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lighting
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Camera Position
camera.position.z = 3;

// Simple Sculpting (Click to push vertices)
document.addEventListener("click", (event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Convert Mouse Position to 3D Space
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(mesh);
    if (intersects.length > 0) {
        let point = intersects[0].point;
        let vertices = mesh.geometry.attributes.position.array;

        // Push nearest vertex outward
        for (let i = 0; i < vertices.length; i += 3) {
            let dx = vertices[i] - point.x;
            let dy = vertices[i + 1] - point.y;
            let dz = vertices[i + 2] - point.z;
            let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < 0.1) {
                vertices[i] += dx * 0.1;
                vertices[i + 1] += dy * 0.1;
                vertices[i + 2] += dz * 0.1;
            }
        }
        mesh.geometry.attributes.position.needsUpdate = true;
    }
});

// Export Model as .OBJ
document.getElementById("export-btn").addEventListener("click", () => {
    const exporter = new OBJExporter();
    const result = exporter.parse(mesh);
    const blob = new Blob([result], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sculpt.obj';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
