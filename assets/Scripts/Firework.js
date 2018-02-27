cc.Class({
    extends: cc.Component,

    audioSource: null,

    onLoad: function () {
        this.audioSource = this.getComponent(cc.AudioSource);
    },

    onPlay: function () {
        this.audioSource.play();
    },

    onEnd: function () {
        this.node.active = false;
    },
});
