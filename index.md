# TalkinchatBot
A Simple TypeScript to connect TalkinChat Group Bot using WebSocket
- RUN Cmds: Please define the username and password for the bot in Client.ts file and execute below cmds step-wise: 
- tsc Client.ts
- node Client.js

# Requirements
- OS (Windows, Mac, Linux, Android, or any)
- NodeJs Installed
- Typescript Installed
- Dependencies (ws, youtube-search-without-api-key)
- Note: In order to run this NodeJs Bot from Android Device, you must install Termux from F-Droid.

# Features:

- Login using websocket
- Group Join
- Youtube Scrapping
- User Profile Search
- Send User Profile Image in Group
- Welcome & Spin Bot


# List of Cmds:
- .s    -  SPIN the Bot
- m ID  -  Member ID
- k ID  -  Kick ID
- !yt keyword  -  Find relevant youtube video link
- !avi userId  -  Fetch User Avatar Pic
- !pro userId  -  Fetch User Profile

# DB - b'cuz We Share :P

# Running the Bot using Termux on Android:
- Download Termux Apk from F-Droid: https://f-droid.org/en/packages/com.termux/
- Run Termux and run below commands:

```
termux-setup-storage

apt-get update && apt-get upgrade

pkg install nodejs

npm i -g typescript

pkg install git

pkg install vim

git clone https://github.com/dbh4ck/TalkinchatBot.git

cd TalkinchatBot

vim Client.ts (edit the Client.ts file for setting ur Bot ID & Password & RoomName. Use 'i' to enter Insert Mode & after changes use 'ESC' key and then type ':wq' to write changes to file & quit from edit mode)

npm i ws 

npm i youtube-search-without-api-key
```

After executing all the above commands stepwise, simply compile the TS file and run the bot:

```
tsc Client.ts

node Client.js
```
