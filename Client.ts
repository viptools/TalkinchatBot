import WebSocket =  require('ws');
import * as yt from 'youtube-search-without-api-key';

const BOT_ID: string = "Bot Id";        // change this
const BOT_PASSWORD: string = "Bot Pwd";     // change this

const HANDLER_LOGIN: string = "login";
const HANDLER_LOGIN_EVENT: string = "login_event";
const HANDLER_ROOM_JOIN: string = "room_join";
const HANDLER_ROOM_EVENT: string = "room_event";
const HANDLER_ROOM_ADMIN: string = "room_admin";
const HANDLER_ROOM_MESSAGE: string = "room_message";
const HANDLER_PROFILE_OTHER: string = "profile_other";
const TARGET_ROLE_MEMBER: string = "member";
const TARGET_ROLE_KICK: string = "kick";
const TARGET_ROLE_OUTCAST: string = "outcast";
const TARGET_ROLE_NONE: string = "none";
const TARGET_ROLE_ADMIN: string = "admin";
const TARGET_ROLE_OWNER: string = "owner";
const CHANGE_ROLE: string = "change_role";
const ROLE_CHANGED: string = "role_changed";

const emojis = ["😀", "☑️", "😁", "😊", "😍", "😘", "🤪", "🤭", "🤥", "🥵", "🥳","😨", "😤", "🤬",
"☠", "👻", "🤡", "💌", "💤", "👍"];

enum MESSAGE_TYPE{
    TEXT = "text",
    IMAGE = "image"
}

export class Client{
    public URL: string = 'wss://chatp.net:5333/server';
    public webSocket: WebSocket = null;
    public userName: string = "";
    public passWord: string = "";
    public roomName: string = "american";       // change this ==> eg. american
    public tempRoom: string = "";
    public isOnlyPhoto: boolean = false;
    // Bot Master ID
    public botMasterId: string = "docker";      // change this ==> eg. docker
    public usersMap = new Map();
    public user_list = [];
    
    // you can add more list of spins
    public listEmojis = [
        'You got 🐠😾', 'You are sweet 😍', 'Goodnight 🌠°', 'Take 🍔🍔', 'Are you old enough to vote?', 'You got 🍪','You shattap 😡🎃',
        'You got 🎁','You found 🎅','Are you gonna help me or what?	','Your name?','You got 🎀','You got 👻','You are 🐊',
        'Can you drive a car? ','You got 🍒 🍰 ','Dont you dare😈 😈','What did you do with my pants?','Staying at home is boring.',
        'You got 🐜','You got 🎀','You won 🏆','You are 🐫', 'Which do you like better, white wine or red wine?','You got 💥','You got 🎉💘'
    ];

    constructor(user: string, pass: string){
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

    _log(...msg) {
        console.warn("[DBH4CK LOG]", ...msg);
     }

    _onClose(close){
        //clearInterval(this);
        this._log("ws: Socket closed");
    }

    _onPing(ping){
        this._log(ping);
        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            console.log("ping");
        }
    }

    _onOpen(open){
        this._log("ws: Socket opened");
        this.login();
    }

    _onMsg(payload){
        if(payload != null){
            this._log(payload.data);

            var parsedData = JSON.parse(payload.data);
            
            this._handleParsedData(parsedData);
        }
    }
      
    _handleParsedData(parsedData){
        if(parsedData.handler == HANDLER_LOGIN_EVENT){
            if(parsedData.type == "success"){
                this.joinRoom(this.roomName);
            }
        }

        if(parsedData.handler == HANDLER_ROOM_EVENT){
            if(parsedData.type == "text"){
                var from = parsedData.from;
                var message = parsedData.body;
                var room = parsedData.room;
                this.processGroupChatMessage(from, message, room);
            }
            if(parsedData.type == "user_joined"){
                var user = parsedData.username;
                var group = parsedData.name;
                var role = parsedData.role;

                var welcomeStr = "Welcome: " + user + " 😜";
                //this.processGroupChatMessage(this.userName, welcomeStr, group);
                this.sendRoomMsg(group, welcomeStr);
            }
            if(parsedData.type == "you_joined"){
                //
                setInterval(() => {    
                    if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
                        let groupMsgPayload = {handler: HANDLER_ROOM_MESSAGE, id: this.keyGen(20, true), room: this.roomName, type: MESSAGE_TYPE.TEXT, url: "", body: get_random(emojis), length: ""};
                        this.webSocket.send(JSON.stringify(groupMsgPayload))
                    } //
                }, 120000);
            }
            if(parsedData.type == "room_unsufficient_previlige"){
                let room = parsedData.name;
                this.sendRoomMsg(room, "❌ Insufficient Privileges.");
            }
            if(parsedData.type == ROLE_CHANGED){
                let room = parsedData.name;
                let userName = parsedData.t_username;
                let newRole = parsedData.new_role;
                this.sendRoomMsg(room, "✅ " + userName + " is now " + newRole + ".");
            }
        }

