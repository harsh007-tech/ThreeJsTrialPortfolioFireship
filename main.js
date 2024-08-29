import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene, camera, renderer, controls, torus, moon, profileCube;

function initializeScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

    // Basic Setup
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);
    camera.position.setX(-3);

    controls = new OrbitControls(camera, renderer.domElement);
}

function createTorus() {
    const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
    torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);
}

function setupLights() {
    const mainLight = new THREE.PointLight(0xffffff, 2); // Main Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Helper Light
    const mainLightHelper = new THREE.PointLightHelper(mainLight);
    const gridHelper = new THREE.GridHelper(200, 50); // Adds Grid-like appearance
    const secondaryLight = new THREE.PointLight(0xffffff, 1.5);
    const secondaryLightHelper = new THREE.PointLightHelper(secondaryLight);
    const tertiaryLight = new THREE.PointLight(0xffffff, 1.5);
    const tertiaryLightHelper = new THREE.PointLightHelper(tertiaryLight);

    mainLight.position.set(5, 5, 5);
    secondaryLight.position.set(-20, 10, 10);
    tertiaryLight.position.set(-10, 10, -10);

    scene.add(
              mainLight,mainLightHelper,
              secondaryLight,secondaryLightHelper,
              tertiaryLight,tertiaryLightHelper, 
              ambientLight,gridHelper
             );
    
}

function addStars() {
    const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
    const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    for (let i = 0; i < 200; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial);
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
        star.position.set(x, y, z);
        scene.add(star);
    }
}

function setBackgroundImage() {
    const spaceTexture = new THREE.TextureLoader().load('space_image_01.jpg');
    scene.background = spaceTexture;
}

function createProfileCube() {
    const profileTexture = new THREE.TextureLoader().load('harsh_circle.png');
    profileCube = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshBasicMaterial({ map: profileTexture })
    );
    profileCube.position.set(2, 0, -5);
    scene.add(profileCube);
}

function createMoon() {
    const moonTexture = new THREE.TextureLoader().load('moon_01.jpg');
    const normalMap = new THREE.TextureLoader().load('normal.jpg');
    moon = new THREE.Mesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalMap })
    );
    moon.position.set(-10, 0, 30);
    scene.add(moon);
}

function moveCamera() {
    const scrollPosition = document.body.getBoundingClientRect().top;

    moon.rotation.x += 0.005;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.005;

    profileCube.rotation.x += 0.01;

    camera.position.z = scrollPosition * -0.01;
    camera.position.x = scrollPosition * -0.0002;
    camera.position.y = scrollPosition * -0.0002;
}

function animateScene() {
    requestAnimationFrame(animateScene);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    controls.update();
    renderer.render(scene, camera);
}
// Setup and run the scene
initializeScene();
setupLights();
createTorus();
addStars();
setBackgroundImage();
createProfileCube();
createMoon();

document.body.onscroll = moveCamera;
animateScene();
