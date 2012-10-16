var
    geo    = require('../../libs/pointExtension'),
    config = require('../abstract/Config'),
    ccp    = geo.ccp;

/**
 * Translates update instructions from server into FieldClient calls
 * 
 * @param FieldClient fc
 */
function FieldUpdater(fc) {
	this.fc = fc;
}

FieldUpdater.prototype.update = function(data) {
	if (typeof data.actions == 'object') {
		for (var i in data.actions) {
			this.dispatchAction(data.actions[i]);
		}
	}
};

FieldUpdater.prototype.dispatchAction = function(action) {
	switch (action._t) {
		case 'hit':
			this.fc.showHit(action);
			break;
		case 'hitSound':
			this.fc.playHit(action);
			break;
		case 'ray':
			this.fc.showRay(action);
			break;
			
	}
};

module.exports = FieldUpdater;