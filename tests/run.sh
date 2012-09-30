#!/bin/sh
export NODE_PATH=/usr/local/lib/node_modules/cocos2d/src/libs:/usr/local/lib/node_modules
nodeunit cases cases/infra cases/box2d cases/movable cases/surface
