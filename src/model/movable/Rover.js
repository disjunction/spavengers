var Movable = require('./Movable');

function Rover () {
    Rover.superclass.constructor.call(this);
    this.torque = 0;
    this.mounts = {};
}

Rover.inherit(Movable, {
	mounts: {},
	getDensity: function() {
		// basic mass, even an empty rover still weights smth.
		var mass = 1,
			sq = 3;
		
		for (var i in this.mounts)
			if (this.mounts[i].mass)
				mass += this.mounts[i].mass;
		
		if (this.mounts.hull) {
			sq = this.mounts.hull.size.width * this.mounts.hull.size.height;
		}
		
		return mass / sq / 100;
	},
	getLinearDamping: function() {
		// basic mass, even an empty rover still weights smth.
		var ld = 0.2;
		
		for (var i in ['frontCarier', 'rearCarrier', 'carrier'])
			if (this.mounts[i].mass)
				mass += this.mounts[i].mass;
		
		if (this.mounts.hull) {
			sq = this.mounts.hull.size.width * this.mounts.hull.size.height;
		}
		
		return mass / sq / 100;
	},
});

module.exports = Rover;