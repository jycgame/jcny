var DropManager = require("DropManager");
var Player = require("Player");
var GameState = require("GameState");
var SuccessPanelCom = require("SuccessPanelCom");
var FailPanelCom = require("FailPanelCom");
var GamePanel = require("GamePanel");
var FireworkManager = require("FireworkManager");
var MusicManager = require("MusicManager");
var Chengzhang = require("Chengzhang");

var Gamemanager = cc.Class({
    extends: cc.Component,

    properties: () => ({
        dropManager: DropManager,
        player: Player,
        panelNodes: [cc.Node],
        successPanelCom: SuccessPanelCom,
        failPanelCom: FailPanelCom,
        gamePanel: GamePanel,
        fadeOutConatainerNode: cc.Node,
        fireworkManager: FireworkManager,
        chengzhang: Chengzhang,
        duration: 0.5,
        initialScaleFactor: 1.5,
    }),

    minRange: null,
    maxRange: null,
    minInterval: null,
    maxInterval: null,
    minSpeed: null,
    maxSpeed: null,
    totalLife: null,
    currentLife: null,
    totalTime: null,
    targetScore: null,
    scoreAdd: null,
    currentScore: null,
    growInfos: null,
    dropStates: null,
    dropChances: null,
    dropNames: null,
    accessToken: null,
    gameId: null,
    saveUrl: null,
    listUrl: null,

    statics: {
        instance: null,
    },

    // use this for initialization
    onLoad: function () {
        Gamemanager.instance = this;
        //this.accessToken = "539b9b7a52b040949661e2b8a1ce2e77";
        this.accessToken = this.getURLParameter("token");
        this.gameId = "6";
        this.saveUrl = "https://jcyapi.easybao.com/jcy-api/jcygame/user/game/saveGameProcess";
        this.listUrl = "https://jcyapi.easybao.com/jcy-api/jcygame/user/game/getGameList";
        this.readData();
        this.loadData();
    },

    getURLParameter: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    },

    saveData: function () {
        var myDate = new Date();

        var paramJson = {
            "accessToken": this.accessToken,
            "gameId": this.gameId,
            "time": myDate.getFullYear() + "-" + myDate.getMonth() + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds(),
            "process" : "1",
        };

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", this.saveUrl);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(paramJson));

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var obj = JSON.parse(xmlhttp.responseText);
                    if (obj.data == null) {
                        console.error("Can't find user name by user id!");
                        return;
                    }
                }
                else {
                    cc.log("saveData error!");
                }
            }
        }
    },

    loadData: function () {
        var paramJson = {
            "accessToken": this.accessToken,
        };

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", this.listUrl);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(paramJson));

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var obj = JSON.parse(xmlhttp.responseText);
                    if (obj.data == null) {
                        console.error("Can't find user name by user id!");
                        return;
                    }
                }
                else {
                    cc.log("loadData error!");
                }
            }
        }
    },

    readData: function () {
        var self = this;
        cc.loader.loadRes("Data/LevelData", function (err, data) {
            var lines = data.trim().split("\n");
            self.getBasicInfo(lines, 2);
            self.getGrowInfo(lines, 2);
            self.getDropInfo(lines, 3);
            
            //self.dropManager.initial(self.minRange, self.maxRange, self.minInterval, self.maxInterval,
            //    self.minSpeed, self.maxSpeed, self.dropStates, self.dropChances);
        });
    },

    startGame: function () {
        if (!cc.sys.localStorage.getItem("isFresh")) {
            this.changeToPanel(GameState.GUIDE);
            cc.sys.localStorage.setItem("isFresh", "true");
            return;
        }
        this.currentScore = 0;
        this.currentLife = this.totalLife;
        this.changeToPanel(GameState.GAME);
        this.gamePanel.showScore(this.currentScore);
        this.gamePanel.showLife(this.currentLife);
        this.dropManager.initial(this.minRange, this.maxRange, this.minInterval, this.maxInterval,
            this.minSpeed, this.maxSpeed, this.dropStates, this.dropChances, this.dropNames);
        this.player.initial();
        for (var i = 0; i < this.fadeOutConatainerNode.childrenCount; i++) {
            this.fadeOutConatainerNode.children[i].destroy();
        }
        MusicManager.instance.playBackgroundAudio(0);
        this.chengzhang.initial(this.growInfos[1], this.growInfos[2], this.growInfos[3], this.growInfos[4]);
    },

    getBasicInfo: function (lines, offset) {
        var startIndex = this.getIndex(lines, "BasicInfo")
        var endIndex = this.getIndex(lines, "BasicInfoEnd")

        for (var i = startIndex + offset; i < endIndex; i++) {
            var items = lines[i].trim().split(",");
            this.minRange = parseFloat(items[0].split("|")[0]);
            this.maxRange = parseFloat(items[0].split("|")[1]);
            this.minInterval = parseFloat(items[1].split("|")[0]);
            this.maxInterval = parseFloat(items[1].split("|")[1]);
            this.minSpeed = parseFloat(items[2].split("|")[0]);
            this.maxSpeed = parseFloat(items[2].split("|")[1]);
            this.totalLife = parseInt(items[3]);
            this.totalTime = parseInt(items[4]);
            this.targetScore = parseInt(items[5]);
            this.scoreAdd = parseInt(items[6]);
        }
    },

    getGrowInfo: function (lines, offset) {
        var startIndex = this.getIndex(lines, "GrowInfo")
        var endIndex = this.getIndex(lines, "GrowInfoEnd")
        this.growInfos = new Array();

        var index = 0;
        for (var i = startIndex + offset; i < endIndex; i++) {
            var items = lines[i].trim().split(",");
            this.growInfos[index] = parseInt(items[1]);
            index++;
        }

        this.targetScore = this.growInfos[this.growInfos.length - 1];
    },

    getDropInfo: function (lines, offset) {
        var startIndex = this.getIndex(lines, "DropInfo")
        var endIndex = this.getIndex(lines, "DropInfoEnd")
        this.dropStates = new Array();
        this.dropChances = new Array();
        this.dropNames = new Array();

        var index = 0;
        for (var i = startIndex + offset; i < endIndex; i++) {
            var items = lines[i].trim().split(",");
            this.dropStates[index] = parseInt(items[1]);
            this.dropChances[index] = parseFloat(items[2]);
            this.dropNames[index] = parseInt(items[0]);
            index++;
        }
    },

    getIndex: function (lines, str) {
        var index = null;

        for (var i = 0; i < lines.length; i++) {
            if (lines[i].trim().split(",")[0] == str) {
                index = i;
                break;
            }
        }

        return index;
    },

    addScore: function () {
        this.currentScore += this.scoreAdd;
        this.gamePanel.showScore(this.currentScore);
        console.log(this.currentScore);

        for (var i = this.growInfos.length -1; i >= 0 ; i--) {
            if (this.currentScore >= this.growInfos[i])
            {
                if (i == this.growInfos.length - 1)
                {
                    this.changeToPanel(GameState.WIN);
                    this.saveData();
                    this.fireworkManager.initial();
                }
                else {
                    MusicManager.instance.playSfxAudio(2);
                    if (this.player.shapeSpriteFrames[i] != this.player.shapeSprite.spriteFrame) {
                        this.player.showShape(i);
                        MusicManager.instance.playSfxAudio(0);
                        var action = cc.sequence(cc.scaleTo(this.duration, this.initialScaleFactor * 1.3, this.initialScaleFactor * 1.3), cc.scaleTo(this.duration, this.initialScaleFactor, this.initialScaleFactor));
                        this.player.shapeSprite.node.runAction(action);
                    }
                    break;
                }
            }
        }

        if (this.currentScore >= this.targetScore) {
            this.changeToPanel(GameState.WIN);
        }
    },

    loseLife: function () {
        this.currentLife -= 1;
        this.gamePanel.showLife(this.currentLife);
        MusicManager.instance.playSfxAudio(1);
        if (this.currentLife <= 0) {
            this.changeToPanel(GameState.LOSE);
            MusicManager.instance.playBackgroundAudioOnce(1);
        }
    },

    changeToPanel: function (stateValue) {
        for (var i = 0; i < this.panelNodes.length; i++) {
            if (i == stateValue) {
                this.panelNodes[i].active = true;
                switch (i) {
                    case GameState.WIN:
                        this.successPanelCom.showInfo(this.currentScore);
                        break;
                    case GameState.LOSE:
                        this.failPanelCom.showInfo(this.currentScore);
                        break;
                }
            }
            else {
                this.panelNodes[i].active = false;
            }
        }
    },

    returnToMain: function () {
        cc.director.loadScene("Main");
    },

    playAgain: function () {
        this.startGame();
    },
});
