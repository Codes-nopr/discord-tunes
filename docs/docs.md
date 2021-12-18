## Documentation
This is a small guide which helps you to know all functions of discord-tunes. For more help, join my [Discord Server](https://discord.gg/3JCCHjv6ZK)


 ### connect()
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `none`           | none      | Connect to lavalink server


 ### play(query, author, guildID, voiceChannelID, textChannelID, volume, selfDeaf, selfMute)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `query`          | string    | Track query to play
 | `author`         | object    | Author object
 | `guildID`        | string    | In which guild bot will do the job
 | `voiceChannelID` | string    | In which voice channel bot will join
 | `textChannelID`  | string    | In which text channel bot will send event messages
 | `volume`         | number    | Volume of the voice connection
 | `selfDeaf`       | boolean   | Whether selfDeafen or not
 | `selfMute`       | boolean   | Whether selfMute or not

 ### pause(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

 ### resume(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

 ### stop(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

 ### skip(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

 ### skipTo(guildID, trackNum)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 | `trackNum`       | number    | To which track you want to skip

 ### loop(guildID, loopType)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 | `loopType`       | string    | Type of the loop, whether track or queue

 ### loopTrack(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

 ### loopQueue(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

 ### forward(guildID, time)
 | Parameter        | Type      | Description             
 |------------------|-----------|----------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 | `time`           | N | S     | From track position, how much time it will forward

 ### rewind(guildID, time)
 | Parameter        | Type      | Description             
 |------------------|-----------|---------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 | `time`           | N | S     | From track position, how much time it will rewind

 ### fromBegin(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

 ### seek(guildID, time)
 | Parameter        | Type      | Description             
 |------------------|-----------|-----------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 | `time`           | N | S     | From track position, how much it will forward or rewind

 ### remove(guildID, trackNum)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 | `trackNum`       | number    | Track number to remove from queue

 ### removeDuplicates(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

 ### clearQueue(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

 ### shuffle(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

 ### unshuffle(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

 ### volume(guildID, percent)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 | `percent`        | number    | Volume percentage to increase or decrease

 ### nowPlaying(guildID, embedColor)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 | `embedColor`     | string    | (Optional) Set embed color, can be string or hex

 ### queueList(guildID, pageNum, embedColor)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 | `pageNum`        | number    | (Required when needed) Page number in the queue
 | `embedColor`     | string    | (Optional) Set embed color, can be string or hex

 ### rawQueueList(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

 ### addPrevious(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### autoPlay(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### join(guildID, voiceChannelID, textChannelID, volume, selfDeaf, selfMute)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 | `voiceChannelID` | string    | In which voice channel bot will join
 | `textChannelID`  | string    | In which text channel bot will send event messages
 | `volume`         | number    | Volume of the voice connection
 | `selfDeaf`       | boolean   | Whether selfDeafen or not
 | `selfMute`       | boolean   | Whether selfMute or not

### disconnect(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 
### activePlayers(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### lyrics(trackTitle)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `trackTitle`     | string    | Title of the track to get lyrics

### setEQ(guildID, ...bandsArray)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 | `...bandsArray`  | array     | Array of the bands
 
### removeEQ(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
 
### isPlaying(guildID)
| Parameter        | Type      | Description             
|------------------|-----------|-------------------------------------------------
| `guildID`        | string    | In which guild bot will do the job

### isPlayer(guildID)
| Parameter        | Type      | Description             
|------------------|-----------|-------------------------------------------------
| `guildID`        | string    | In which guild bot will do the job

### isPaused(guildID)
| Parameter        | Type      | Description             
|------------------|-----------|-------------------------------------------------
| `guildID`        | string    | In which guild bot will do the job

# Filters
Filters list, it require lavalink v3.4 or above to run.

### bass(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### bassboost(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### bassboosthigh(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### classical(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### darthvador(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### eightd(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### electronic(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### errape(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### gaming(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### highfull(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### highvoice(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### karaoke(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### nightcore(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### lovenightcore(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### party(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### pop(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### radio(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### rock(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### soft(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### superfast(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### treblebass(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### vaporewave(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### vibrato(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

# Others
Some of other functions, for extensive work

### currentTrack(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### queueLength(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job

### guildPlayer(guildID)
 | Parameter        | Type      | Description             
 |------------------|-----------|-------------------------------------------------
 | `guildID`        | string    | In which guild bot will do the job
