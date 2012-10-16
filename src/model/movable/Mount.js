var NodeContainer = require('../visual/NodeContainer'),
	geo = require('../../libs/pointExtension');

function Mount () {
    Mount.superclass.constructor.call(this);
    this.isBody = false;
    this.isNode = true;
    this.maxHp = 100;
    this.hp = 100;
    
}

Mount.inherit(NodeContainer, {
	/**
	 * absolute location of mount center in the world
	 * @param Rover car
	 * @returns Point
	 */
	getAbsLocation: function(car) {
		return geo.ccpRotateByAngle(geo.ccpAdd(this.location, car.location), car.location, car.angle);
	} 
});

module.exports = Mount;