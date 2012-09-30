var cocos = require('cocos2d'),
    events = require('events'),
    geo = require('geometry'),
    box2d = require('box2d')

function PhysicsDemo () {
    PhysicsDemo.superclass.constructor.call(this)

    this.isMouseEnabled = true


    this.bodies = []


    // Get size of canvas
    var s = cocos.Director.sharedDirector.winSize

    this.demo()
    this.scheduleUpdate()
}

// Create a new layer
PhysicsDemo.inherit(cocos.nodes.Layer, {
    world: null,
    bodies: null,
    selectedBody: null,
    mouseJoint: null,

    createCrate: function (point, scale) {
        scale = scale || 1
        var sprite = new cocos.nodes.Sprite({file: '/resources/crate.jpg'})
        sprite.position = point

        sprite.scale = scale /2

        this.addChild(sprite)
        return sprite
    },

    createBall: function (point, scale) {
        scale = scale || 1
        var sprite = new cocos.nodes.Sprite({file: '/resources/ball.png'})
        sprite.position = point

        sprite.scale = scale

        this.addChild(sprite)
        return sprite
    },

    update: function (dt) {
        var world = this.world,
            mouseJoint = this.mouseJoint

        world.Step(dt, 10, 10)
        world.ClearForces()

        var bodies = this.bodies
        for (var i = 0, len = bodies.length; i < len; i++) {
            var body = bodies[i],
                pos = body.GetPosition(),
                angle = geo.radiansToDegrees(-body.GetAngle())
            body.sprite.position = new geo.Point(pos.x * 30, pos.y * 30)

            body.sprite.rotation = angle

        }
    },

    demo: function () {
        var world = new box2d.b2World(
            new box2d.b2Vec2(0, 0),    //gravity
            true                  //allow sleep
        )
        this.world = world

        var fixDef = new box2d.b2FixtureDef
        fixDef.density = 1.0
        fixDef.friction = 0.5
        fixDef.restitution = 0.2

        var bodyDef = new box2d.b2BodyDef

        //create ground
        bodyDef.type = box2d.b2Body.b2_staticBody
        fixDef.shape = new box2d.b2PolygonShape
        fixDef.shape.SetAsBox(20, 2)
        bodyDef.position.Set(10, 400 / 30 + 2)
        world.CreateBody(bodyDef).CreateFixture(fixDef)
        bodyDef.position.Set(10, -2)
        world.CreateBody(bodyDef).CreateFixture(fixDef)
        fixDef.shape.SetAsBox(2, 14)
        bodyDef.position.Set(-2, 13)
        world.CreateBody(bodyDef).CreateFixture(fixDef)
        bodyDef.position.Set(22, 13)
        world.CreateBody(bodyDef).CreateFixture(fixDef)


        //create some objects
        bodyDef.type = box2d.b2Body.b2_dynamicBody
        for (var i = 0; i < 0; ++i) {
            var sprite
            bodyDef.position.x = Math.random() * 15
            bodyDef.position.y = Math.random() * 15
            var scale = (Math.random() + 0.5),
                width = scale * 32
            if (Math.random() > 1.5) {
                fixDef.shape = new box2d.b2PolygonShape
                fixDef.shape.SetAsBox(width/30, width/30)
                sprite = this.createCrate(new geo.Point(bodyDef.position.x * 30, bodyDef.position.y * 30), scale)
            } else {
                fixDef.shape = new box2d.b2CircleShape(width/30)
                sprite = this.createBall(new geo.Point(bodyDef.position.x * 30, bodyDef.position.y * 30), scale)
            }

            var bdy = world.CreateBody(bodyDef)
            bdy.sprite = sprite
            this.bodies.push(bdy)
            bdy.CreateFixture(fixDef)
        }

        
        var fixDef = new box2d.b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.5;
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsBox(1.5, 1.5);
        
        var bodyDef = new box2d.b2BodyDef;
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.position.Set(6,2);
        bodyDef.linearDamping = 0;
        bodyDef.angularDamping = 0;
        
        var b1 = world.CreateBody(bodyDef);
        b1.CreateFixture(fixDef);
        
        sprite = this.createCrate(new geo.Point(bodyDef.position.x * 30, bodyDef.position.y * 30), 1.5);
        b1.sprite = sprite;
        this.bodies.push(b1);
        
        bodyDef.position.Set(2,2);
        bodyDef.bullet = true;
        var b2 = world.CreateBody(bodyDef);
        b2.CreateFixture(fixDef);
        b2.SetLinearVelocity(new box2d.b2Vec2(10,0));        

        sprite = this.createCrate(new geo.Point(bodyDef.position.x * 30, bodyDef.position.y * 30), 1.5);
        b2.sprite = sprite;
        this.bodies.push(b2);
        //setup debug draw
        /*
        var debugDraw = new box2d.b2DebugDraw()
            debugDraw.SetSprite(document.getElementById('debug-canvas').getContext("2d"))
            debugDraw.SetDrawScale(30.0)
            debugDraw.SetFillAlpha(0.5)
            debugDraw.SetLineThickness(1.0)
            debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit)
            world.SetDebugDraw(debugDraw)
        */
    }, 

})

exports.main = function () {
    var director = cocos.Director.sharedDirector

    director.displayFPS = true

    events.addListener(director, 'ready', function (director) {
        var scene = new cocos.nodes.Scene
        scene.addChild(new PhysicsDemo)
        director.replaceScene(scene)
    })

    director.runPreloadScene()
}
