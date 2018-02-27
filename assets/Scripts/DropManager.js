var DropState = require("DropState");

cc.Class({
    extends: cc.Component,

    properties: {
        dropPrefab: cc.Prefab,
        spawnPosY: 1960,
        minRange: 0.2,
        maxRange: 0.8,
        minInterval: 1,
        maxInterval: 3,
        minSpeed: 100,
        maxSpeed: 300,
        dropStates: [],
        dropChances: [],
        dropNames: [],
        //图片来源于内存，因此必须保证内存中的图片顺序与读取文件中的图片顺序相同
        dropSpriteFrames: [cc.SpriteFrame],
        currentTime: 0,
        waitTime: 0,
    },

    initial: function (minRange, maxRange, minInterval, maxInterval, minSpeed, maxSpeed, dropStates, dropChances, dropNames)
    {
        for (var i = 0; i < this.node.childrenCount; i++) {
            this.node.children[i].destroy();
        }

        this.minRange = minRange;
        this.maxRange = maxRange;
        this.minInterval = minInterval;
        this.maxInterval = maxInterval;
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;
        this.dropStates = dropStates;
        this.dropChances = dropChances;
        this.dropNames = dropNames;
        this.currentTime = 0;
        //默认游戏开始时先等待1秒
        this.waitTime = 1;
    },

    spawn: function ()
    {
        var spawnPos = cc.v2((this.minRange + Math.random() * (this.maxRange - this.minRange)) * 1080, this.spawnPosY);
        var spawnSpeed = this.minSpeed + Math.random() * (this.maxSpeed - this.minSpeed);
        var dropIndex = this.getRandomIndex();
        var frame = this.dropSpriteFrames[dropIndex];
        var state = this.dropStates[dropIndex];
        var name = this.dropNames[dropIndex];

        var dropNode = cc.instantiate(this.dropPrefab);
        dropNode.parent = this.node;
        dropNode.position = spawnPos;
        var drop = dropNode.getComponent("Drop");
        drop.initial(frame, state, spawnSpeed, name);
    },

    getRandomIndex: function ()
    {
        var index = null;
        var value = Math.random();
        var chanceRank = 0;

        var hasRank = false;
        for (var i = 0; i < this.dropChances.length; i++) {
            chanceRank += this.dropChances[i];
            if (value <= chanceRank)
            {
                index = i;
                hasRank = true;
                break;
            }
        }

        if (!hasRank)
        {
            index = this.dropChances.length - 1;
        }

        return index;
    },

    update: function(dt){
        this.currentTime += dt;
        if (this.currentTime >= this.waitTime)
        {
            this.spawn();
            this.changeWaitTime();
            this.currentTime = 0;
        }
    },

    changeWaitTime: function ()
    {
        this.waitTime = this.minInterval + Math.random() * (this.maxInterval - this.minInterval);
    },
});
