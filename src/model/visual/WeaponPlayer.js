var
    geo    = require('../../libs/pointExtension'),
    jsein  = require('../../libs/jsein'),
    weaponDef = require('../../resources/data/generic/weapons'),
    config = require('../abstract/Config'),
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
	
	this.initSounds();
}

WeaponPlayer.prototype.initSounds = function() {
	var p = this.player,
		bu = config.resources.baseUrl;
	p.createSound({id: 'falconet_hit', url: bu + '/sounds/explosion-02.ogg'});
	p.createSound({id: 'falconet_shot', url: bu + '/sounds/heavy_cannon_shot.ogg'});
	p.createSound({id: 'laser_shot', url: bu + '/sounds/laser_shot.ogg'});
};


WeaponPlayer.prototype.playAction = function(action) {
	var methodName = 'action' + action.at.substring(0,1).toUpperCase() + action.at.substring(1);
	if (this[methodName]) this[methodName].call(this, action);
};

WeaponPlayer.prototype.actionShot = function(action) {
	this.player.play(weapon.sound.shot);
};

WeaponPlayer.prototype.actionHit = function(action) {
	if (!action.weapon) return;
	
	var visDef = action.weapon.visual.hit;
	
	// if the weapon has a ray when shooting (lasers)
	if (visDef.ray) {
		var absMount = action.mount.getAbsLocation(action.subj),
			angle = Math.atan2(absMount.y - action._l.y, action._l.x - absMount.x),
			start = ccp(absMount.x + visDef.ray.startShift * Math.cos(angle),
					    absMount.y - visDef.ray.startShift * Math.sin(angle)),
					    
			rayLength = config.ppm * (geo.ccpDistance(action._l, absMount) - visDef.ray.startShift);			

			if (rayLength > 0) {
				var opts = {
					rect: new geo.Rect(0, 0, rayLength, 24),
					opacity: jsein.parseFloat(visDef.ray.opacity),
					rotateBy: jsein.parseFloat(visDef.ray.rotateBy),
					scaleBy: jsein.parseFloat(visDef.ray.scaleBy),
					anchorPoint: visDef.ray.anchorPoint,
					_l: start,
					_a: angle,
					file: '/resources/sprites/particles/' + visDef.ray.sprite
				};
				
				console.log(opts);
		
				this.animator.showSpriteAndFadeOutRemove(opts, jsein.parseFloat(visDef.ray.displayTime),
						   jsein.parseFloat(visDef.ray.fadeOutTime));
			}
		
	}
	
	// if hit has a target, then display explosion at end point
	if (!action.blank) {
		var opts = {
				anchorPoint: visDef.anchorPoint,
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
		this.player.play(action.weapon.sound.hit);
	}
	
};

WeaponPlayer.prototype.shootMount = function(who, mount) {
	if (!mount) return;
	if (mount.node) {
		this.animator.backAndForth(mount.node, 0.2, 0.05, 0.15);
	}
	var weapon = weaponDef[mount.weapon];
	if (weapon) {
		this.player.play(weapon.sound.shot);
	}
};

module.exports = WeaponPlayer;