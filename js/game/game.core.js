/*
 * Game Core - Demo 1 (Simple demo)
 *
 * A simple example with basic controls (see game.core.demo1.js for a commented version of this file)
 */

window.game = window.game || {};

window.game.core = function () {
	var _game = {
		controls:null,
		controlKeys: {
			moveForward: "w",
			moveBackward: "s",
			moveLeft: "a",
			moveRight: "d",
			jump: "space"
		},
		controlKeysTest: {
			moveForward: 87,
			moveBackward: 83,
			moveLeft: 68,
			moveRight: 65,
			jump: "space"
		},
		showHitBoxes: true,
		info:null,
		car: {
			//Arrays that are used to hold bodies and meshes that will be updated
			body: null,
			mesh: null,

			//Car Attributes
			startPos: [0,0.6,0],
			axleSpacing: 1.5,
			groundClearance: 0.1,

			//speed attributes
			maxSpeed: 45,
			maxReverseSpeed: 30,

			//acceleration attributes
			forwardAcceleration: 10,
			reverseAcceleration: 8,
			forwardDecceleration: 5,
			reverseDecceleration: 5,

			//wheel Attributes
			maxWheelRotation: 0.6,

			//Wheel objects
			wheelSteeringRight: null,
			wheelSteeringRightMesh: null,
			joint1:null,
			joint2:null,
			joint3: null,
			joint4: null,
			wheelSteeringLeft: null,
			wheelSteeringLeftMesh: null,
			wheelBLBody: null,
			wheelBRBody: null,
			wheelFLBody: null,
			wheelFRBody: null,
			wheelBLMesh: null,
			wheelBRMesh: null,
			wheelFLMesh: null,
			wheelFRMesh: null,

			//Wheel Attributes
			wheelRadius: 0.25,
			wheelThickness:0.25,
			wheelMaterialGroup: 2,
			wheelCollidesWith: 1,

			//hitbox object
			hitBoxBody: null,
			hitBoxMesh: null,

			//Hitbox Attributes
			hitBoxLenght: 2,
			hitBoxWidth: 1,
			hitBoxHeight: 0.5,
			hitBoxMaterialGroup: 1,
			hitBoxCollidesWith: 1,

			create: function () {
				//hitbox ridgid body creation
				_game.car.hitBoxBody = _oimo.world.add({
				    type:'box', // type of shape : sphere, box, cylinder
				    size:[_game.car.hitBoxWidth,_game.car.hitBoxHeight,_game.car.hitBoxLenght], // size of shape
				    pos:_game.car.startPos, // start position in degree
				    rot:[0,0,0], // start rotation in degree
				    move:true, // dynamic or statique
				    density: 1,
				    friction: 0.2,
				    restitution: 0.5,
				    belongsTo: _game.car.hitBoxMaterialGroup, // The bits of the collision groups to which the shape belongs.
				    collidesWith:_game.car.hitBoxCollidesWith // The bits of the collision groups with which the shape collides.
				});

				//create a visual representation of the hitbox
				_game.car.hitBoxMesh = window.game.helpers.createHitBoxVisual(_game.car.hitBoxBody);//(body,material)

				//set the location of the car
				_game.car.hitBoxMesh.position.set(_game.car.startPos[0],_game.car.startPos[1],_game.car.startPos[2]);

				// add the hitbox object to the scene
				_three.scene.add( _game.car.hitBoxMesh );

				//wheel hitbox Back left
				_game.car.wheelBLBody = _oimo.world.add({
				    type:'cylinder', // type of shape : sphere, box, cylinder
				    size:[_game.car.wheelRadius,_game.car.wheelRadius,_game.car.wheelThickness], // size of shape [config,radius,height]
				    pos:[-((_game.car.hitBoxWidth/2) +( _game.car.wheelThickness/2))+ _game.car.startPos[0],(-(_game.car.wheelRadius)+_game.car.hitBoxHeight/2) - _game.car.groundClearance+ _game.car.startPos[1] ,_game.car.axleSpacing/2 + _game.car.startPos[2]], // start position [x,y,z]
				    rot:[0,0,270], // start rotation in degree
				    move:true, // dynamic or statique
				    density: 1,
				    friction: 0.9,
				    restitution: 0,
				    belongsTo: _game.car.wheelMaterialGroup, // The bits of the collision groups to which the shape belongs.
				    collidesWith: _game.car.wheelCollidesWith // The bits of the collision groups with which the shape collides.
				});

				//add the visual for the car hitbox
				_game.car.wheelBLMesh = window.game.helpers.createHitBoxVisual(_game.car.wheelBLBody);
				_three.scene.add(_game.car.wheelBLMesh);

				//create joint for Back left wheel
				_game.car.joint4 = _oimo.world.add({
		         type:'jointHinge',//jointWheel, jointDistance, jointHinge, jointPrisme, jointSlide, jointBall
		         body1:_game.car.hitBoxBody,
						 body2:_game.car.wheelBLBody,
						 axe1:[1,0,0],
						 axe2:[0,1,0],
		         pos1:[-((_game.car.hitBoxWidth/2) +( _game.car.wheelThickness/2)),(-(_game.car.wheelRadius)+_game.car.hitBoxHeight/2) - _game.car.groundClearance ,_game.car.axleSpacing/2],
		         pos2:[0,0,0],
						 //collission:false
		    });

				//construct the wheel steering objects
				_game.car.wheelSteeringLeft = _oimo.world.add({
						type:'sphere', // type of shape : sphere, box, cylinder
						size:[0.1,0.1,0.1], // size of shape [config,radius,height]
						pos:[-((_game.car.hitBoxWidth/2) +( _game.car.wheelThickness/2))+ _game.car.startPos[0],(-(_game.car.wheelRadius)+_game.car.hitBoxHeight/2) - _game.car.groundClearance+ _game.car.startPos[1] ,-(_game.car.axleSpacing/2 + _game.car.startPos[2])], // start position [x,y,z]
						rot:[0,0,0], // start rotation in degree
						move:true, // dynamic or statique
						density: 1,
						friction: 0.9,
						restitution: 0,
						belongsTo: 10, // The bits of the collision groups to which the shape belongs.
						collidesWith: 10 // The bits of the collision groups with which the shape collides.
				});
				//_game.car.wheelSteeringLefttMesh = window.game.helpers.createHitBoxVisual(_game.car.wheelSteeringLeft);
				var sphere = new THREE.SphereGeometry(0.1,16,16);
				_game.car.wheelSteeringLeftMesh =new THREE.Mesh(sphere,window.game.static.materials.wireframe());
				_three.scene.add(_game.car.wheelSteeringLeftMesh);

				//create a joint for the Steering
				_game.car.joint1 = _oimo.world.add({
						 type:'jointHinge',//jointWheel, jointDistance, jointHinge, jointPrisme, jointSlide, jointBall
						 body1:_game.car.hitBoxBody,
						 body2:_game.car.wheelSteeringLeft,
						 axe1:[0,1,0],
						 axe2:[0,1,0],
						 pos1:[-((_game.car.hitBoxWidth/2) +( _game.car.wheelThickness/2)),-_game.car.groundClearance ,-(_game.car.axleSpacing/2)],
						 pos2:[0,0,0],
						 collission:false
				});

				//construct the wheel steering objects
				_game.car.wheelSteeringRight = _oimo.world.add({
						type:'sphere', // type of shape : sphere, box, cylinder
						size:[0.1,0.1,0.1], // size of shape [config,radius,height]
						pos:[((_game.car.hitBoxWidth/2) +( _game.car.wheelThickness/2))+ _game.car.startPos[0],(-(_game.car.wheelRadius)+_game.car.hitBoxHeight/2) - _game.car.groundClearance+ _game.car.startPos[1] ,_game.car.axleSpacing/2 + _game.car.startPos[2]], // start position [x,y,z]
						rot:[0,0,0], // start rotation in degree
						move:true, // dynamic or statique
						density: 1,
						friction: 0.9,
						restitution: 0,
						belongsTo: 10, // The bits of the collision groups to which the shape belongs.
						collidesWith: 10 // The bits of the collision groups with which the shape collides.
				});
				//_game.car.wheelSteeringLefttMesh = window.game.helpers.createHitBoxVisual(_game.car.wheelSteeringLeft);
				var sphere = new THREE.SphereGeometry(0.1,16,16);
				_game.car.wheelSteeringRightMesh =new THREE.Mesh(sphere,window.game.static.materials.wireframe());
				_three.scene.add(_game.car.wheelSteeringRightMesh);

				//create a joint for the Steering
				_game.car.joint2 = _oimo.world.add({
						 type:'jointHinge',//jointWheel, jointDistance, jointHinge, jointPrisme, jointSlide, jointBall
						 body1:_game.car.hitBoxBody,
						 body2:_game.car.wheelSteeringRight,
						 axe1:[0,1,0],
						 axe2:[0,1,0],
						 pos1:[((_game.car.hitBoxWidth/2) +( _game.car.wheelThickness/2)),-_game.car.groundClearance ,-_game.car.axleSpacing/2 ],
						 pos2:[0,0,0],
						 collission:false
				});

				//set joint limits
				_game.car.joint1.limitMotor.setLimit(0,0);
				_game.car.joint2.limitMotor.setLimit(0,0);

				//wheel hitbox Front left
				_game.car.wheelFLBody = _oimo.world.add({
						type:'cylinder', // type of shape : sphere, box, cylinder
						size:[_game.car.wheelRadius,_game.car.wheelRadius,_game.car.wheelThickness], // size of shape [config,radius,height]
						pos:[-((_game.car.hitBoxWidth/2) +( _game.car.wheelThickness/2))+ _game.car.startPos[0],(-(_game.car.wheelRadius)+_game.car.hitBoxHeight/2) - _game.car.groundClearance+ _game.car.startPos[1] ,-(_game.car.axleSpacing/2 + _game.car.startPos[2])], // start position [x,y,z]
						rot:[0,0,270], // start rotation in degree
						move:true, // dynamic or statique
						density: 1,
						friction: 0.9,
						restitution: 0,
						belongsTo: _game.car.wheelMaterialGroup, // The bits of the collision groups to which the shape belongs.
						collidesWith: _game.car.wheelCollidesWith // The bits of the collision groups with which the shape collides.
				});
				//add the visual for the car hitbox
				_game.car.wheelFLMesh = window.game.helpers.createHitBoxVisual(_game.car.wheelFLBody);

				_three.scene.add(_game.car.wheelFLMesh);

				//create joint for Front left wheel
				var joint = _oimo.world.add({
						 type:'jointHinge',//jointWheel, jointDistance, jointHinge, jointPrisme, jointSlide, jointBall
						 body1:_game.car.wheelSteeringLeft,
						 body2:_game.car.wheelFLBody,
						 axe1:[1,0,0],
						 axe2:[0,1,0],
						 pos1:[0,0,0],
						 pos2:[0,0,0],
						 //collission:false
				});

				//wheel hitbox Back Right
				_game.car.wheelBRBody = _oimo.world.add({
				    type:'cylinder', // type of shape : sphere, box, cylinder
				    size:[_game.car.wheelRadius,_game.car.wheelRadius,_game.car.wheelThickness], // size of shape [config,radius,height]
				    pos:[((_game.car.hitBoxWidth/2) +( _game.car.wheelThickness/2))+ _game.car.startPos[0],(-(_game.car.wheelRadius)+_game.car.hitBoxHeight/2) - _game.car.groundClearance+ _game.car.startPos[1] ,_game.car.axleSpacing/2 + _game.car.startPos[2]], // start position [x,y,z]
				    rot:[0,0,270], // start rotation in degree
				    move:true, // dynamic or statique
				    density: 1,
				    friction: 1,
				    restitution: 0,
				    belongsTo: _game.car.wheelMaterialGroup, // The bits of the collision groups to which the shape belongs.
				    collidesWith: _game.car.wheelCollidesWith // The bits of the collision groups with which the shape collides.
				});

				//add the visual for the car hitbox
				_game.car.wheelBRMesh = window.game.helpers.createHitBoxVisual(_game.car.wheelBRBody);
				_three.scene.add(_game.car.wheelBRMesh);

				//create joint for Back Right wheel
				_game.car.joint3 = _oimo.world.add({
		         type:'jointHinge',//jointWheel, jointDistance, jointHinge, jointPrisme, jointSlide, jointBall
		         body1:_game.car.hitBoxBody,
						 body2:_game.car.wheelBRBody,
						 axe1:[1,0,0],
						 axe2:[0,1,0],
		         pos1:[((_game.car.hitBoxWidth/2) +( _game.car.wheelThickness/2)),(-(_game.car.wheelRadius)+_game.car.hitBoxHeight/2) - _game.car.groundClearance ,_game.car.axleSpacing/2],
		         pos2:[0,0,0],
						 //collission:false
		    });



				//wheel hitbox Front Right
				_game.car.wheelFRBody = _oimo.world.add({
				    type:'cylinder', // type of shape : sphere, box, cylinder
				    size:[_game.car.wheelRadius,_game.car.wheelRadius,_game.car.wheelThickness], // size of shape [config,radius,height]
				    pos:[((_game.car.hitBoxWidth/2) +( _game.car.wheelThickness/2))+ _game.car.startPos[0],(-(_game.car.wheelRadius)+_game.car.hitBoxHeight/2) - _game.car.groundClearance+ _game.car.startPos[1] ,_game.car.axleSpacing/2 + _game.car.startPos[2]], // start position [x,y,z]
				    rot:[0,0,270], // start rotation in degree
				    move:true, // dynamic or statique
				    density: 1,
				    friction: 0.9,
				    restitution: 0,
				    belongsTo: _game.car.wheelMaterialGroup, // The bits of the collision groups to which the shape belongs.
				    collidesWith: _game.car.wheelCollidesWith // The bits of the collision groups with which the shape collides.
				});

				//add the visual for the car hitbox
				_game.car.wheelFRMesh = window.game.helpers.createHitBoxVisual(_game.car.wheelFRBody);
				_three.scene.add(_game.car.wheelFRMesh);

				//create joint for Front Right wheel
				var joint = _oimo.world.add({
		         type:'jointHinge',//jointWheel, jointDistance, jointHinge, jointPrisme, jointSlide, jointBall
		         body1:_game.car.wheelSteeringRight,
						 body2:_game.car.wheelFRBody,
						 axe1:[1,0,0],
						 axe2:[0,1,0],
		         pos1:[0,0,0],
		         pos2:[0,0,0],
						 collission:false
		    });
			},
			updateCarModel: function () {
					//update the hitbox position and quaternion
					_game.car.hitBoxMesh.position.copy(_game.car.hitBoxBody.getPosition());
					_game.car.hitBoxMesh.quaternion.copy(_game.car.hitBoxBody.getQuaternion());
					_game.car.wheelBLMesh.position.copy(_game.car.wheelBLBody.getPosition());
					_game.car.wheelBLMesh.quaternion.copy(_game.car.wheelBLBody.getQuaternion());
					_game.car.wheelFLMesh.position.copy(_game.car.wheelFLBody.getPosition());
					_game.car.wheelFLMesh.quaternion.copy(_game.car.wheelFLBody.getQuaternion());
					_game.car.wheelBRMesh.position.copy(_game.car.wheelBRBody.getPosition());
					_game.car.wheelBRMesh.quaternion.copy(_game.car.wheelBRBody.getQuaternion());
					_game.car.wheelFRMesh.position.copy(_game.car.wheelFRBody.getPosition());
					_game.car.wheelFRMesh.quaternion.copy(_game.car.wheelFRBody.getQuaternion());
					_game.car.wheelSteeringLeftMesh.position.copy(_game.car.wheelSteeringLeft.getPosition());
					_game.car.wheelSteeringLeftMesh.quaternion.copy(_game.car.wheelSteeringLeft.getQuaternion());
					_game.car.wheelSteeringRightMesh.position.copy(_game.car.wheelSteeringRight.getPosition());
					_game.car.wheelSteeringRightMesh.quaternion.copy(_game.car.wheelSteeringRight.getQuaternion());
					//Process user processUserInput

			}
		},
		ball: {
			body: null,
			mesh: null,
			create: function (){
				//create ridgid body
				_game.ball.body = _oimo.world.add({
				    type:'sphere', // type of shape : sphere, box, cylinder
				    size:[1,1,1], // size of shape
				    pos:[30,10,0], // start position in degree
				    rot:[0,0,0], // start rotation in degree
				    move:true, // dynamic or statique
				    density: 1,
				    friction: 0.2,
				    restitution: 0.2,
				    belongsTo: 2, // The bits of the collision groups to which the shape belongs.
				    collidesWith: 5 // The bits of the collision groups with which the shape collides.
				});
				//create visuals for the hitbox
				_game.ball.mesh = window.game.helpers.createHitBoxVisual(_game.ball.body);
				_three.scene.add( _game.ball.mesh );
			},
			update: function () {
				// and copy position and rotation to three mesh
				_game.ball.mesh.position.copy( _game.ball.body.getPosition() );
				_game.ball.mesh.quaternion.copy( _game.ball.body.getQuaternion() );
			},
		},
		level: {
			create: function() {
				var floorSize = 100;
				_oimo.world.add({type: "box",move: false, size:[floorSize, 0.5, floorSize], pos:[0,-0.25,0] ,belongsTo: 1,friction: 1,restitution:0}); // ground
				_game.level.addOrbitControls();
				//Add visual for floor to threejs Scene
				var geometry = new THREE.BoxGeometry( floorSize, 0.5, floorSize );
				var material = new THREE.MeshBasicMaterial( {
					color: 0xffffff,
					wireframe:true
				} );
				var cube = new THREE.Mesh( geometry, material );
				cube.position.set(0,-0.25,0);
				_three.scene.add( cube );

			},
			addOrbitControls: function(){
				_game.controls = new THREE.OrbitControls( _three.camera, _three.renderer.domElement );
		    // controls.enabled = false;
		    _game.controls.enableZoom = true;
		    _game.controls.enableRotate = true;
		    _game.controls.enablePan = true;
		    _game.controls.enableDamping = true;
		    _game.controls.dampingFactor = 0.5;
		    _game.controls.rotateSpeed = 0.5;
		    _game.controls.minDistance = 1;
		    _game.controls.maxDistance = 240;
		    _game.controls.maxPolarAngle = Math.PI * 0.5;
			}
		},
		init: function(options) {
			_game.initComponents(options);

			_game.level.create();

			//_game.ball.create();

			_game.car.create();

			//create hitbox visuals if true
			//_game.createHitBoxeVisuals();

			_game.loop();
		},
		destroy: function() {
			window.cancelAnimationFrame(_animationFrameLoop);
			//reset physics world
			_oimo.destroy();
			_oimo.setup();

			//reset threeJS world
			_three.destroy();
			_three.setup();

			//Clone objects for recreation
			//_game.player = window.game.helpers.cloneObject(_gameDefaults.player);
			_game.level = window.game.helpers.cloneObject(_gameDefaults.level);

			//recreate the player and level
			//_game.player.create();
			_game.level.create();

			//start game loop again
			_game.loop();
		},
		loop: function() {
			_animationFrameLoop = window.requestAnimationFrame(_game.loop);
			//Update controls if there is any
			if (_game.controls) {
				_game.controls.update();
			}

			_game.processUserInput();

			//step instance
			_oimo.update();

			//update ball position
			//_game.ball.update();

			//update car position
			_game.car.updateCarModel();

			//Up date the positions of the hitboxes if property is true
			// if (_game.showHitBoxes) {
      //
			// 	//update the positions and rotations of the hitboxBodies if desired
			// 	for (var i = 0; i < _game.bodies.length; i++) {
			// 		_game.meshes[i].position.copy(_game.bodies[i].getPosition());
			// 		_game.meshes[i].quaternion.copy(_game.bodies[i].getQuaternion());
			// 	}
			// }
			//render threeJS scene
			_three.render();

			//update the world infobox
			//_game.updateWorldInfo();
		},
		initComponents: function (options) {
			_events = window.game.events();
			_three = window.game.three();
			_oimo = window.game.oimo();
			_ui = window.game.ui();

			//startup sequece
			_three.init(options);
			_oimo.init();
			_ui.init();
			_events.init();

			//add info box
			_game.info = document.createElement('div');
			_game.info.className = "info";
			document.body.appendChild( _game.info );

			_events.onKeyDown = function () {
				if (!_ui.hasClass("infoboxIntro", "fade-out")) {
					_ui.fadeOut("infoboxIntro");
				}
			};
		},
		processUserInput: function(){
			var interval = _oimo.world.timestep

			// [W] = forward acceleration
			if (_events.keyboard.pressed[_game.controlKeys.moveForward]) {
				var t = interval * _game.car.forwardAcceleration
				_game.car.wheelBLBody.angularVelocity.x = -5;
				_game.car.wheelBRBody.angularVelocity.x = -5;
			}

			// [S] = backward acceleration
			if (_events.keyboard.pressed[_game.controlKeys.moveBackward]) {
				var t = interval * _game.car.forwardAcceleration
				_game.car.wheelBLBody.angularVelocity.z = 5;
				_game.car.wheelBRBody.angularVelocity.z = 5;
			}

			// [A] = Steer Left
			if (_events.keyboard.pressed[_game.controlKeys.moveLeft]) {

				_game.car.joint1.limitMotor.setLimit(0.5,0.5);
				_game.car.joint2.limitMotor.setLimit(0.5,0.5);
				//_game.car.wheelSteeringRight.quaternion.y = qy;
			}

			// [D] = Steer right
			if (_events.keyboard.pressed[_game.controlKeys.moveRight]) {

				_game.car.joint1.limitMotor.setLimit(-0.5,-0.5);
				_game.car.joint2.limitMotor.setLimit(-0.5,-0.5);
				//_game.car.wheelSteeringRight.quaternion.y = qy;
			}
		},
		updateWorldInfo: function (){
			_game.info.innerHTML = _oimo.world.getInfo();
		}
	};

	var _events;
	var _three;
	var _oimo;
	var _ui;
	var _animationFrameLoop;
	var _gameDefaults = {
		//player: window.game.helpers.cloneObject(_game.player),
		level: window.game.helpers.cloneObject(_game.level)
	};

	return _game;
};
