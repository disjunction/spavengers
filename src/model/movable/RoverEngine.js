var geo = require('../../libs/pointExtension'),
	ccp = geo.ccp,
	mult = geo.ccpMult;

/**
 * Defines the mechanics of the rovers (thrust and friction)
 */
function RoverEngine (field) {
	this.field = field;
    RoverEngine.superclass.constructor.call(this);
}

/**
 * @param roverBody
 * @param rover
 * @param direction - 1/-1 - forward, backward
 * 
 */
RoverEngine.prototype.applyMountThrust = function (roverBody, rover, direction, engine, carrier) {
	if (!direction) {
		direction = 1;
	}

	var thrust = engine.thrust? engine.thrust : 1,
		thrustFactor = ccp(thrust * direction, thrust * direction),
		wheelAngle = carrier.getAbsAngle(rover),
		unit = geo.ccpForAngle(wheelAngle);
	
	roverBody.ApplyForce(mult(unit, thrustFactor), carrier.getAbsLocation(rover));
};

/**
 * @param roverBody
 * @param rover
 * @param direction - 1/-1 - forward, backward
 */
RoverEngine.prototype.applyThrust = function (roverBody, rover, direction) {
	if (rover.mounts.rearEngine && rover.mounts.rearCarrier) {
		this.applyMountThrust(roverBody, rover, direction, rover.mounts.rearEngine, rover.mounts.rearCarrier);
	} 
	if (rover.mounts.frontEngine && rover.mounts.frontCarrier) {
		this.applyMountThrust(roverBody, rover, direction, rover.mounts.frontEngine, rover.mounts.frontCarrier);
	}
};

/**
 * this is ugly copy paste from appThrust, but should be fixed
 * @param roverBody
 * @param rover
 */
RoverEngine.prototype.applyBreak = function (roverBody, rover) {	
	this.applyThrust(roverBody, rover, -1);
};

RoverEngine.prototype.applyResistence = function (roverBody, rover) {
	if (rover.mounts.hull) {
		 switch (rover.mounts.hull.carrier) {
		 case 'wheels':
			 if (rover.mounts.frontCarrier) 
				 this.applyWheelFriction(roverBody, rover, rover.mounts.frontCarrier);
			 
			 if (rover.mounts.rearCarrier) 
				 this.applyWheelFriction(roverBody, rover, rover.mounts.rearCarrier);
			 
			 break;
		 }
	}
	
	this.applyAirResistence(roverBody, rover);
};

RoverEngine.prototype.applyAirResistence = function (roverBody, rover) {
	var vSq = geo.ccpLengthSQ(roverBody.GetLinearVelocity()),
		resistFactor = ccp(vSq * 0.01, vSq * 0.01);
	
		roverBody.ApplyForce(mult(geo.ccpNeg(roverBody.GetLinearVelocity()), resistFactor),
							 rover.location);
};


RoverEngine.prototype.applyWheelFriction = function (roverBody, rover, carrier) {
	var sSq = geo.ccpLengthSQ(roverBody.GetLinearVelocity());
	
			// this is an empirical factor, emulating friction change depending on speed (drifting?)
	var		factor = 1.5 + 5 / Math.max(sSq, 2),
			wheelAngle = carrier.getAbsAngle(rover),
			veloAngle = Math.atan2(roverBody.GetLinearVelocity().y, roverBody.GetLinearVelocity().x),
			transVelo = geo.ccpRotateByAngle(roverBody.GetLinearVelocity(), geo.PointZero(), (wheelAngle - veloAngle)*2),
			diff = geo.ccpSub(transVelo, roverBody.GetLinearVelocity()),
			diffLenSq = geo.ccpLengthSQ(diff);
	
	// we want to hard limit the friktion on high speeds
	var ceilSq = 40;
	
	if (diffLenSq > ceilSq) {
		factor *= Math.sqrt(ceilSq) / Math.sqrt(diffLenSq);
	}

	factor *= roverBody.GetMass() / 2 ;
	
	roverBody.ApplyForce(mult(diff, ccp(factor, factor)), carrier.getAbsLocation(rover));
};


module.exports = RoverEngine;