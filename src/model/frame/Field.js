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
	 * 	movable: [ childId1: {l: {x:.., y:...}, a: ...},
	 *             childId2: {l: {x:.., y:...}, a: ...}
	 *             ...
	 *           ]
	 * }
	 */
	_fullUpdatePack: null,
	get fullUpdatePack() {
		if (null != this._fullUpdatePack) return this._fullUpdatePack; 
		
		var result = {};
		result.movable = {};
		for (var i in this.children) {
			var child = this.children[i];
			if (!child || !child.awake) continue;
			var p;
			if (p = child.location) {
				var container = {};
				container.l = ccp(Math.round(p.x*1000)/1000,Math.round(p.y*1000)/1000);
				container.a = Math.round(child.angle*1000)/1000;
				result.movable[i] = container;
			};
		}
		this._fullUpdatePack = result;
		return this._fullUpdatePack;
	}
});


module.exports = Field;