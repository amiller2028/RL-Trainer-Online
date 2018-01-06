/*
 * Game Oimo.js module
 *
 * A class for the Oimo.js setup providing body management, collision detection extensions and some helpers
 */

window.game = window.game || {};

window.game.oimo = function() {
	var _oimo = {
		// Attributes

		// Cannon.js world holding all bodies of the level
		world: null,
		// Bodies correspond to the physical objects inside the Cannon.js world
		bodies: [],
		// Store the body count in an index
		bodyCount: 0,
		// Default friction and restitution
		friction: 0.0,
		restitution: 0.0,
		// Default Z gravity (approximation of 9,806)
		gravity: -9.8,
    //how Many times to refine physics simulation
    iterations: 200,
		// Interval speed for Oimo.js to step the physics simulation
		timestep: 1/60,

		// Methods
		init: function() {
			// Setup Oimo.js world
			_oimo.setup();
		},
		setup: function () {
			// Create a new physics simulation based on the default settings
			_oimo.world = new OIMO.World({
          timestep: _oimo.timestep,
          iterations: _oimo.iterations,
          broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
          worldscale: 1, // scale full world
          random: true,  // randomize sample
          info: false,   // calculate statistic or not
          gravity: [0,_oimo.gravity,0]
      });

			// Create empty arrays that will later be populated with bodies
			_oimo.bodies = [];
			_oimo.bodyCount = 0;
		},
		createBody: function(options) {
			// Creates a new body based on specific options
			var _body  = _oimo.world.add({
          type:options.type, // type of shape : sphere, box, cylinder
          size:options.size, // size of shape
          pos:options.pos, // start position in degree
          rot:options.rot, // start rotation in degree
          move:options.move, // dynamic or statique
          density: options.density,
          friction: options.friction,
          restitution: options.restitution,
          belongsTo: options.belongsTo, // The bits of the collision groups to which the shape belongs.
          collidesWith: options.collidesWith // The bits of the collision groups with which the shape collides.
      });
			return _body;
		},
    destroy: function(){
      //remove all oimo object from world
      _oimo.world.clear();
    },
    getInfo: function (){
      //return string of info on world statistics
      var _info = _oimo.world.getInfo();
      return _info;
    },
    update: function(){
      //step through an itteration of the physics world
      _oimo.world.step();
    }
	};

	var _three;

	return _oimo;
};
