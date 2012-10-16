var
    geo    = require('geometry'),
    ccp    = geo.ccp,
    Parent = require('../abstract/Parent');

function Field() {
    Field.superclass.constructor.call(this);
	this.size = ccp(100, 100);
}

Field.inherit(Parent, {
	/**
	 * field update pack
	 * 
	 * {
	 * 	movable: [ childId1: {l: {x:.., y:...}, a: ..., ta: [..., ...]}, // ta = tower angles
	 *             childId2: {l: {x:.., y:...}, a: ...}
	 *             ...
	 *           ]
	 * }
	 */
	_fullUpdatePack: null,
	get fullUpdatePack() {
		if (null != this._fullUpdatePack) return this._fullUpdatePack; 
		
		function round3(x) {
			return Math.round(x*1000)/1000;
		}
		
		var result = {};
		result.movable = {};
		for (var i in this.children) {
			var child = this.children[i];
			if (!child || !child.awake) continue;
			var p;
			if (p = child.location) {
				var container = {};
				container.l = ccp(round3(p.x),round3(p.y));
				container.a = round3(child.angle);
				
				// generate "ta" field - tower angles for given car
				if (child.mounts && child.mounts.primary) {
					var ta = [round3(child.mounts.primary.angle)];
					if (child.mounts.secondary) {
						ta[1] = round3(child.mounts.secondary.angle);
					}
					container.ta = ta;
				}
				
				result.movable[i] = container;
			};
		}
		this._fullUpdatePack = result;
		return this._fullUpdatePack;
	}
});


module.exports = Field;