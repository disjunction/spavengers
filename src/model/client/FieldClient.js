var
    geo    = require('../../libs/pointExtension'),
    jsaaa  = require('../../libs/jsaaa'),
    config = require('../abstract/Config'),
    MountNodeBuilder = require('../movable/MountNodeBuilder'),
    SurfaceNodeBuilder = require('../surface/SurfaceNodeBuilder'),
    RoverNodeBuilder = require('../movable/RoverNodeBuilder'),
    WeaponPlayer = require('../visual/WeaponPlayer'),
    ccp    = geo.ccp;

function FieldClient(field, nodeFactory, animator, player) {
	var pl = new jsaaa.Playlist(player);
	var bu = config.resources.baseUrl;
	
	/*
	for (var i = 1; i <= 5; i++) {
		player.createSound({id: 'mus' + i, url: bu + '/music/space1_0' + i + '.ogg'});
		pl.push('mus' + i);
	}
	*/
	
	var music = new Audio(bu + '/music/space1.ogg');
	music.autoplay = false;
	music.loop = true;
	//music.play();
	
	player.createSound({id: 'hit1', url: bu + '/sounds/explosion-02.ogg'});
	player.createSound({id: 'heavy_cannon_shot', url: bu + '/sounds/heavy_cannon_shot.ogg'});
	this.player = player;
	
	FieldClient.superclass.constructor.call(this);
	this.field = field;
	this.nodeFactory = nodeFactory;
	this.animator = animator;
	this.weaponPlayer = new WeaponPlayer(field, animator, player, null);
	
	this.mountNodeBuilder = new MountNodeBuilder(nodeFactory);
	this.roverNodeBuilder = new RoverNodeBuilder(this.mountNodeBuilder);
	this.surfaceNodeBuilder = new SurfaceNodeBuilder(nodeFactory);
	
	this.rovers = [];
	this.surfaces = [];
}

FieldClient.inherit(Object, {
	attachNodes: function(layer) {
		var snb = this.surfaceNodeBuilder,
			rnb = this.roverNodeBuilder;
		
		this.rovers = [];
		this.surfaces = [];
				
		for (var i in this.field.children) {
			var el = this.field.getChild(i);
			if (el.frontPoint) {
				this.rovers[i] = el;
				rnb.attachNode(el, layer);
			} else {
				this.surfaces[i] = el;
				snb.makeNodes(el);
				snb.attachNodes(el, layer);
			}
		}
		
		this.layer = layer;
	},
	update: function() {
		if (this.updated) {
			var ch; // child
			
			for (var i in this.updatePack.movable) {
	    		var el = this.updatePack.movable[i];
	    		if (el != null) {
	    			if (ch = this.field.getChild(i)) {
			    		ch.location = el.l;
			    		ch.angle = el.a;
			    		if (el.ta) {
			    			ch.mounts.primary.angle = el.ta[0];
			    			if (el.ta.length > 1) ch.mounts.secondary.angle = el.ta[1];
			    		}
	    			}
	    		}
	    	}
			this.updated = false;
		}
	},
	/**
	 * @param Point ml - mouse location
	 * @param Rover car - subject car
	 * @param int dt - expect delta time, used for sticky angle
	 * @returns {primary: ..., secondary: ...}
	 */
	getTowerOmega: function(ml, car, dt) {
		//var approx = geo.ccpDistance(car.location, ml);
		//if (approx < 01) return {primary: 0, secondary: 0};
		
		function getO(mount) {
			 if (!mount) return 0;
			 var mountL = mount.getAbsLocation(car);
			 var mouseAngle = geo.floorAngle(Math.atan2(ml.y - mountL.y, ml.x - mountL.x));
			 var mountAngle = geo.floorAngle(car.angle + mount.angle);
			 if (Math.abs(mouseAngle - mountAngle) < 0.04) return 0;
			 
			 var a1 = mountAngle, a2 = mouseAngle;
			 
			 if ( a1 < -Math.PI / 2 && a2 > Math.PI / 2 ) a1 += Math.PI * 2;
			 if ( a1 > Math.PI / 2 && a2 < -Math.PI / 2 ) a1 -= Math.PI * 2;
			 
			 // if the next update will step over the target angle...
			 if (Math.abs(mount.omega * dt) > Math.abs(a2 - a1)) {
				 return (a2 - a1)/dt;
			 }
			 
			 return a2 > a1? mount.omega : -mount.omega;
		}
		
		return {primary: getO(car.mounts.primary), secondary: getO(car.mounts.secondary)};
	},
	addCar: function(car) {
		this.field.addChild(car);
		this.rovers.push(car);
		this.roverNodeBuilder.attachNode(car, this.layer);
	},
	/**
	 * @param childId
	 * @param int dur - fadeout duration
	 */
	removeChildId: function(childId, dur) {
		// kind of typecast for undefined :\
		if (!dur) dur = 0;
		
		var child = this.field.getChild(childId);
		
		// if child is composed out of mounts
		// then we need to fade out each of them
		if (child.mounts) {
			for (var i in child.mounts)
				if (child.mounts[i].node)
					this.animator.fadeOutRemove(child.mounts[i].node, 0, dur);	
		} else {
			// unknown child is removed, let's try to fade it out
			child.node && this.animator.fadeOutRemove(child.node, 0, dur);
		}
		this.field.removeChildId(childId);
	},
	playHit: function(action) {
		this.player.play('hit1');
	},
	showHit: function(action) {
		this.weaponPlayer.playAction(action);
	},
	shootMount: function(car, mount) {
		if (!mount) return;
		if (mount.node) {
			this.animator.backAndForth(mount.node, 0.2, 0.05, 0.15);
		}
		var soundName = mount.name + '_shot';
		this.player.play(soundName);
	}
	
});

module.exports = FieldClient;