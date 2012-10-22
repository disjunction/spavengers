var
    geo    = require('../../libs/pointExtension'),
    jsein  = require('../../libs/jsein'),
    weaponDef = require('../../resources/data/generic/weapons'),
    ccp    = geo.ccp;

/**
 * separates purely visual/sound functionaly for handling different weapon effects
 * 
 * @param animator
 * @param player
 * @see FieldUpdater - it has a similar functionality, but does only field updates
 */
function WeaponPlayer(field, animator, player, ego) {
	this.ego = ego;
	this.animator = animator;
	this.player = player;
	this.field = field;
	
	this.repo = new jsein.JsonRepo();
	this.repo.loadObject(weaponDef);
}

WeaponPlayer.prototype.playAction = function(action) {
	switch (action._t) {
		case 'hit':
			return this.hit(action);
	}
};

WeaponPlayer.prototype.hit = function(action) {
	var subj = this.field.getChild(action.subjChildId);
	if (!subj) return;
	
	var mount = subj.mounts[action.mountName];
	if (!mount) return;
	
	var weapon = weaponDef[mount.weapon];
	if (!weapon) return;
	
	var visDef = weapon.visual.hit;
	
	var opts = {
			scale: action.damage * jsein.parseFloat(visDef.damageScale) + jsein.parseFloat(visDef.spriteScale, 1),
			_l: action._l,
			_a: action._a,
			opacity: jsein.parseFloat(visDef.opacity),
			rotateBy: jsein.parseFloat(visDef.rotateBy),
			scaleBy: jsein.parseFloat(visDef.scaleBy),
			file: '/resources/sprites/particles/' + visDef.sprite
	};
	
	this.animator.showSpriteAndFadeOutRemove(opts, jsein.parseFloat(visDef.displayTime),
												   jsein.parseFloat(visDef.fadeOutTime));
	this.player.play(weapon.sound.hit);
};

module.exports = WeaponPlayer;