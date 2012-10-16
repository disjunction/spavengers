var
    geo    = require('../../libs/pointExtension'),
    jsaaa  = require('../../libs/jsaaa'),
    config = require('../abstract/Config'),
    MountNodeBuilder = require('../movable/MountNodeBuilder'),
    SurfaceNodeBuilder = require('../surface/SurfaceNodeBuilder'),
    RoverNodeBuilder = require('../movable/RoverNodeBuilder'),
    ccp    = geo.ccp;

function FieldClient(field, nodeFactory, animator, player) {
	var pl = new jsaaa.Playlist(player);
	
	for (var i = 1; i <= 5; i++) {
		player.createSound({id: 'mus' + i, url: 'http://spavengers.local/music/space1_0' + i + '.ogg'});
		pl.push('mus' + i);
	}
	
	var music = new Audio('http://spavengers.local/music/space1.ogg');
	music.loop = true;
	music.play();
	
	player.createSound({id: 'hit1', url: 'http://spavengers.local/sounds/explosion-02.ogg'});
	this.player = player;
	
	FieldClient.superclass.constructor.call(this);
	this.field = field;
	this.nodeFactory = nodeFactory;
	this.animator = animator;
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
			    			//console.log(ch.mounts.primary);
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
	 * @returns {primary: ..., secondary: ...}
	 */
	getTowerOmega: function(ml, car) {
		var approx = geo.ccpDistance(car.location, ml);
		
		if (approx < 1) return {primary: 0, secondary: 0};
		
		function getO(mount) {
			 if (!mount) return 0;
			 var mountL = mount.getAbsLocation(car);
			 var mouseAngle = geo.floorAngle(Math.atan2(ml.y - mountL.y, ml.x - mountL.x));
			 var mountAngle = geo.floorAngle(car.angle + mount.angle);
			 if (Math.abs(mouseAngle - mountAngle) < 0.1) return 0;
			 
			 var a1 = mountAngle, a2 = mouseAngle;
			 
			 if ( a1 < -Math.PI / 2 && a2 > Math.PI / 2 ) a1 += Math.PI * 2;
			 if ( a1 > Math.PI / 2 && a2 < -Math.PI / 2 ) a1 -= Math.PI * 2;
			 
			 return a2 > a1? mount.omega : -mount.omega;
		}
		
		return {primary: getO(car.mounts.primary), secondary: getO(car.mounts.secondary)};
	},
	addCar: function(car) {
		this.field.addChild(car);
		this.rovers.push(car);
		this.roverNodeBuilder.attachNode(car, this.layer);
	},
	removeChildId: function(childId) {
		console.log(this.field.getChild(childId).node);
		this.layer.removeChild(this.field.getChild(childId).node);
		this.field.removeChildId(childId);
	},
	playHit: function(action) {
		this.player.play('hit1');
	},
	showHit: function(action) {
		var opts = {
				scale: Math.min(0.2, action.damage * 0.01),
				_l: action._l,
				_a: action._a,
				opacity: 200,
				file: '/resources/sprites/particles/explosions/exp1.png'
		};
		
		this.animator.showSpriteAndFadeOut(opts, 0.2, 0.3);
		this.playHit(action);
	}
});

module.exports = FieldClient;