cc.Class({
    extends: cc.Component,

    properties: {
        fireworkAnims: [cc.Animation],
        timeInterval: 0.25,
        currentTime: 0,
        currentIndex: 0,
    },

    initial: function () {
        this.currentIndex = 0;
        this.currentTime = 0;
    },

    update: function (dt) {
        if (this.currentIndex >= this.fireworkAnims.length) {
            return;
        }

        this.currentTime += dt;
        if (this.currentTime >= this.timeInterval) {
            this.fireworkAnims[this.currentIndex].node.active = true;
            this.fireworkAnims[this.currentIndex].play();
            this.currentTime = 0;
            this.currentIndex++;
        }
    },
});