        if(parsedData.handler == HANDLER_PROFILE_OTHER){
            var userId = parsedData.user_id;
            var userName = parsedData.type;
            var gender = parsedData.gender;
            var genderStr = "";
            if(gender == 1){
                genderStr = "Male";
            }else if(gender == 2){
                genderStr = "Female";
            }else{
                genderStr = "Not defined";
            }
            var statusMsg = parsedData.status;
            var friendsCount = parsedData.roster_count;
            var regDate = parsedData.reg_date;
            var merchant = parsedData.is_merchant;
            var merchantStr = "";
            if(merchant == 0){
                merchantStr = "No";
            }else if(merchant == 1){
                merchantStr = "Yes";
            }else{
                merchantStr = "Not defined";
            }
            var agent = parsedData.is_agent;
            var agentStr = "";
            if(agent == 0){
                agentStr = "No";
            }else if(agent == 1){
                agentStr = "Yes";
            }else{
                agentStr = "Not defined";
            }
            var country = parsedData.country;
            var photo = parsedData.photo_url;
            
            if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
                var msg = "Userid: " + userId + "\n"+
                           "Username: " + userName + "\n"+
                           "Status: " + statusMsg + "\n"+
                           "Gender: " + genderStr + "\n"+
                           "Friends: " + friendsCount + "\n"+
                           "Is Merchant: " + merchantStr + "\n"+
                           "Is Agent: " + agentStr + "\n"+
                           "Country: " + country + "\n"+
                           "Photo: " + photo + "\n"+
                           "User since: "+ regDate+"";
                if(this.tempRoom != null && this.tempRoom.length > 0){
                    if(this.isOnlyPhoto == true){
                        if(photo != null && photo.length > 0){
                            this.sendRoomMsg(this.tempRoom, "", photo);
                        }else{
                            this.sendRoomMsg(this.tempRoom, "No Photo Found!");
                        }
                    }
                    else{
                        this.sendRoomMsg(this.tempRoom, msg);
                    }
                }
            }
        }

        if(parsedData.handler == HANDLER_ROOM_ADMIN){
            if(parsedData.type == "occupants_list"){
                this.tempRoom = parsedData.room;
                let msg = "";
                
                while (this.user_list.length > 0) {
                    this.user_list.pop();
                } 

                for(let i = 0; i < parsedData.occupants.length; i++){
                    this.user_list.push(parsedData.occupants[i].username);
                    var suffix = "";
                    if(i === parsedData.occupants.length-1){}
                    else{
                        suffix = "\n";
                    }
                    msg += (i+1) + " " + parsedData.occupants[i].username + suffix;
                }
                if(msg.length > 0){
                    this.sendRoomMsg(parsedData.room, msg);
                }
            }
        }
    }


    public grantAdmin(targetId: string, roomName: string){
        var adminPayload = {handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: CHANGE_ROLE, room: roomName, t_username: targetId, t_role: TARGET_ROLE_ADMIN};
        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send(JSON.stringify(adminPayload));
        }
    }

    public grantOwner(targetId: string, roomName: string){
        var ownerPayload = {handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: CHANGE_ROLE, room: roomName, t_username: targetId, t_role: TARGET_ROLE_OWNER};
        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send(JSON.stringify(ownerPayload));
        }
    }

    public grantMember(targetId: string, roomName: string){
        var memPayload = {handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: CHANGE_ROLE, room: roomName, t_username: targetId, t_role: TARGET_ROLE_MEMBER};
        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send(JSON.stringify(memPayload));
        }
    }

    public banUser(targetId: string, roomName: string){
        var outcastPayload = {handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: CHANGE_ROLE, room: roomName, t_username: targetId, t_role: TARGET_ROLE_OUTCAST};
        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send(JSON.stringify(outcastPayload));
        }
    }

    public grantNone(targetId: string, roomName: string){
        var nonePayload = {handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: CHANGE_ROLE, room: roomName, t_username: targetId, t_role: TARGET_ROLE_NONE};
        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send(JSON.stringify(nonePayload));
        }
    }

    public async processGroupChatMessage(from, message, room){
        console.log(from + " : " + message);

        if(from == this.userName){
            
        }
        // Youtube Scrapping :D
        if(message.indexOf('!yt ') === 0){
            var search = message.substring(4).toString();
            console.log('Fetching YT for: "' + search.replace(/\s/g, "") + '"');

            const videos = await yt.search(search.replace(/\s/g, ""));
            console.log(videos[0].url);
            this.sendRoomMsg(room, videos[0].url);
        }

        if(message.toLowerCase() == "!cmd"){
            let msg =   "➩ spin - .s" + "\n" +
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
        if (message.toLowerCase() == '.s' || message.toLowerCase() == 'spin' ){
            const random = Math.floor(Math.random() * this.listEmojis.length);
            this.sendRoomMsg(room, from + ": " + this.listEmojis[random]);
        }

        // Profile
        if(message.indexOf('!pro ') === 0){
            var search = message.substring(5).toString();
            var targetId = search.replace(/\s/g, "");
            this.tempRoom = room;
            if(from == this.botMasterId){
                this.isOnlyPhoto = false;
                this.fetchUserProfile(targetId, room);
            }
        }

        // Join Group
        if(message.indexOf('!join ') === 0){
            var str = message.substring(6).toString();
            var targetId = str.replace(/\s/g, "");
            
            if(from == this.botMasterId){
                this.joinRoom(targetId);
            }
        }

        // Avatar Pic
        if(message.indexOf('!avi ') === 0){
            var str = message.substring(5).toString();
            var targetId = str.replace(/\s/g, "");
            this.tempRoom = room;

            if(from == this.botMasterId){
                this.isOnlyPhoto = true;
                this.fetchUserProfile(targetId, room);
            }
            //this.sendRoomMsg("american", "", "test.jpg");
        }

        // Member User
        if(message.indexOf('m ') === 0){
            var str = message.substring(2).toString();
            var targetId = str.replace(/\s/g, "");
            this.tempRoom = room;

            if(from == this.botMasterId){
                this.grantMember(targetId, room);
            }
        }

        // Kick User
        if(message.indexOf('k ') === 0){
            var str = message.substring(2).toString();
            var targetId = str.replace(/\s/g, "");
            this.tempRoom = room;

            if(from == this.botMasterId){
                var kickPayload = {handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: TARGET_ROLE_KICK, room: room, t_username: targetId, t_role: "none"};
                if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
                    this.webSocket.send(JSON.stringify(kickPayload));
                }
            }
        }

        if(message.indexOf('b ') === 0){
            var str = message.substring(2).toString();
            var targetId = str.replace(/\s/g, "");
            this.tempRoom = room;

            if(from == this.botMasterId){
                this.banUser(targetId, room);
            }
        }

        if(message.indexOf('n ') === 0){
            var str = message.substring(2).toString();
            var targetId = str.replace(/\s/g, "");
            this.tempRoom = room;

            if(from == this.botMasterId){
                this.grantNone(targetId, room);
            }
        }

        if(message.indexOf('a ') === 0){
            var str = message.substring(2).toString();
            var targetId = str.replace(/\s/g, "");
            this.tempRoom = room;

            if(from == this.botMasterId){
                this.grantAdmin(targetId, room);
            }
        }

        if(message.indexOf('o ') === 0){
            var str = message.substring(2).toString();
            var targetId = str.replace(/\s/g, "");
            this.tempRoom = room;

            if(from == this.botMasterId){
                this.grantOwner(targetId, room);
            }
        }

        if(message.toLowerCase() == ".l"){
            this.tempRoom = room;
            
            if(from == this.botMasterId){
                var roomUsersPayload = {handler: HANDLER_ROOM_ADMIN, id: this.keyGen(20, true), type: "occupants_list", room: room, t_username: "username", t_role: "none"};
                if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
                    this.webSocket.send(JSON.stringify(roomUsersPayload));
                }
            }
        }

        if(message.toLowerCase().startsWith(".a ") || message.toLowerCase().startsWith(".o ") || message.toLowerCase().startsWith(".b ") || message.toLowerCase().startsWith(".m ") 
            || message.toLowerCase().startsWith(".n ")){
            
            var targetIndex = message.substring(3);
            if(this.user_list){
                if(isNaN(targetIndex)){
                    console.log("Invalid Input");
                }
                else{
                    if(targetIndex <= this.user_list.length){
                        //console.log(this.user_list[targetId-1]);
                        if(message.toLowerCase().substring(0, 2).trim() == ".a"){
                            this.grantAdmin(this.user_list[targetIndex-1], room);
                        }
                        else if(message.toLowerCase().substring(0, 2).trim() == ".o"){
                            this.grantOwner(this.user_list[targetIndex-1], room);
                        }
                        else if(message.toLowerCase().substring(0, 2).trim() == ".m"){
                            this.grantMember(this.user_list[targetIndex-1], room);
                        }
                        else if(message.toLowerCase().substring(0, 2).trim() == ".b"){
                            this.banUser(this.user_list[targetIndex-1], room);
                        }
                        else if(message.toLowerCase().substring(0, 2).trim() == ".n"){
                            this.grantNone(this.user_list[targetIndex-1], room);
                        }
                    }else{
                        //console.log("Invalid Input");
                        this.sendRoomMsg(room, "❌ Invalid user selected!");
                    }
                }
            }
        }
    }


    fetchUserProfile(targetId, room){
        var userSearchPayload = {handler: HANDLER_PROFILE_OTHER, id: this.keyGen(20, true), type: targetId};
        
        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send(JSON.stringify(userSearchPayload));
        }
    }

    public joinRoom(roomName){
        var groupJoinPayload = {handler: HANDLER_ROOM_JOIN, id: this.keyGen(20), name: roomName};

        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send(JSON.stringify(groupJoinPayload));
        }
    }

    public login(){
        var loginPayload = {handler: HANDLER_LOGIN, id: this.keyGen(20), username: this.userName, password: this.passWord};
        
        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send(JSON.stringify(loginPayload));
        }
    }

    keyGen(keyLength, isMsgId?: boolean) {
        var i, key = "", characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        if(isMsgId){
            characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ";
        }
        var charactersLength = characters.length;
    
        for (i = 0; i < keyLength; i++) {
            key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
        }
        return key;
    }

    generateBuildInfo(){
        var info = ""
        info+= "258"        // Fixed Constant
        info+= "-"          // -
        info+= "Google"     // Manufacturer
        info+= "-"          // - 
        info+= "Pixel"      // Model
        info+= "-"          // -
        info+= "30"         // Sdk Api
        return info
    }

    public sendRoomMsg(roomName: string, msg: string, photoUrl?: string){
        let groupMsgPayload = null;

        if(photoUrl){
            groupMsgPayload = {handler: HANDLER_ROOM_MESSAGE, id: this.keyGen(20, true), room: roomName, type: MESSAGE_TYPE.IMAGE, url: photoUrl, body: "", length: ""};
        }
        else{
            groupMsgPayload = {handler: HANDLER_ROOM_MESSAGE, id: this.keyGen(20, true), room: roomName, type: MESSAGE_TYPE.TEXT, url: "", body: msg, length: ""};
        }

        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send(JSON.stringify(groupMsgPayload));
        }
    }
    
}

function get_random (list) {
    return list[Math.floor((Math.random()*list.length))];
}

function chunkSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)
  
    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size)
    }
    //console.log(chunks);
    return chunks
  }

// Created by docker aka db~@NC - B'cuz we share :P
new Client(BOT_ID, BOT_PASSWORD);