/* eslint-disable import/no-unresolved */
/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable quote-props */
/* eslint-disable max-len */
const { Manager } = require("erela.js");
const { default: Spotify } = require("better-erela.js-spotify");
const AppleMusic = require("erela.js-apple");
const Deezer = require("erela.js-deezer");
const prettyMS = require("pretty-ms");
const ms = require("ms");
const https = require("https");
const RichEmbed = require("./utils/RichEmbed");
const { createProgressBar, format, convertTime } = require("./utils/Utils");
const { FilterManager } = require("./Filters");

let EventEmitter;
try {
    // eslint-disable-next-line global-require
    EventEmitter = require("close-emit");
} catch {
    // eslint-disable-next-line global-require
    EventEmitter = require("events").EventEmitter;
}

/**
 * Discord Tunes lavalink setup property
 * @class {DiscordTunes}
 * @prop {object} [Client] client of discord.js
 * @prop {string} [botId] Application ID
 * @prop {string} [host] Lavalink host URI or IP address
 * @prop {number} [port] Lavalink port number
 * @prop {string} [password] Lavalink auth password
 * @prop {number} [retryDelay] [Optional] Delay of reconnecting to node if node has been disconnected
 * @prop {number} [retryAmount] [Optional] Retry amount of reconnecting to the node
 * @prop {boolean} [isHttps] Whether connection to lavalink is secure or not (secure = true either false)
 * @prop {boolean} [leaveOnEmpty] Whether will it leave on voice channel empty or not
 * @prop {number} [leaveTimeout] Wait timeout when bot will leave
 * @prop {string} [DLib] Which Discord library you using, currently supports Discord.js and Eris
 */

class DiscordTunes extends EventEmitter {
    constructor(client, options = { }) {
        super();
        this.client = client;
        this.client.manager = client.manager;
        this.botId = options.botId;
        this.host = options.host;
        this.port = options.port;
        this.password = options.password;
        this.retryDelay = options.retryDelay;
        this.retryAmount = options.retryAmount;
        this.isHttps = options.isHttps;
        this.leaveOnEmpty = options.leaveOnEmpty;
        this.leaveTimeout = options.leaveTimeout;
        this.dlib = options.DLib;
        if (!this.client) throw new Error("Client isn't initalize.");
        if (!this.botId) throw new Error("Bot ID is required.");
        if (!this.host) throw new Error("Lavalink host IP / URL is required.");
        if (!this.port) throw new Error("Lavalink host port is required.");
        if (typeof this.port !== "number") throw new TypeError("Host port must be an integer.");
        if (!this.password) throw new Error("Password of lavalink connection server is required.");
        if (!this.retryDelay) this.retryDelay = 5000;
        if (!this.retryAmount) this.retryAmount = 5;
        if (!this.isHttps) this.isHttps = false;
        if (typeof this.isHttps !== "boolean") throw new TypeError("isHttps must be a boolean type.");
        if (!this.leaveOnEmpty) this.leaveOnEmpty = false;
        if (this.leaveOnEmpty === true && !this.leaveTimeout) this.leaveTimeout = Infinity;
        if (this.leaveOnEmpty === true && typeof this.leaveTimeout !== "number") throw new TypeError("leaveTimeout must be an integer type.");
        if (!this.dlib) this.dlib = "djs";

        /**
         * @listens {connect} Connect to lavalink server
         */
         this.connect();

        /**
         * @event {raw} Send raw packets to discord gateway
         */

        if (this.dlib === "djs") {
            this.client.on("raw", (pkt) => this.client.manager.updateVoiceState(pkt));
        }
        if (this.dlib === "eris") {
            this.client.on("rawWS", (pkt) => this.client.manager.updateVoiceState(pkt));
        }
    }

