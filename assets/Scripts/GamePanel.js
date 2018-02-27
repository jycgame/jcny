cc.Class({
    extends: cc.Component,

    properties: {
        lifeLabel: cc.Label,
        scoreLabel: cc.Label,
        lifeLayout: require("LifeLayout"),
    },

    showLife: function (life)
    {
        this.lifeLabel.string = life;
        this.lifeLayout.showLife(life);
    },

    showScore: function (score)
    {
        this.scoreLabel.string = score;
    },
});
