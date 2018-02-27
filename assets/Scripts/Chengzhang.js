cc.Class({
    extends: cc.Component,

    properties: {
        maskNode: cc.Node,
        firstPart: 0.2,
        secondPart: 0.229,
        thirdPart: 0.246,
        forthPart: 0.334,
    },

    initialHeight: 0,
    firstHeight: 0,
    secondHeight: 0,
    thirdHeight: 0,
    forthHeight: 0,
    scoreParts: null,
    scores: null,

    // use this for initialization
    onLoad: function () {
        this.initialHeight = this.maskNode.height;
        this.firstHeight = this.initialHeight * this.firstPart;
        this.secondHeight = this.initialHeight * this.secondPart;
        this.thirdHeight = this.initialHeight * this.thirdPart;
        this.forthHeight = this.initialHeight * this.forthPart;
    },

    initial(first, second, third, forth) {
        this.scoreParts = new Array();
        this.scoreParts.push(this.firstPart);
        this.scoreParts.push(this.secondPart);
        this.scoreParts.push(this.thirdPart);
        this.scoreParts.push(this.forthPart);

        this.scores = new Array();
        this.scores.push(first);
        this.scores.push(second - first);
        this.scores.push(third - second);
        this.scores.push(forth - third);
    },

    update: function (dt) {
        var currentScore = require("GameManager").instance.currentScore;
        var totalPart = 0;

        for (var i = 0; i < this.scores.length; i++) {
            var prev = currentScore;
            currentScore -= this.scores[i];
            if (currentScore <= 0) {
                totalPart += prev / this.scores[i] * this.scoreParts[i];
                break;
            }
            else {
                totalPart += this.scoreParts[i]
            }
        }
        this.maskNode.height = this.initialHeight * totalPart;
    },
});
