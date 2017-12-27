var camera, scene, renderer, gplane=false, clickMarker=false;
var controls,time = Date.now();
init();
animate();
function init() {
    var shadowRes = 2048;
    projector = new THREE.Projector();

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // scene
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    scene.fog = new THREE.Fog( 0x000000, 50, 150 );

    // camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(16, 55, 38);
    camera.lookAt( new THREE.Vector3(camera.position.x, camera.position.y-20, 0) );
    scene.add(camera);
    //controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    // controls.enabled = false;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 7;
    controls.maxDistance = 240;
    controls.maxPolarAngle = Math.PI * 0.5;
    // lights
    //spotlight
    var spotLight = new THREE.SpotLight( 0xffffff, 2 );
    spotLight.position.set(0, 100, 0);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    spotLight.shadow.mapSize.width = shadowRes;
    spotLight.shadow.mapSize.height = shadowRes;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.lookAt(new THREE.Vector3( 0, 0, 0 ) );
    scene.add(spotLight);

    //HemisphereLight
    var hemi = new THREE.HemisphereLight( 0x6688BB, 0x181844, 0.25 );
    scene.add( hemi );

    //ground
    var darkColor = new THREE.Color(0x333742).multiplyScalar( 1.5 );
    var groundBox = new THREE.Mesh(new THREE.BoxGeometry(1000, 40, 1000), new THREE.MeshPhongMaterial({
     color: darkColor
    }));
    groundBox.castShadow = false;
    groundBox.receiveShadow = true;
    groundBox.position.y = -20;
    scene.add(groundBox);

    //test box
    var box = new THREE.Mesh(new THREE.BoxGeometry(10,10,10), new THREE.MeshBasicMaterial({
    color: 'red',
    wireframe: false,
    side: 2
    }))
    box.position.y = 5;
    box.castShadow = true;
    scene.add(box);


    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x333333, 0.1);

    container.appendChild( renderer.domElement );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    window.addEventListener( 'resize', onWindowResize, false );

}


function animate() {
    requestAnimationFrame( animate );
    controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}

function render() {
    renderer.render(scene, camera);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    //controls.handleResize();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
