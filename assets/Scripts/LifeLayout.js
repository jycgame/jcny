cc.Class({
    extends: cc.Component,

    properties: {
        lifeNodes: [cc.Node],
    },

    showLife: function (num) {
        for (var i = 0; i < this.lifeNodes.length; i++) {
            if (i <= num - 1) {
                this.lifeNodes[i].active = true;
            }
            else {
                this.lifeNodes[i].active = false;
            }
        }
    },
});
