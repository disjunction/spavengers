var
    geo    = require('../../libs/pointExtension'),
    UpdateAction = require('../frame/UpdateAction'),
    config = require('../abstract/Config'),
    ccp    = geo.ccp;

/**
 * Translates update instructions from server into FieldClient calls
 * 
 * @param FieldClient fc
 * @param Rover car - this is you :)
 */
function FieldUpdater(fc, car) {
	this.fc = fc;
	this.car = car;
}

FieldUpdater.prototype.checkUpdatePack = function() {
	if (this.fc.updatePack && this.fc.updatePack.movable) {
		
		if (typeof this.fc.updatePack.movable[this.car.childId] != 'undefined') {
			var myCar = this.fc.updatePack.movable[this.car.childId];
			if (myCar.ta) delete myCar.ta;
		}
	}
	this.fc.update();
};

FieldUpdater.prototype.update = function(data) {
	if (typeof data.actions == 'object') {
		for (var i in data.actions) {
			var action = UpdateAction.factory(data.actions[i], this.fc.field);
			this.dispatchAction(action);
		}
	}
};

FieldUpdater.prototype.dispatchAction = function(action) {
	switch (action.at) {
		case 'hit':
			this.fc.showHit(action);
			break;
		case 'shot':
			if (action.subjChildId != this.car.childId) {
				var who = this.fc.field.getChild(action.subjChildId);
				var mount = who.mounts[action.mountName];
				this.fc.shootMount(who, mount);
			}
			break;
		case 'ray':
			this.fc.showRay(action);
			break;
		default:
			throw new Error('unknown action: ' + action.at);
	}
};

module.exports = FieldUpdater;