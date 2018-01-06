 /*
 * Game Helpers
 *
 * A collection of useful math and object helpers
 */

window.game = window.game || {};

window.game.helpers = {
	// Convert from polar coordinates to Cartesian coordinates using length and radian
	polarToCartesian: function(vectorLength, vectorDirection) {
		return {
			x: vectorLength * Math.cos(vectorDirection),
			y: vectorLength * Math.sin(vectorDirection)
		};
	},
	// Convert radians to degrees (1 radian = 57.3 degrees => PI * radian = 180 degrees)
	radToDeg: function(radians) {
		return radians * (180 / Math.PI);
	},
	// Convert degrees to radians
	degToRad: function(degrees) {
		return degrees * Math.PI / 180;
	},
	// Generate a random number between a fixedrange
	random: function(min, max, round) {
		return round ? (Math.floor(Math.random() * (max + 1)) + min) : (Math.random() * max) + min;
	},
	//create a three mesh with a hitbox material from a body
	createHitBoxVisual: function (body){
		var _mesh = window.game.helpers.bodyToMesh(body,window.game.static.materials.wireframe());
		return _mesh;
	},
	//Convert oimo body to a threejs mesh
	bodyToMesh: function (body,material) {
		//defaults to return nothing
		var _body = null;
		var _mesh = null;
		var _res = 16;

		//change geometry based on body type
		switch (body.shapes.type) {
			case 1://shpere
				_body = new THREE.Sphere(body.shapes.radius,_res,_res);
				break;
			case 2://box
				_body = new THREE.BoxGeometry(body.shapes.width,body.shapes.height,body.shapes.depth);
				break;
			case 3://cylinder
				_body = new THREE.CylinderGeometry( body.shapes.radius, body.shapes.radius, body.shapes.height, _res );
				break;
		}
		if (_body) {
			_mesh = new THREE.Mesh( _body, material );
			_mesh.position.copy(body.getPosition());
			_mesh.quaternion.copy(body.getQuaternion());
		}
		return _mesh;
	},
	// Clone an object recursively
	cloneObject: function(obj) {
		var copy;

		if (obj === null || typeof obj !== "object") {
			return obj;
		}

		if (obj instanceof Date) {
			copy = new Date();

			copy.setTime(obj.getTime());

			return copy;
		}

		if (obj instanceof Array) {
			copy = [];

			for (var i = 0, len = obj.length; i < len; i++) {
				copy[i] = window.game.helpers.cloneObject(obj[i]);
			}

			return copy;
		}

		if (obj instanceof Object) {
			copy = {};

			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) {
					copy[attr] = window.game.helpers.cloneObject(obj[attr]);
				}
			}

			return copy;
		}
	},
	quadraticEaseOut: function ( k ) {

		return - k * ( k - 2 );

	},
	cubicEaseOut: function ( k ) {

		return -- k * k * k + 1;

	},
	circularEaseOut: function ( k ) {

		return Math.sqrt( 1 - -- k * k );

	},
	sinusoidalEaseOut: function ( k ) {

		return Math.sin( k * Math.PI / 2 );

	},
	exponentialEaseOut: function ( k ) {

		return k === 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1;

	}
};
