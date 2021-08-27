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
var BOT_ID = "newflood1"; // change this
var BOT_PASSWORD = "khan00"; // change this
var HANDLER_LOGIN = "login";
var HANDLER_LOGIN_EVENT = "login_event";
var HANDLER_ROOM_JOIN = "room_join";
var HANDLER_ROOM_EVENT = "room_event";
var HANDLER_ROOM_ADMIN = "room_admin";
var HANDLER_ROOM_MESSAGE = "room_message";
var HANDLER_PROFILE_OTHER = "profile_other";
var TARGET_ROLE_MEMBER = "member";
var TARGET_ROLE_KICK = "kick";
var TARGET_ROLE_OUTCAST = "outcast";
var TARGET_ROLE_NONE = "none";
var TARGET_ROLE_ADMIN = "admin";
var TARGET_ROLE_OWNER = "owner";
var CHANGE_ROLE = "change_role";
var ROLE_CHANGED = "role_changed";
var emojis = ["😀", "☑️", "😁", "😊", "😍", "😘", "🤪", "🤭", "🤥", "🥵", "🥳", "😨", "😤", "🤬",
    "☠", "👻", "🤡", "💌", "💤", "👍"];
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
        this.roomName = "smile"; // change this ==> eg. american
        this.tempRoom = "";
        this.isOnlyPhoto = false;
        // Bot Master ID
        this.botMasterId = "dj"; // change this ==> eg. docker
        this.usersMap = new Map();
        this.user_list = [];
        // you can add more list of spins
        this.listEmojis = [
            'You got 🐠😾', 'You are sweet 😍', 'Goodnight 🌠°', 'Take 🍔🍔', 'Are you old enough to vote?', 'You got 🍪', 'You shattap 😡🎃',
            'You got 🎁', 'You found 🎅', 'Are you gonna help me or what?	', 'Your name?', 'You got 🎀', 'You got 👻', 'You are 🐊',
            'Can you drive a car? ', 'You got 🍒 🍰 ', 'Dont you dare😈 😈', 'What did you do with my pants?', 'Staying at home is boring.',
            'You got 🐜', 'You got 🎀', 'You won 🏆', 'You are 🐫', 'Which do you like better, white wine or red wine?', 'You got 💥', 'You got 🎉💘'
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
            console.log("ping");
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
        var _this = this;
        if (parsedData.handler == HANDLER_LOGIN_EVENT) {
            if (parsedData.type == "success") {
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
            if (parsedData.type == "you_joined") {
                //
                setInterval(function () {
                    if (_this.webSocket != null && _this.webSocket.readyState == WebSocket.OPEN) {
                        var groupMsgPayload = { handler: HANDLER_ROOM_MESSAGE, id: _this.keyGen(20, true), room: _this.roomName, type: MESSAGE_TYPE.TEXT, url: "", body: get_random(emojis), length: "" };
                        _this.webSocket.send(JSON.stringify(groupMsgPayload));
                    } //
                }, 120000);
            }
            if (parsedData.type == "room_unsufficient_previlige") {
                var room_1 = parsedData.name;
                this.sendRoomMsg(room_1, "❌ Insufficient Privileges.");
            }
            if (parsedData.type == ROLE_CHANGED) {
                var room_2 = parsedData.name;
                var userName_1 = parsedData.t_username;
                var newRole = parsedData.new_role;
                this.sendRoomMsg(room_2, "✅ " + userName_1 + " is now " + newRole + ".");
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
        if (parsedData.handler == HANDLER_ROOM_ADMIN) {
            if (parsedData.type == "occupants_list") {
                this.tempRoom = parsedData.room;
                var msg_1 = "";
                while (this.user_list.length > 0) {
                    this.user_list.pop();
                }
                for (var i = 0; i < parsedData.occupants.length; i++) {
                    this.user_list.push(parsedData.occupants[i].username);
                    var suffix = "";
                    if (i === parsedData.occupants.length - 1) { }
                    else {
                        suffix = "\n";
                    }
                    msg_1 += (i + 1) + " " + parsedData.occupants[i].username + suffix;
                }
                if (msg_1.length > 0) {
                    this.sendRoomMsg(parsedData.room, msg_1);
                }
            }
        }
    };
    Client.prototype.grantAdmin = function (targetId, roomName) {
        var adminPayload = { handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: CHANGE_ROLE, room: roomName, t_username: targetId, t_role: TARGET_ROLE_ADMIN };
        if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(adminPayload));
        }
    };
    Client.prototype.grantOwner = function (targetId, roomName) {
        var ownerPayload = { handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: CHANGE_ROLE, room: roomName, t_username: targetId, t_role: TARGET_ROLE_OWNER };
        if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(ownerPayload));
        }
    };
    Client.prototype.grantMember = function (targetId, roomName) {
        var memPayload = { handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: CHANGE_ROLE, room: roomName, t_username: targetId, t_role: TARGET_ROLE_MEMBER };
        if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(memPayload));
        }
    };
    Client.prototype.banUser = function (targetId, roomName) {
        var outcastPayload = { handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: CHANGE_ROLE, room: roomName, t_username: targetId, t_role: TARGET_ROLE_OUTCAST };
        if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(outcastPayload));
        }
    };
    Client.prototype.grantNone = function (targetId, roomName) {
        var nonePayload = { handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: CHANGE_ROLE, room: roomName, t_username: targetId, t_role: TARGET_ROLE_NONE };
        if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(nonePayload));
        }
    };
    Client.prototype.processGroupChatMessage = function (from, message, room) {
        return __awaiter(this, void 0, void 0, function () {
            var search, videos, msg, random, search, targetId, str, targetId, str, targetId, str, targetId, str, targetId, kickPayload, str, targetId, str, targetId, str, targetId, str, targetId, roomUsersPayload, targetIndex;
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
                        if (message.toLowerCase() == "!cmd") {
                            msg = "➩ spin - .s" + "\n" +
                                "➩ kick - k ID" + "\n" +
                                "➩ ban - b ID" + "\n" +
                                "➩ owner - o ID" + "\n" +
                                "➩ admin - a ID" + "\n" +
                                "➩ member - m ID" + "\n" +
                                "➩ none - n ID" + "\n" +
                                "➩ room users - .l";
                            this.sendRoomMsg(room, msg);
                        }
                        // SPIN 
                        if (message.toLowerCase() == '.s' || message.toLowerCase() == 'spin') {
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
                                this.grantMember(targetId, room);
                            }
                        }
                        // Kick User
                        if (message.indexOf('k ') === 0) {
                            str = message.substring(2).toString();
                            targetId = str.replace(/\s/g, "");
                            this.tempRoom = room;
                            if (from == this.botMasterId) {
                                kickPayload = { handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: TARGET_ROLE_KICK, room: room, t_username: targetId, t_role: "none" };
                                if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
                                    this.webSocket.send(JSON.stringify(kickPayload));
                                }
                            }
                        }
                        if (message.indexOf('b ') === 0) {
                            str = message.substring(2).toString();
                            targetId = str.replace(/\s/g, "");
                            this.tempRoom = room;
                            if (from == this.botMasterId) {
                                this.banUser(targetId, room);
                            }
                        }
                        if (message.indexOf('n ') === 0) {
                            str = message.substring(2).toString();
                            targetId = str.replace(/\s/g, "");
                            this.tempRoom = room;
                            if (from == this.botMasterId) {
                                this.grantNone(targetId, room);
                            }
                        }
                        if (message.indexOf('a ') === 0) {
                            str = message.substring(2).toString();
                            targetId = str.replace(/\s/g, "");
                            this.tempRoom = room;
                            if (from == this.botMasterId) {
                                this.grantAdmin(targetId, room);
                            }
                        }
                        if (message.indexOf('o ') === 0) {
                            str = message.substring(2).toString();
                            targetId = str.replace(/\s/g, "");
                            this.tempRoom = room;
                            if (from == this.botMasterId) {
                                this.grantOwner(targetId, room);
                            }
                        }
                        if (message.toLowerCase() == ".l") {
                            this.tempRoom = room;
                            if (from == this.botMasterId) {
                                roomUsersPayload = { handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: "occupants_list", room: room, t_username: "username", t_role: "none" };
                                if (this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN) {
                                    this.webSocket.send(JSON.stringify(roomUsersPayload));
                                }
                            }
                        }
                        if (message.toLowerCase().startsWith(".a ") || message.toLowerCase().startsWith(".o ") || message.toLowerCase().startsWith(".b ") || message.toLowerCase().startsWith(".m ")
                            || message.toLowerCase().startsWith(".n ")) {
                            targetIndex = message.substring(3);
                            if (this.user_list) {
                                if (isNaN(targetIndex)) {
                                    console.log("Invalid Input");
                                }
                                else {
                                    if (targetIndex <= this.user_list.length) {
                                        //console.log(this.user_list[targetId-1]);
                                        if (message.toLowerCase().substring(0, 2).trim() == ".a") {
                                            this.grantAdmin(this.user_list[targetIndex - 1], room);
                                        }
                                        else if (message.toLowerCase().substring(0, 2).trim() == ".o") {
                                            this.grantOwner(this.user_list[targetIndex - 1], room);
                                        }
                                        else if (message.toLowerCase().substring(0, 2).trim() == ".m") {
                                            this.grantMember(this.user_list[targetIndex - 1], room);
                                        }
                                        else if (message.toLowerCase().substring(0, 2).trim() == ".b") {
                                            this.banUser(this.user_list[targetIndex - 1], room);
                                        }
                                        else if (message.toLowerCase().substring(0, 2).trim() == ".n") {
                                            this.grantNone(this.user_list[targetIndex - 1], room);
                                        }
                                    }
                                    else {
                                        //console.log("Invalid Input");
                                        this.sendRoomMsg(room, "❌ Invalid user selected!");
                                    }
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
function get_random(list) {
    return list[Math.floor((Math.random() * list.length))];
}
function chunkSubstr(str, size) {
    var numChunks = Math.ceil(str.length / size);
    var chunks = new Array(numChunks);
    for (var i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size);
    }
    //console.log(chunks);
    return chunks;
}
// Created by docker aka db~@NC - B'cuz we share :P
new Client(BOT_ID, BOT_PASSWORD);
