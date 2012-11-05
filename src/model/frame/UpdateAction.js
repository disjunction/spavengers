var 
	jsein  = require('../../libs/jsein'),
    geo    = require('geometry'),
    ccp    = geo.ccp,
    Parent = require('../abstract/Parent'),
    weaponDef = require('../../resources/data/generic/weapons');

function UpdateAction() {
}

UpdateAction.factory = function(data, field) {
	data._t = 'UpdateAction';
	var o = jsein.recover(data);
	o.field = field;
	return o;
};

UpdateAction.inherit(Parent, {
	get subj() {
		if (this._subj) return this._subj;
		if (this.subjChildId) {
			return this._subj = this.field.getChild(this.subjChildId);
		}
	},
	get mount() {
		if (this.mountName && this.subj) {
			return this.subj.mounts[this.mountName];
		}
	},
	get weapon() {
		if (this.mount) {
			return weaponDef[this.mount.weapon];
		}
	},
});

module.exports = UpdateAction;
