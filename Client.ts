import { parse } from 'path/posix';
import WebSocket =  require('ws');
const request = require('request');
import * as yt from 'youtube-search-without-api-key';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
const headers = {'User-Agent': USER_AGENT}

export class Client{

    public URL: string = 'wss://chatp.net:5333/server';
    public webSocket: WebSocket = null;
    public userName: string = "";
    public passWord: string = "";
    public roomName: string = "american";
    public tempRoom: string = "";
    public isOnlyPhoto: boolean = false;
    public listEmojis = [
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
        this._log("ws: Socket closed");
        //new Client("imchampagnepapi", "qwerty-007");
    }

    _onPing(ping){
        this._log(ping);
        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send("PONG")
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
        if(parsedData.handler == "login_event"){
            if(parsedData.type == "success"){
                this.joinRoom(this.roomName);
            }
        }

        if(parsedData.handler == "room_event"){
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
        }

        if(parsedData.handler == "profile_other"){
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
    }

    public async processGroupChatMessage(from, message, room){
        console.log(from + " : " + message);

        if(from == this.userName){
            //this.sendRoomMsg(this.roomName, message);
        }
        if (message.indexOf('!yt ') === 0){
            var search = message.substring(4).toString();
            console.log('Fetching YT for: "' + search.replace(/\s/g, "") + '"');

            const videos = await yt.search(search.replace(/\s/g, ""));
            console.log(videos[0].url);
            this.sendRoomMsg(room, videos[0].url);
        }

        if (message.indexOf('.s') === 0 || message.indexOf('.S') === 0 || message.indexOf('spin') === 0){
            const random = Math.floor(Math.random() * this.listEmojis.length);
            this.sendRoomMsg(room, from + ": " + this.listEmojis[random]);
        }

        if(message.indexOf('!pro ') === 0){
            
            var search = message.substring(5).toString();
            var targetId = search.replace(/\s/g, "");
            this.tempRoom = room;
            if(from == "docker"){
                this.isOnlyPhoto = false;
                this.fetchUserProfile(targetId, room);
            }
        }

        if(message.indexOf('!join ') === 0){
            var str = message.substring(6).toString();
            var targetId = str.replace(/\s/g, "");
            
            if(from == "docker"){
                this.joinRoom(targetId);
            }
        }

        if(message.indexOf('!avi ') === 0){
            var str = message.substring(5).toString();
            var targetId = str.replace(/\s/g, "");
            this.tempRoom = room;

            if(from == "docker"){
                this.isOnlyPhoto = true;
                //this.joinRoom(targetId);
                this.fetchUserProfile(targetId, room);
            }
            //this.sendRoomMsg("american", "", "https://static.remove.bg/remove-bg-web/3661dd45c31a4ff23941855a7e4cedbbf6973643/assets/start-0e837dcc57769db2306d8d659f53555feb500b3c5d456879b9c843d1872e7baa.jpg");
        }

        if(message.indexOf('m ') === 0){
            var str = message.substring(2).toString();
            var targetId = str.replace(/\s/g, "");
            this.tempRoom = room;

            if(from == "docker"){
                var memPayload = {handler: "room_admin", id: "qBCQa0luvhCJpBgQyqMc", type: "change_role", room: room, t_username: targetId, t_role: "member"};
                if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
                    this.webSocket.send(JSON.stringify(memPayload));
                }
            }
        }
        if(message.indexOf('k ') === 0){
            var str = message.substring(2).toString();
            var targetId = str.replace(/\s/g, "");
            this.tempRoom = room;

            if(from == "docker"){
                var memPayload = {handler: "room_admin", id: "qBCQa0luvhCJpBgQyqMc", type: "change_role", room: room, t_username: targetId, t_role: "member"};
                if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
                    this.webSocket.send(JSON.stringify(memPayload));
                }
            }
        }
        
    }


    fetchUserProfile(targetId, room){
        var userSearchPayload = {handler: "profile_other", id: "qBCQa0luvhCJpBgQyqMc", type: targetId};
        
        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send(JSON.stringify(userSearchPayload));
        }
    }

    public joinRoom(roomName){
        var groupJoinPayload = {handler: "room_join", id: "qBCQa0luvhCJpBgQyqMc", name: roomName};

        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send(JSON.stringify(groupJoinPayload));
        }
    }

    public login(){
        var loginPayload = {handler: "login", id: "qBCQa0luvhCJpAgQyqMc", username: this.userName, password: this.passWord};
        
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
        info+= "Nokia"      // BrandName
        info+= "-"          // -
        info+= "30"         // Sdk Api
        return info
    }

    public sendRoomMsg(roomName: string, msg: string, photoUrl?: string){
        let groupMsgPayload = null;

        if(photoUrl){
            groupMsgPayload = {handler: "room_message", id: this.keyGen(20, true), room: roomName, type: "image", url: photoUrl, body: "", length: ""};
        }
        else{
            groupMsgPayload = {handler: "room_message", id: this.keyGen(20, true), room: roomName, type: "text", url: "", body: msg, length: ""};
        }

        if(this.webSocket != null && this.webSocket.readyState == WebSocket.OPEN){
            this.webSocket.send(JSON.stringify(groupMsgPayload));
        }
    }
    
}

async function renderHTML(text){
    var rawText = text;
    var urlRegex =/(\b(http|https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;   
    var urlList = [];
    
    await rawText.replace(urlRegex, function(url) {
      // check if url ends with .jpg, .png, .jpeg, .bmp
      if ((url.indexOf(".jpg") > 0) || (url.indexOf(".png") > 0) || (url.indexOf(".jpeg") > 0) || (url.indexOf(".bmp") > 0 )) {
          urlList.push(url);
        } else {}
    });
    
    var imgUrl = urlList[Math.floor(Math.random() * urlList.length)];
    console.log(imgUrl);
    return imgUrl;
  } 

new Client("ytbot", "qwerty-007");
