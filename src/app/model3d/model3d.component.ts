import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

@Component({
  selector: 'app-model3d',
  templateUrl: './model3d.component.html',
  styleUrls: ['./model3d.component.css']
})
export class Model3dComponent implements OnInit {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
  }

  ngOnInit(): void {
    this.initThreeJS();
    this.loadGenericModel(); // Cargar modelo genérico
    this.generateCustomModel(); // Generar modelo personalizado
    this.animate();
  }

  private initThreeJS(): void {
    // Crear la escena
    this.scene = new THREE.Scene();

    // Configurar la cámara
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // Configurar el renderizador
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const container = document.getElementById('modelContainer');
    if (container) {
      container.appendChild(this.renderer.domElement);
    } else {
      console.error("El elemento 'modelContainer' no se encontró en el DOM.");
    }

    // Añadir luz
    const light = new THREE.AmbientLight(0xffffff);
    this.scene.add(light);
  }

  private loadGenericModel(): void {
    // Cargar un modelo 3D genérico de una ruta predefinida
    const loader = new STLLoader();
    loader.load('path/to/generic/model.stl', (geometry) => {
      const material = new THREE.MeshNormalMaterial();
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
    });
  }

  private generateCustomModel(): void {
    // Generar un modelo 3D basado en parámetros predefinidos
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

}
