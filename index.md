# Running the Nodejs TalkinchatBot using Termux on Android:
- Download Termux Apk from F-Droid: <a href="https://f-droid.org/en/packages/com.termux/" title="termux">Download</a>
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

vim Client.ts

npm i ws 

npm i youtube-search-without-api-key
```

- NOTE: Edit the Client.ts file for setting ur Bot ID & Password & RoomName. Use 'i' to enter Insert Mode & after changes use 'ESC' key and then type ':wq' to write changes to file & quit from edit mode.
- After executing all the above commands stepwise, simply compile the TS file and run the bot:

```
tsc Client.ts

node Client.js
```
