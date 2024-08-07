import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

@Component({
  selector: 'app-model-simple-load',
  templateUrl: './model-simple-load.component.html',
  styleUrls: ['./model-simple-load.component.css']
})
export class ModelSimpleLoadComponent implements OnInit {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls | null = null;
  private composer: EffectComposer;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.composer = new EffectComposer(this.renderer); 
  }

  ngOnInit(): void {
    this.initScene();
    this.loadLocalModel(); // Cargar modelo local
    this.animate();
  }

  private initScene(): void {
    // Configurar la cámara
    this.camera.position.set(0, 0, 5);
  
    // Configurar el renderizador
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xeeeeee);
    //this.renderer.setClearColor(0xffffff);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
    document.getElementById('modelContainer')?.appendChild(this.renderer.domElement);
  
    // Añadir luz
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(1, 1, 1).normalize();
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048; // Resolución del mapa de sombras
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;      // Distancias del plano de sombras
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    this.scene.add(directionalLight);
  
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  
    // Añadir controles de órbita
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;
  
    // Configurar el post-procesamiento
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
  
    /* para resaltar brillo
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.1,
      0.1,
      0.1
    );
    this.composer.addPass(bloomPass);*/
  }
  
  

  /* Respaldo: Se mira más o menos
  
  private initScene(): void {
    // Configurar la cámara
    this.camera.position.set(0, 0, 5);

    // Configurar el renderizador
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff); // Establece el color de fondo del renderizador a blanco
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    document.getElementById('modelContainer')?.appendChild(this.renderer.domElement);

    // Añadir luz
    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Luz ambiental
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5); // Luz direccional
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);

    // Añadir controles de órbita
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Suaviza el movimiento
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    // Configurar post-procesamiento
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
  }
    
  private animate(): void {
    requestAnimationFrame(() => this.animate());
    if (this.controls) {
      this.controls.update(); // Actualiza los controles si están inicializados
    }
    this.composer.render(); // Usar el compositor para renderizado
  }
  
  */

  private loadLocalModel(): void {
    // URL del modelo GLB local
    //const url = 'assets/model3d/volkswagen_golf_gl_1990.glb';
    
    //const url = 'assets/model3d/700_follower_special_van_downloadable_4k.glb';
    const url = 'assets/model3d/wolverine.glb';
    //const url = 'assets/model3d/deadpool.glb';
    

    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      this.scene.add(gltf.scene);
    }, undefined, (error) => {
      console.error('Error al cargar el modelo GLB', error);
    });
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    if (this.controls) {
      this.controls.update(); // Actualiza los controles si están inicializados
    }
    this.composer.render(); // Usar el compositor para renderizado
  }


}
