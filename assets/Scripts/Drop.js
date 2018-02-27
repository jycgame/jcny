var DropState = require("DropState");
var GameManager = require("GameManager");

cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
        dropState: null,
        dropSpeed: 0,
        dropName: null,
        fadeOutLabelPrefab: cc.Prefab,
    },

    initial: function (spriteFrame, state, speed, name) {
        var boxCol = this.getComponent(cc.BoxCollider);
        this.sprite.spriteFrame = spriteFrame;
        this.node.width = spriteFrame.getTexture().width;
        this.node.height = spriteFrame.getTexture().height;
        //var scale = 150 / this.node.width; 
        //this.node.width = 150;
        //this.node.height = 150;
        //boxCol.size.width = this.node.width * 0.8;
        //boxCol.size.height = this.node.height * 0.533;
        this.dropState = state;
        this.dropSpeed = speed;
        this.dropName = name;
    },

    showFadeOutLabel: function ()
    {
        var fadeOut = cc.instantiate(this.fadeOutLabelPrefab).getComponent("FadeOutLabelCom");
        fadeOut.node.position = this.node.position;
        fadeOut.node.parent = GameManager.instance.fadeOutConatainerNode;
        fadeOut.showEffect(this.dropName);
    },

    update: function (dt) {
        this.node.position = this.node.position.add(cc.v2(0, -1).mul(this.dropSpeed).mul(dt));
    },
});
