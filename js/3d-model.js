const container = document.getElementById('3d-container');

// Comprobamos si el contenedor existe para evitar errores en otras páginas
if (container) {
    // 1. Escena
    const scene = new THREE.Scene();

    // 2. Cámara
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 4;

    // 3. Renderizador
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 4. Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 5. Creación del "Alfajor" (Grupo)
    const alfajorGroup = new THREE.Group();

    const masaMaterial = new THREE.MeshLambertMaterial({ color: 0xD4A373 }); // Tapitas
    const dulceMaterial = new THREE.MeshLambertMaterial({ color: 0x4A2511 }); // Relleno

    const tapaGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 32);
    const rellenoGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.4, 32);

    const tapaSup = new THREE.Mesh(tapaGeo, masaMaterial);
    tapaSup.position.y = 0.35;

    const relleno = new THREE.Mesh(rellenoGeo, dulceMaterial);
    relleno.position.y = 0;

    const tapaInf = new THREE.Mesh(tapaGeo, masaMaterial);
    tapaInf.position.y = -0.35;

    alfajorGroup.add(tapaSup);
    alfajorGroup.add(relleno);
    alfajorGroup.add(tapaInf);

    // Inclinamos el alfajor levemente hacia el frente
    alfajorGroup.rotation.x = 0.5;
    scene.add(alfajorGroup);

    // 6. Animación
    function animate() {
        requestAnimationFrame(animate);
        // Rotación constante sobre el eje Y
        alfajorGroup.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();

    // 7. Ajustar la cámara al redimensionar la pantalla
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}