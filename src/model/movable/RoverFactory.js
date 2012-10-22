var Rover = require('./Rover'),
	MountFactory = require('./MountFactory');

function RoverFactory (mountFactory) {
    RoverFactory.superclass.constructor.call(this);
    this.mountFactory = mountFactory;
}

RoverFactory.inherit(Object, {
	setupMount: function(type, rover)
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
		
		this.mass = 0;
		
		for (var i in mountPlacement) {
			rover.mounts[i] = this.mountFactory.makeMount(mountPlacement[i]);
		}
		rover.size = rover.mounts.hull.size;
		
		this.setupMount('primary', rover);
		this.setupMount('secondary', rover);
		
		this.setupMount('frontCarrier', rover);
		this.setupMount('rearCarrier', rover);
		
		// attach engines to carriers (this is where the thrust force will be appplied)
		if (rover.mounts.frontCarrier && rover.mounts.frontEngine) {
			rover.mounts.frontEngine.location = rover.mounts.frontCarrier;
		}
		
		// ... and copy-paste :)
		if (rover.mounts.rearCarrier && rover.mounts.rearEngine) {
			rover.mounts.rearEngine.location = rover.mounts.rearCarrier;
		}
		
		return rover;
	}
});

module.exports = RoverFactory;