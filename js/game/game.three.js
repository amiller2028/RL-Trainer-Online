/*
 * Game THREE.js module
 *
 * A class for the main THREE.js setup including camera, renderer and Oimo.js helpers
 */

window.game = window.game || {};

window.game.three = function() {
	var _three = {
		// Attributes

		// DOM container which will hold the final canvas element of THREE.js
		domContainer: null,
		// Camera size constraint to limit viewport e.g. for a user interface
		cameraSizeConstraint: null,
		// Scene, camera and renderer
		camera: null,
		scene: null,
		renderer: null,
		// Field of view default setting for the camera
		fov: 75,
		orbitControls: false,
		// Methods
		init: function(options) {
			// Initialize the DOM container from the options or create a new one
			_three.domContainer = options && options.domContainer || document.createElement("div");

			// Append new DOM container if needed
			if (!options || !options.domContainer) {
				document.body.appendChild(_three.domContainer);
			}
			//create the scene and camera
			_three.scene = new THREE.Scene();
			_three.camera = new THREE.PerspectiveCamera( _three.fov, window.innerWidth/window.innerHeight, 0.1, 1000 );
			_three.camera.position.set(0, 50/10, 90/10); //(x, y, z)

			//create the rederer and append in the dom element
			_three.renderer = new THREE.WebGLRenderer();
			_three.renderer.setSize( window.innerWidth, window.innerHeight );
	    _three.domContainer.appendChild(_three.renderer.domElement);

			// Add window resize listener to keep screen size for the canvas
			_three.onWindowResize();
			window.addEventListener("resize", _three.onWindowResize, false);

		},
		destroy: function() {
			_three.scene = null;
			_three.camera = null;
			_three.renderer = null;
			_three.domContainer = null;
		},
		setup: function () {
			// Setup main scene
			_three.scene = new THREE.Scene();

			// Setup lights
			var hemiLight = new THREE.HemisphereLight(window.game.static.colors.white, window.game.static.colors.white, 0.6);
			hemiLight.position.set(0, 0, -1);
			_three.scene.add(hemiLight);
			var pointLight = new THREE.PointLight(window.game.static.colors.white, 0.5);
			pointLight.position.set(0, 0, 500);
			_three.scene.add(pointLight);

			//testing stuff
			// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
			// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			// var cube = new THREE.Mesh( geometry, material );
			// _three.scene.add( cube );

		},
		render: function() {
			// Update the scene
			_three.renderer.render(_three.scene, _three.camera);
		},
		onWindowResize: function() {
			// Keep screen size when window resizes
			_three.camera.aspect = window.innerWidth / window.innerHeight;
	    _three.camera.updateProjectionMatrix();
	    _three.renderer.setSize(window.innerWidth, window.innerHeight);
		},
		test: function () {
			_three.init();
			_three.setup();
			_three.testLoop();
		},
		testLoop: function(){
			_animationFrameLoop = window.requestAnimationFrame(_three.testLoop);
			_three.render();
			//Update Controls if true
			if (_three.orbitControls) {

			}
		},
		createModel: function(jsonData, scale, materials, isGeometry) {
			// Variables for JSONLoader and imported model data
			var loader;
			var jsonModel;
			var meshMaterial;
			var model = {};

			// If isGeometry is set, the JSON model has already been loaded asynchronously and the geometry data is available here
			if (isGeometry) {
				jsonModel = jsonData;
			} else {
				// Regular model loading of JSON data that exists e.g. in game.models.js
				loader = new THREE.JSONLoader();
				jsonModel = loader.parse(JSON.parse(JSON.stringify(jsonData)));
			}

			// Check if materials is set
			if (materials) {
				// If materials is an array, assign each material to the corresponding imported material
				if (typeof materials === "object" && materials.length) {
					// Iterate through the imported materials and
					if (jsonModel.materials) {
						for (var i = 0; i < jsonModel.materials.length; i++) {
							jsonModel.materials[i] = materials[i];
						}

						// Create a multi-face material
						meshMaterial = new THREE.MeshFaceMaterial(jsonModel.materials);
					}
				} else {
					// Use and assign the defined material directly
					meshMaterial = materials;
				}
			} else {
				// Create a multi-face material
				if (jsonModel.materials) {
					meshMaterial = new THREE.MeshFaceMaterial(jsonModel.materials);
				}
			}

			// Assign the material(s) to the created mesh
			model.mesh = new THREE.Mesh(jsonModel.geometry, meshMaterial);

			// Return an object containing a mesh and its halfExtents
			return model;
		},
	};

	return _three;
};
