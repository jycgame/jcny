var GameManager = require("GameManager");
var DropState = require("DropState");

cc.Class({
    extends: cc.Component,

    properties: {
        shapeSpriteFrames: [cc.SpriteFrame],
        shapeSprite: cc.Sprite,
    },

    canvasNode: cc.Node,
    
    onLoad: function () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.canvasNode = cc.find("Canvas");
        this.sprite = this.getComponent(cc.Sprite);
    },

    onEnable: function () {
        this.canvasNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },

    onDisable: function () {
        this.canvasNode.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },

    onTouchMove: function (event) {
        var touches = event.getTouches();
        if (touches.length == 1) {
            var deltaX = event.getDeltaX();
            this.node.x += deltaX;
        }

        this.node.x = cc.clampf(this.node.x, -540 + this.node.width * this.node.scaleX / 2, 540 - this.node.width * this.node.scaleX / 2);
    },

    onCollisionEnter: function (other, self)
    {
        var drop = other.getComponent("Drop");
        drop.showFadeOutLabel();
        if (drop.dropState == DropState.HELPFUL)
        {
            require("GameManager").instance.addScore();
        }
        else {
            require("GameManager").instance.loseLife();
        }
        other.node.destroy();
    },

    showShape: function (index)
    {
        this.shapeSprite.spriteFrame = this.shapeSpriteFrames[index];
        this.shapeSprite.node.width = this.shapeSpriteFrames[index].getTexture().width;
        this.shapeSprite.node.height = this.shapeSpriteFrames[index].getTexture().height;
        this.shapeSprite.node.scaleX =require("GameManager").instance.initialScaleFactor;
        this.shapeSprite.node.scaleY = require("GameManager").instance.initialScaleFactor;
    },

    initial: function () {
        this.showShape(0);
    },
});
