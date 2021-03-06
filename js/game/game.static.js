/*
 * Game Constants
 *
 * This file contains static constants that don't change
 */

window.game = window.game || {};

window.game.static = {
	colors: {
		black: 0x000000,
		white: 0xffffff,
		green: 0x0fdb8c,
		cyan: 0x38FDD9
	},
	materials:{
		wireframe: function() {
			var _material = new THREE.MeshBasicMaterial( {color: 0xffffff,wireframe:true} );
			return _material;
		}
	}
};
