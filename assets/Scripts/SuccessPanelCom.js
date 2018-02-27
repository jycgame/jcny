cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
    },

    showInfo: function (score) {
        var sc = 0;
        if (score)
        {
            sc = score;
        }
        this.label.string = sc;
    },
});