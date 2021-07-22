"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.Client = void 0;
var WebSocket = require("ws");
var yt = require("youtube-search-without-api-key");
var BOT_ID = "Bot Id";
var BOT_PASSWORD = "Password";
var HANDLER_LOGIN = "login";
var HANDLER_LOGIN_EVENT = "login_event";
var HANDLER_ROOM_JOIN = "room_join";
var HANDLER_ROOM_EVENT = "room_event";
var HANDLER_ROOM_ADMIN = "room_admin";
var HANDLER_ROOM_MESSAGE = "room_message";
var HANDLER_PROFILE_OTHER = "profile_other";
var TARGET_ROLE_MEMBER = "member";
var TARGET_ROLE_KICK = "kick";
var CHANGE_ROLE = "change_role";
var MESSAGE_TYPE;
(function (MESSAGE_TYPE) {
    MESSAGE_TYPE["TEXT"] = "text";
    MESSAGE_TYPE["IMAGE"] = "image";
})(MESSAGE_TYPE || (MESSAGE_TYPE = {}));
var Client = /** @class */ (function () {
    function Client(user, pass) {
        this.URL = 'wss://chatp.net:5333/server';
        this.webSocket = null;
        this.userName = "";
        this.passWord = "";
        this.roomName = "american"; // change this ==> eg. american
        this.tempRoom = "";
        this.isOnlyPhoto = false;
        // Bot Master ID
        this.botMasterId = "docker"; // change this ==> eg. docker
        // you can add more list of spins
        this.listEmojis = [
            'You got 🐠😾',
            'You are sweet 😍',
            'Goodnight 🌠°',
            'Take 🍔🍔',
            'Are you old enough to vote?',
            'You got 🍪',
            'You shattap 😡🎃',
            'You got 🎁',
            'You found 🎅',
            'Are you gonna help me or what?	',
            'Your name?',
            'You got 🎀',
            'You got 👻',
            'Which do you like better, white wine or red wine?',
            'Can you drive a car? ',
            'You are 🐊',
            'You got 🍒 🍰 ',
            'Dont you dare😈 😈',
            'What did you do with my pants?	',
            'Staying at home is boring.	',
            'You got 🐜',
            'You got 🎀',
            'You won 🏆',
            'You are 🐫',
            'You got 💥',
            'You got 🎉💘'
        ];
        this.userName = user;
        this.passWord = pass;
        var headers = {
            "headers": {
                "m": this.generateBuildInfo(),
                "i": this.keyGen(16)
            }
        };
        console.log(this.generateBuildInfo());
        console.log(this.keyGen(16));
        this.webSocket = new WebSocket(this.URL, [], JSON.stringify(headers));
        this.webSocket.addEventListener("open", this._onOpen.bind(this));
        this.webSocket.addEventListener("close", this._onClose.bind(this));
        this.webSocket.addEventListener("message", this._onMsg.bind(this));
    }
    Client.prototype.intervalFunc = function () {
        if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(""); // blank msgs
        }
    };
    Client.prototype._log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.warn.apply(console, __spreadArray(["[DBH4CK LOG]"], msg));
    };
    Client.prototype._onClose = function (close) {
        //clearInterval(this);
        this._log("ws: Socket closed");
    };
    Client.prototype._onPing = function (ping) {
        this._log(ping);
        if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send("PONG");
        }
    };
    Client.prototype._onOpen = function (open) {
        this._log("ws: Socket opened");
        this.login();
    };
    Client.prototype._onMsg = function (payload) {
        if (payload != null) {
            this._log(payload.data);
            var parsedData = JSON.parse(payload.data);
            this._handleParsedData(parsedData);
        }
    };
    Client.prototype._handleParsedData = function (parsedData) {
        if (parsedData.handler == HANDLER_LOGIN_EVENT) {
            if (parsedData.type == "success") {
                setInterval(this.intervalFunc, 45000);
                this.joinRoom(this.roomName);
            }
        }
        if (parsedData.handler == HANDLER_ROOM_EVENT) {
            if (parsedData.type == "text") {
                var from = parsedData.from;
                var message = parsedData.body;
                var room = parsedData.room;
                this.processGroupChatMessage(from, message, room);
            }
            if (parsedData.type == "user_joined") {
                var user = parsedData.username;
                var group = parsedData.name;
                var role = parsedData.role;
                var welcomeStr = "Welcome: " + user + " 😜";
                //this.processGroupChatMessage(this.userName, welcomeStr, group);
                this.sendRoomMsg(group, welcomeStr);
            }
        }
        if (parsedData.handler == HANDLER_PROFILE_OTHER) {
            var userId = parsedData.user_id;
            var userName = parsedData.type;
            var gender = parsedData.gender;
            var genderStr = "";
            if (gender == 1) {
                genderStr = "Male";
            }
            else if (gender == 2) {
                genderStr = "Female";
            }
            else {
                genderStr = "Not defined";
            }
            var statusMsg = parsedData.status;
            var friendsCount = parsedData.roster_count;
            var regDate = parsedData.reg_date;
            var merchant = parsedData.is_merchant;
            var merchantStr = "";
            if (merchant == 0) {
                merchantStr = "No";
            }
            else if (merchant == 1) {
                merchantStr = "Yes";
            }
            else {
                merchantStr = "Not defined";
            }
            var agent = parsedData.is_agent;
            var agentStr = "";
            if (agent == 0) {
                agentStr = "No";
            }
            else if (agent == 1) {
                agentStr = "Yes";
            }
            else {
                agentStr = "Not defined";
            }
            var country = parsedData.country;
            var photo = parsedData.photo_url;
            if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
                var msg = "Userid: " + userId + "\n" +
                    "Username: " + userName + "\n" +
                    "Status: " + statusMsg + "\n" +
                    "Gender: " + genderStr + "\n" +
                    "Friends: " + friendsCount + "\n" +
                    "Is Merchant: " + merchantStr + "\n" +
                    "Is Agent: " + agentStr + "\n" +
                    "Country: " + country + "\n" +
                    "Photo: " + photo + "\n" +
                    "User since: " + regDate + "";
                if (this.tempRoom != null && this.tempRoom.length > 0) {
                    if (this.isOnlyPhoto == true) {
                        if (photo != null && photo.length > 0) {
                            this.sendRoomMsg(this.tempRoom, "", photo);
                        }
                        else {
                            this.sendRoomMsg(this.tempRoom, "No Photo Found!");
                        }
                    }
                    else {
                        this.sendRoomMsg(this.tempRoom, msg);
                    }
                }
            }
        }
    };
    Client.prototype.processGroupChatMessage = function (from, message, room) {
        return __awaiter(this, void 0, void 0, function () {
            var search, videos, random, search, targetId, str, targetId, str, targetId, str, targetId, memPayload, str, targetId, memPayload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(from + " : " + message);
                        if (from == this.userName) {
                        }
                        if (!(message.indexOf('!yt ') === 0)) return [3 /*break*/, 2];
                        search = message.substring(4).toString();
                        console.log('Fetching YT for: "' + search.replace(/\s/g, "") + '"');
                        return [4 /*yield*/, yt.search(search.replace(/\s/g, ""))];
                    case 1:
                        videos = _a.sent();
                        console.log(videos[0].url);
                        this.sendRoomMsg(room, videos[0].url);
                        _a.label = 2;
                    case 2:
                        // SPIN 
                        if (message.indexOf('.s') === 0 || message.indexOf('.S') === 0 || message.indexOf('spin') === 0) {
                            random = Math.floor(Math.random() * this.listEmojis.length);
                            this.sendRoomMsg(room, from + ": " + this.listEmojis[random]);
                        }
                        // Profile
                        if (message.indexOf('!pro ') === 0) {
                            search = message.substring(5).toString();
                            targetId = search.replace(/\s/g, "");
                            this.tempRoom = room;
                            if (from == this.botMasterId) {
                                this.isOnlyPhoto = false;
                                this.fetchUserProfile(targetId, room);
                            }
                        }
                        // Join Group
                        if (message.indexOf('!join ') === 0) {
                            str = message.substring(6).toString();
                            targetId = str.replace(/\s/g, "");
                            if (from == this.botMasterId) {
                                this.joinRoom(targetId);
                            }
                        }
                        // Avatar Pic
                        if (message.indexOf('!avi ') === 0) {
                            str = message.substring(5).toString();
                            targetId = str.replace(/\s/g, "");
                            this.tempRoom = room;
                            if (from == this.botMasterId) {
                                this.isOnlyPhoto = true;
                                this.fetchUserProfile(targetId, room);
                            }
                            //this.sendRoomMsg("american", "", "test.jpg");
                        }
                        // Member User
                        if (message.indexOf('m ') === 0) {
                            str = message.substring(2).toString();
                            targetId = str.replace(/\s/g, "");
                            this.tempRoom = room;
                            if (from == this.botMasterId) {
                                memPayload = { handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: CHANGE_ROLE, room: room, t_username: targetId, t_role: TARGET_ROLE_MEMBER };
                                if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
                                    this.webSocket.send(JSON.stringify(memPayload));
                                }
                            }
                        }
                        // Kick User
                        if (message.indexOf('k ') === 0) {
                            str = message.substring(2).toString();
                            targetId = str.replace(/\s/g, "");
                            this.tempRoom = room;
                            if (from == this.botMasterId) {
                                memPayload = { handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: CHANGE_ROLE, room: room, t_username: targetId, t_role: TARGET_ROLE_KICK };
                                if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
                                    this.webSocket.send(JSON.stringify(memPayload));
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.fetchUserProfile = function (targetId, room) {
        var userSearchPayload = { handler: HANDLER_PROFILE_OTHER, id: this.keyGen(20, true), type: targetId };
        if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(userSearchPayload));
        }
    };
    Client.prototype.joinRoom = function (roomName) {
        var groupJoinPayload = { handler: HANDLER_ROOM_JOIN, id: this.keyGen(20), name: roomName };
        if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(groupJoinPayload));
        }
    };
    Client.prototype.login = function () {
        var loginPayload = { handler: HANDLER_LOGIN, id: this.keyGen(20), username: this.userName, password: this.passWord };
        if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(loginPayload));
        }
    };
    Client.prototype.keyGen = function (keyLength, isMsgId) {
        var i, key = "", characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        if (isMsgId) {
            characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ";
        }
        var charactersLength = characters.length;
        for (i = 0; i < keyLength; i++) {
            key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
        }
        return key;
    };
    Client.prototype.generateBuildInfo = function () {
        var info = "";
        info += "258"; // Fixed Constant
        info += "-"; // -
        info += "Google"; // Manufacturer
        info += "-"; // - 
        info += "Pixel"; // Model
        info += "-"; // -
        info += "30"; // Sdk Api
        return info;
    };
    Client.prototype.sendRoomMsg = function (roomName, msg, photoUrl) {
        var groupMsgPayload = null;
        if (photoUrl) {
            groupMsgPayload = { handler: HANDLER_ROOM_MESSAGE, id: this.keyGen(20, true), room: roomName, type: MESSAGE_TYPE.IMAGE, url: photoUrl, body: "", length: "" };
        }
        else {
            groupMsgPayload = { handler: HANDLER_ROOM_MESSAGE, id: this.keyGen(20, true), room: roomName, type: MESSAGE_TYPE.TEXT, url: "", body: msg, length: "" };
        }
        if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(groupMsgPayload));
        }
    };
    return Client;
}());
exports.Client = Client;
// Created by docker aka db~@NC - B'cuz we share :P
new Client(BOT_ID, BOT_PASSWORD);