    /**
     * Connect to lavalink server
     */
    async connect() {
       this.client.manager = new Manager({
           nodes: [
               {
                    "host": this.host,
                    "port": parseInt(this.port, 10),
                    "password": this.password,
                    "retryDelay": this.retryDelay,
                    "retryAmount": this.retryAmount,
                    "secure": this.isHttps,
                },
            ],
            send: (id, payload) => {
                if (this.dlib === "djs") {
                    const guild = this.client.guilds.cache.get(id);
                    if (guild) guild.shard.send(payload);
                }
                if (this.dlib === "eris") {
                    const guild = this.client.guilds.get(id);
                    if (guild) guild.shard.sendWS(payload.op, payload.d);
                }
            },
            autoPlay: true,
            plugins: [
                new Spotify({
                    clientID: this.spotifyClientID,
                    clientSecret: this.spotifyClientSecret,
                }),
                new AppleMusic(),
                new Deezer(),
                new FilterManager(),
            ],
        });
        /**
         * Player update and node connection events
         */
        this.client.manager.on("nodeCreate", (node) => {
            // `nodeStatus` - Fire up when bot will connect to lavalink server
            this.emit("nodeStatus", `${node.options.identifier} has been created.`);
        });
        this.client.manager.on("nodeConnect", (node) => {
            // `nodeStatus` - Fire up on all types of node connection errors
            this.emit("nodeStatus", `Lavalink node has been connected to ${node.options.identifier}`);
        });
        this.client.manager.on("nodeDisconnect", (node) => {
            // `nodeStatus` - Fire up on all types of node connection errors
            this.emit("nodeStatus", `${node.options.identifier} has been disconnected, trying to reconnecting...`);
        });
        this.client.manager.on("nodeReconnect", (node) => {
            // `nodeStatus` - Fire up on all types of node connection errors
            this.emit("nodeStatus", `${node.options.identifier} is been reconnecting...`);
        });
        this.client.manager.on("nodeError", (node) => {
            // `nodeStatus` - Fire up on all types of node connection errors
            this.emit("nodeStatus", `${node.options.identifier} has been encountered an error.`);
        });
        this.client.manager.on("trackStart", (player, track) => {
            // `playerStart` - Fire up when track has been start playing
            this.emit("playerStart", player, track);
        });
        this.client.manager.on("trackEnd", (player, track) => {
            // `playerEnd` - Fire up when track will be end
            this.emit("playerEnd", player, track);
        });
        this.client.manager.on("trackError", (player, track) => {
            // `playerError` - Fire up when track face any problem (internal / from source)
            this.emit("playerError", player, track);
        });
        this.client.manager.on("trackStuck", (player, track) => {
            // `playerUnknownError` - Fire up when track have issues to grab data from source
            this.emit("playerUnknownError", player, track);
        });
        // @internal
        this.client.manager.on("socketClosed", (player, data) => {
            if (data.byRemote === true) player.destroy();
        });
        // @internal
        this.client.on("voiceStateUpdate", async (client, oldState, newState) => {
            this.emit("logs", `Internal event: VoiceStateUpdate, \n#1 ${oldState}\n#2 ${newState}`);
            try {
                const player = this.client.manager.get(oldState?.guild?.id ?? null);
                player.pause(false);

                if (this.dlib === "djs") {
                    if (this.leaveOnEmpty === true) {
                        setTimeout(() => {
                            const voice = oldState.guild.channels.cache.get(player?.voiceChannel ?? null);
                            const vc = player.voiceChannel;
                            if (!voice || voice === undefined) return;
                            if (player && vc && voice.members.filter((f) => !f.user.bot)?.size === 0) player.destroy();
                            this.emit("leftVoice", player, oldState, newState);
                        }, this.leaveTimeout);
                    }
                }
                if (this.dlib === "eris") {
                    if (this.leaveOnEmpty === true) {
                        setTimeout(() => {
                            if (oldState.guild.voiceStates.size === 1) player.destroy();
                            this.emit("leftVoice", player, oldState, newState);
                        }, this.leaveTimeout);
                    }
                }
            // eslint-disable-next-line no-empty
            } catch { }
        });
    }

    initClient() {
        this.client.manager.init(this.botId);
        this.emit("logs", "Initalized application with lavalink");
    }

