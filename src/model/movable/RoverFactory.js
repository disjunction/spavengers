var Rover = require('./Rover'),
	MountFactory = require('./MountFactory');

function RoverFactory (mountFactory) {
    RoverFactory.superclass.constructor.call(this);
    this.mountFactory = mountFactory;
}

RoverFactory.inherit(Object, {
	setupTower: function(type, rover)
	{
		if (rover.mounts[type]) { 
	    	if (rover.mounts.hull[type]) {
	    		rover.mounts[type].location = rover.mounts.hull[type];
	    	}
	    }
	},
	
	/**
	 * mountPlacement structure:
	 * {
	 *     hull: "car1",
	 *     primary: "heavy_cannon",
	 *     secondary: "electric_cannon"
	 *     ...
	 * }
	 * 
	 * @param assoc mountPlacement 
	 * @returns Rover
	 */
	makeRover: function(mountPlacement) {
		var rover = new Rover();
		for (var i in mountPlacement) {
			rover.mounts[i] = this.mountFactory.makeMount(mountPlacement[i]);
		}
		rover.size = rover.mounts.hull.size;
		
		this.setupTower('primary', rover);
		this.setupTower('secondary', rover);
		
		return rover;
	}
});

module.exports = RoverFactory;