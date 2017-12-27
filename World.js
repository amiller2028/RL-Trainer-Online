//global variables
var mass = 1;

initPhysics();
initTHREE();

function initPhysics() {
  //world
  var world = new CANNON.World();

  //Gravity Setup
  world.gravity.set(0, 0, -9.82);

  //Broadphase Algorythm
  world.broadphase = new CANNON.NaiveBroadphase();

  //Physical Materials
  var physicsMaterial = new CANNON.Material("groundMaterial"); // others can be created for specific interactions
  var otherMaterial = new CANNON.Material("slipperyMaterial");

  //Contact Material (What materials can contact be detected by other materials)
  var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, 0.4, 0.0); //(Material1,Material2,Friction,Springiness)
  var anotherContactMaterial = new CANNON.ContactMaterial(physicsMaterial, otherMaterial, 0.0, 0.9); //(Material1,Material2,Friction,Springiness)

  //Add Contact Materials to the CANNON World
  world.addContactMaterial(physicsContactMaterial);
  world.addContactMaterial(anotherContactMaterial);

  //Physical Geometry
  var halfextents = new CANNON.Vec3(1, 1, 1); //(x,y,z) The numbers pluged in here are only half the size of the physical box extents
  var boxShape = new CANNON.Box(halfextents);

  //Rigid Body for collision detection
  var boxbody = new CANNON.Body(mass, boxShape);

}

function initTHREE(){
//THREEJS mesh to represent the physics object
var boxGeometry = new THREE.BoxGeometry(halfextents.x*2, halfextents.y*2, halfextents.z*2); //Create a new geometrical shape!
var box_mesh_material = new THREE.MeshLambertMaterial(); //Create the desired mesh material!
var box_mesh = new THREE.Mesh(boxGeometry, box_mesh_material); //Mesh it all up together!
}