    /**
     * @param {string} [query]  Query of the track to play
     * @param {object} [author] Who will query the track for playing
     * @param {string} [guildID] In which guild bot will be active (for another guild bot must be stay there)
     * @param {string} [voiceChannelID] In which voice channel bot will join
     * @param {string} [textChannelID] In which text channel bot will send messages
     * @param {number} [volume] Percentage of sound
     * @param {boolean} [selfDeaf] Should be defeafen or not
     * @param {boolean} [selfMute] Should be mute the bot itself
     */

    // eslint-disable-next-line class-methods-use-this
    async play(query, author, guildID, voiceChannelID, textChannelID, vol = 100, selfDeaf = true, selfMut = false) {
        if (!query) throw new Error("Missing track query.");
        if (!author) throw new Error("Missing author object.");
        if (!guildID) throw new Error("Missing guild id.");
        if (!voiceChannelID) throw new Error("Missing voice channel ID.");
        if (!textChannelID) throw new Error("Missing text channel ID.");

        const player = this.client.manager.create({
            guild: guildID,
            voiceChannel: voiceChannelID,
            textChannel: textChannelID,
            volume: vol,
            selfDeafen: selfDeaf,
            selfMute: selfMut,
        });

        if (player.state !== "CONNECTED") await player.connect();
        player.set("autoplay", false);

        let res;
        try {
            res = await player.search(query, author);
            if (res.loadType === "LOAD_FAILED") {
                this.emit("loadFailed", player);
                if (!player.queue.current) await player.destroy();
                throw res.exception;
            }
        } catch (e) {
            this.emit("logs", e);
        }

        const track = res.tracks[0];
        const playlist = res.tracks;
        // eslint-disable-next-line default-case
        switch (res.loadType) {
            case "NO_MATCHES":
                this.emit("noResults", this.client, "No results found.");
                if (!player.queue.current) await player.destroy();
            break;

            case "TRACK_LOADED":
                await player.queue.add(track);
                this.emit("trackAdded", player, track);
                if (!player.playing && !player.paused && !player.queue.size) {
                    try {
                        this.emit("trackLoad", player, track);
                        await player.play();
                    // eslint-disable-next-line no-empty
                    } catch { }
                }
            break;

            case "PLAYLIST_LOADED":
                await player.queue.add(playlist);
                this.emit("playlistAdded", player, playlist);
                if (!player.playing && !player.paused
                && player.queue.totalSize === res.tracks.length) {
                    try {
                        this.emit("playlistLoad", player, playlist);
                        await player.play();
                        // eslint-disable-next-line no-empty
                    } catch { }
                }
            break;

            case "SEARCH_RESULT":
                await player.queue.add(track);
                this.emit("searchAdded", player, track);
                if (!player.playing && !player.paused && !player.queue.size) {
                    try {
                        this.emit("searchResult", player, track);
                        await player.play();
                    // eslint-disable-next-line no-empty
                    } catch { }
                }
            break;
        }
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    pause(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        if (player.paused) throw new Error("Player already paused.");
        player.pause(true);
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    resume(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        if (!player.paused) throw new Error("Player isn't paused.");
        player.pause(false);
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
     stop(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        const autoplay = player.get("autoplay");
        if (autoplay === true) player.set("autoplay", false);
        player.stop();
        player.destroy();
        this.emit("playerStop", "Player has been stopped.");
    }

    /**
     *
     * @param {string} [guildID] In which guild bot will be active
     */
    skip(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        const autoplay = player.get("autoplay");
        if (autoplay === false) {
            player.stop();
        } else {
            player.stop();
            player.queue.clear();
            player.set("autoplay", false);
        }
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @param {number} [trackNum] Which track number will to skip
     */
    skipTo(guildID, trackNum) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        if (!trackNum) throw new Error("Track number is required.");
        if (Number.isNaN(trackNum)) throw new TypeError("Track number isn't an integer.");
        const pos = Number(trackNum);

        if (pos < 0 || pos > player.queue.size) throw new Error("Provided track position is invalid.");

        player.queue.remove(0, pos - 1);
        player.stop();
    }

    /**
     * @param {string} [guildID]  In which guild bot will be active
     * @param {string} [loopType] Which type loop you want, `track` for current track, `queue` for whole queue
     * @returns {boolean}
     */
     loop(guildID, loopType) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");

        switch (loopType) {
            case "track":
                player.setTrackRepeat(!player.trackRepeat);
            return !!player.trackRepeat;

            case "queue":
                player.setTrackRepeat(!player.queueRepeat);
            return !!player.queueRepeat;

            default:
                player.setTrackRepeat(!player.trackRepeat);
            return !!player.trackRepeat;
        }
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @returns {boolean}
     */
     loopTrack(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");

        player.setTrackRepeat(!player.trackRepeat);
        return !!player.trackRepeat;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @returns {boolean}
     */
     loopQueue(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");

        player.setTrackRepeat(!player.queueRepeat);
        return !!player.queueRepeat;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @param {number} [time] Times to forward (must be an integer)
     * @returns {number}
     */
     forward(guildID, time) {
        if (!time) throw new Error("Time to forward is missing.");
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");

        let seekTime = Number(player.position) + ms(time);
        if (seekTime >= player.queue.current.duration) seekTime = player.queue.current.duration - 1000;

        player.seek(seekTime);
        return seekTime;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @param {number} [time] Times to rewind (must be an integer)
     * @returns {number}
     */
     rewind(guildID, time) {
        if (!time) throw new Error("Time to forward is missing.");
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");

        let seekTime = Number(player.position) - ms(time);
        if (ms(time) <= 0) seekTime = player.position;
        if (seekTime >= player.queue.current.duration - player.position || seekTime < 0) seekTime = 0;

        player.seek(seekTime);
        return seekTime;
    }

    /**
     *
     * @param {string} [guildID] In which guild bot will be active
     */
    fromBegin(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        player.seek(0);
    }

    /**
     *
     * @param {string} [guildID] In which guild bot will be active
     * @param {number} [time] Times to seek the track
     */
    seek(guildID, time) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        const t = ms(time);
        const pos = player.position;
        const { duration } = player.queue.current;

        if (t <= duration) {
            if (t > pos) {
                player.seek(t);
            } else {
                player.seek(t);
            }
        }
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @param {number} [trackNum] Track number to remove from the queue
     * @returns {number}
     */
     remove(guildID, trackNum) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        const pos = Number(trackNum) - 1;
        if (pos < 0 || pos > player.queue.size) throw new RangeError("Track doesn't exists in the queue.");

        player.queue.remove(pos);
        return pos;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @returns {number}
     */
    removeDuplicates(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        if (this.queueLength(guildID) <= 0) throw new Error("Queue is empty.");
        const tracks = player.queue;
        const newTracks = [];
        let ifExists;

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < tracks.length; i++) {
            ifExists = false;
            // eslint-disable-next-line no-plusplus
            for (let j = 0; j < newTracks.length; j++) {
                if (tracks[i]?.uri === newTracks[j]?.uri) {
                    ifExists = true;
                    break;
                }
            }
            if (!ifExists) newTracks.push(tracks[i]);
        }

        player.queue.clear();
        // eslint-disable-next-line no-restricted-syntax
        for (const track of newTracks) player.queue.add(track);
        return newTracks.length;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @returns {number}
     */
     clearQueue(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        if (!this.queueLength(guildID)) throw new Error("Queue is empty.");
        const queueLen = player.queue.length;
        player.queue.clear();
        return queueLen;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @returns {number}
     */
     shuffle(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        player.set("beforeshuffle", player.queue.map((t) => t));
        player.queue.shuffle();
        const len = player.queue.length;
        return len || 1;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @returns {number}
     */
    unshuffle(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.queue.clear();
        // eslint-disable-next-line no-restricted-syntax
        for (const track of player.get("beforeshuffle")) player.queue.add(track);
        const len = player.queue.length;
        return len || 1;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @param {number} [percent] Avarage percentage of the volume
     */
    volume(guildID, percent) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        if (Number.isNaN(percent)) throw new Error("Volume level must be an integer.");
        const vol = Number(percent);
        player.setVolume(vol);
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @param {string} [embedColor] Embed color can be string either hex value
     * @returns {object}
     */
     nowPlaying(guildID, embedColor) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        const embed = new RichEmbed()
        .setColor(embedColor || "RANDOM")
        .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
        .setDescription(`Currently playing: [${player.queue.current.title}](${player.queue.current.uri})`)
        .addField("Duration", `\`${format(player.queue.current.duration)}\``, true)
        .addField("Song by", `\`${player.queue.current.author}\``, true)
        .addField("Queue length", `\`${player.queue.length} songs\``, true)
        .addField("Duration", `${createProgressBar(player.position, player.queue.current.duration, 15).Bar} [\`${prettyMS(player.position, { colonNotation: false })} / ${prettyMS(player.queue.current.duration, { colonNotation: false })}\`]`);
        return embed;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @param {number} [pageNum] Queue page to get
     * @param {string} [embedColor] Embed color can be string either hex value
     * @returns {object}
     */
     queueList(guildID, pageNum, embedColor) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        if (!player.queue.length) throw new Error("Queue is empty.");

        const { queue } = player;
        const embed = new RichEmbed().setColor(embedColor || "RANDOM");
        const multiple = 10;
        const page = Number(pageNum) ? Number(pageNum) : 1;
        const end = page * multiple;
        const start = end - multiple;
        const tracks = queue.slice(start, end);

        if (queue.current) embed.addField("Now playing", `[${queue.current.title ? queue.current.title : "*Playing something*"}](${queue.current?.uri})`);
        if (!tracks.length) embed.addField(`No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`);
        // eslint-disable-next-line no-param-reassign
        else embed.setDescription(`__Queue List__\n\n${tracks.map((track, i) => `**${start + (++i)}.** [${track.title ? track.title : "*something cool*"}](${track?.uri}) | \`[${convertTime(track.duration ? track.duration : "Unknown")}]\``).join("\n")}`);

        embed.addField("Info", `Songs queued: \`${queue.length ?? "Unknown"}\`\nTrack loop: \`${player.trackRepeat ? "Enabled" : "Disabled"}\`\nQueue loop: \`${player.queueRepeat ? "Enabled" : "Disabled"}\``);
        const maxPages = Math.ceil(queue.length / multiple);
        embed.addField("\u200b", `Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

        return embed;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    rawQueueList(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        if (!player.queue.length) throw new Error("Queue is empty.");
        const { queue } = player;
        return queue;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
     async addPrevious(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        let res;
        try {
            res = await player.search(player.queue.previous.uri);
            if (res.loadType === "LOAD_FAILED") {
                this.emit("loadFailed", player);
                if (!player.queue.current) await player.destroy();
                throw res.exception;
            }
        } catch (e) {
            throw new Error(e);
        }

        await player.queue.add(res.tracks[0]);
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @returns {boolean}
     */
    autoPlay(guildID, author) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        const autoplay = player.get("autoplay");

        if (!autoplay) {
            const { identifier } = player.queue.current;
            player.set("autoplay", true);
            player.set("requester", author);
            player.set("identifier", identifier);
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            const res = player.search(search, author);
            player.queue.add(res.tracks[1]);

            return true;
        }
        player.set("autoplay", false);
        player.queue.clear();
        return false;
    }

    /**
     *
     * @param {string} [guildID] In which guild bot will be active
     * @param {string} [voiceChannelID] In which voice channel bot will join
     * @param {string} [textChannelID] In which text channel bot will send messages
     * @param {number} [volume] Percentage of sound
     * @param {boolean} [selfDeaf] Should be defeafen or not
     * @param {boolean} [selfMute] Should be mute the bot itself
     */
     join(guildID, voiceChannelID, textChannelID, vol, selfDeaf, selfMut) {
        if (!guildID) throw new Error("Missing guild id.");
        if (!voiceChannelID) throw new Error("Missing voice channel ID.");
        if (!textChannelID) throw new Error("Missing text channel ID.");

        const player = this.client.manager.create({
            guild: guildID,
            voiceChannel: voiceChannelID,
            textChannel: textChannelID,
            volume: vol,
            selfDeafen: selfDeaf,
            selfMute: selfMut,
        });

        if (player.state !== "CONNECTED") player.connect();
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
     disconnect(guildID) {
        if (!guildID) throw new Error("Guild ID argument is missing.");
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        try {
            player.destroy();
        // eslint-disable-next-line no-empty
        } catch { }
    }

    /**
     * @param {string} [trackTitle] tracl
     * @returns {string}
     */

    // eslint-disable-next-line class-methods-use-this
    lyrics(trackTitle) {
        // eslint-disable-next-line no-promise-executor-return
        if (!trackTitle) throw new Error("Missing track title.");
        return new Promise((res, rej) => {
            https.get(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(trackTitle)}`, (got) => {
                const data = [];
                got.on("data", (chunk) => {
                    data.push(chunk);
                })
                .on("end", () => res(data))
                .on("error", (err) => rej(err));
            });
        });
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @param  {...any} [bandsArray] Array of bands, can be push types too
     */
     setEQ(guildID, ...bandsArray) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        player.setEQ(...bandsArray);
    }

    /**
     *
     * @param {string} [guildID] In which guild bot will be active
     */
    removeEQ(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        player.clearEQ();
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @returns {boolean}
     */
    isPlaying(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        if (player.queue.current) return true;
        return false;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @returns {boolean}
     */
    isPlayer(guildID) {
        if (this.client.manager.get(guildID)) return true;
        return false;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @returns {boolean}
     */
    isPaused(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        if (player.paused) return true;
        return false;
    }

    /**
     * Filters
     * `bass`, `bassboost`, `bassboosthigh`, `classical`, `eightd`, `electronic`, `errape`, `gaming`, `highfull`, `highvoice`, `karaoke`, `nightcore`, `party`, `pop`, `radio`, `rock`, `soft`, `treblebass`, `vaporewave`, `vibrato`
     */

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
     bass(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player initalize in this guild.");
        player.bass = !player.bass;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
     bassboost(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.bassboost = !player.bassboost;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    bassboosthigh(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.bassboosthigh = !player.bassboosthigh;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    classical(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.classical = !player.classical;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    darthvador(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.darthvador = !player.darthvador;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    eightd(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.eightd = !player.eightd;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    electronic(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.electronic = !player.electronic;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    errape(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.errape = !player.errape;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    gaming(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.gaming = !player.gaming;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    highfull(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.highfull = !player.highfull;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    highvoice(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.highvoice = !player.highvoice;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    karaoke(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.karaoke = !player.karaokes;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    nightcore(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.nightcore = !player.nightcore;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    lovenightcore(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.lovenightcore = !player.lovenightcore;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    party(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.party = !player.party;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    pop(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.pop = !player.pop;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    radio(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.radio = !player.radio;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    rock(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.rock = !player.rock;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    soft(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.soft = !player.soft;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    superfast(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.superfast = !player.superfast;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    treblebass(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.treblebass = !player.treblebass;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    tremolo(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.tremolo = !player.tremolo;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    vaporewave(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.vaporewave = !player.vaporewave;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     */
    vibrato(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        player.vibrato = !player.vibrato;
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @returns {string}
     */
    currentTrack(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        const { title } = player.queue.current;
        const url = player.queue.current.uri;
        return { title, url };
    }

    /**
     * @param {string} [guildID] In which guild bot will be active
     * @returns {number}
     */
    queueLength(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        return player.queue.length;
    }

    /**
     * @param {string} [guildID] In which guild bot will be acive
     * @return {object}
     */
    guildPlayer(guildID) {
        const player = this.client.manager.get(guildID);
        if (!player) throw new Error("No player was been initalize in this guild.");
        return player;
    }
}

module.exports = DiscordTunes;
