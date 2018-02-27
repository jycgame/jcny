var GameManager = require("GameManager");

cc.Class({
    extends: cc.Component,

    properties: {
        duration: 2,
        offsetY: 200,
        spriteFrames: [cc.SpriteFrame],
    },

    sprite: cc.Sprite,

    onLoad: function () {
        this.sprite = this.getComponent(cc.Sprite);
    },

    showEffect: function (nameIndex)
    {
        this.sprite.spriteFrame = this.spriteFrames[nameIndex];
        var action = cc.sequence(cc.spawn(cc.moveBy(this.duration, cc.v2(0, this.offsetY)), cc.fadeOut(this.duration, 0).easing(cc.easeOut(1))), cc.callFunc(function () { this.node.destroy(); }, this));
        this.node.runAction(action);
    },
});
