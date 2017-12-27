var world;
var dt = 1 / 60;

var constraintDown = false;
var camera, scene, renderer, gplane=false, clickMarker=false;
var geometry, material, mesh;
var controls,time = Date.now();

var jointBody, constrainedBody, mouseConstraint;

var N = 1;

var container, camera, scene, renderer, projector;

// To be synced
var meshes=[], bodies=[];

// Initialize Three.js
//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

initCannon();
init();
animate();

function init() {

    projector = new THREE.Projector();

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // scene
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    scene.fog = new THREE.Fog( 0x000000, 500, 10000 );

    // camera
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.5, 10000 );
    camera.position.set(10, 2, 0);
    camera.quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    scene.add(camera);
    //Control settings
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = true;
    controls.dampingFactor = 0.125;
    controls.enableZoom = true;
    controls.rotateSpeed = 0.2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 2;
    controls.maxDistance = 200;
    // lights
    var light, materials;
    scene.add( new THREE.AmbientLight( 0x666666 ) );

    light = new THREE.DirectionalLight( 0xffffff, 1.75 );
    var d = 20;

    light.position.set( d, d, d );

    light.castShadow = true;
    //light.shadowCameraVisible = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;

    light.shadow.camera.far = 3*d;
    light.shadow.camera.near = d;

    scene.add( light );

    // floor
    geometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
    //geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );
    material = new THREE.MeshLambertMaterial( { color: 0x777777 } );
    markerMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
    //THREE.ColorUtils.adjustHSV( material.color, 0, 0, 0.9 );
    mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI / 2);
    mesh.receiveShadow = true;
    scene.add(mesh);

    // cubes
    var cubeGeo = new THREE.BoxGeometry( 1, 1, 1, 10, 10 );
    var cubeMaterial = new THREE.MeshPhongMaterial( { color: 0x888888 } );
    for(var i=0; i<N; i++){
        cubeMesh = new THREE.Mesh(cubeGeo, cubeMaterial);
        cubeMesh.castShadow = true;
        meshes.push(cubeMesh);
        scene.add(cubeMesh);
    }


    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( scene.fog.color );

    container.appendChild( renderer.domElement );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    window.addEventListener( 'resize', onWindowResize, false );

}

// This function creates a virtual movement plane for the mouseJoint to move in
function setScreenPerpCenter(point, camera) {
    // If it does not exist, create a new one
    if(!gplane) {
      var planeGeo = new THREE.PlaneGeometry(100,100);
      var plane = gplane = new THREE.Mesh(planeGeo,material);
      plane.visible = false; // Hide it..
      scene.add(gplane);
    }

    // Center at mouse position
    gplane.position.copy(point);

    // Make it face toward the camera
    gplane.quaternion.copy(camera.quaternion);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    //controls.handleResize();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    //controls.update();
    updatePhysics();
    render();
}

function updatePhysics(){
    world.step(dt);
    for(var i=0; i !== meshes.length; i++){
        meshes[i].position.copy(bodies[i].position);
        meshes[i].quaternion.copy(bodies[i].quaternion);
    }
}

function render() {
    renderer.render(scene, camera);
}

function initCannon(){
    // Setup our world
    world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;

    world.gravity.set(0,-10,0);
    world.broadphase = new CANNON.NaiveBroadphase();

    // Create boxes
    var mass = 5, radius = 1.3;
    boxShape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5));
    for(var i=0; i<N; i++){
        boxBody = new CANNON.Body({ mass: mass });
        boxBody.addShape(boxShape);
        boxBody.position.set(0,5,0);
        world.add(boxBody);
        bodies.push(boxBody);
    }

    // Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.add(groundBody);

    // Joint body
    var shape = new CANNON.Sphere(0.1);
    jointBody = new CANNON.Body({ mass: 0 });
    jointBody.addShape(shape);
    jointBody.collisionFilterGroup = 0;
    jointBody.collisionFilterMask = 0;
    world.add(jointBody)
}

function addMouseConstraint(x,y,z,body) {
  // The cannon body constrained by the mouse joint
  constrainedBody = body;

  // Vector to the clicked point, relative to the body
  var v1 = new CANNON.Vec3(x,y,z).vsub(constrainedBody.position);

  // Apply anti-quaternion to vector to tranform it into the local body coordinate system
  var antiRot = constrainedBody.quaternion.inverse();
  pivot = antiRot.vmult(v1); // pivot is not in local body coordinates

  // Move the cannon click marker particle to the click position
  jointBody.position.set(x,y,z);

  // Create a new constraint
  // The pivot for the jointBody is zero
  mouseConstraint = new CANNON.PointToPointConstraint(constrainedBody, pivot, jointBody, new CANNON.Vec3(0,0,0));

  // Add the constriant to world
  world.addConstraint(mouseConstraint);
}

// This functions moves the transparent joint body to a new postion in space
function moveJointToPoint(x,y,z) {
    // Move the joint body to a new position
    jointBody.position.set(x,y,z);
    mouseConstraint.update();
}

function removeJointConstraint(){
  // Remove constriant from world
  world.removeConstraint(mouseConstraint);
  mouseConstraint = false;
}
