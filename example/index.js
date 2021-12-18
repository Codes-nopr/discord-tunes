/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const { Client, Intents, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const DiscordTunes = require("../index"); // If you're not using directly from source code, and using installed version, then use `require("discord-tunes")` instead

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});

client.tunes = new DiscordTunes(client, {
    host: "localhost", // You lavalink host URL either IP
    port: 2333, // Port of the network lavalink
    botId: "put_your_bot_id",
    password: "youshallnotpass", // Connection auth password
    retryDelay: 3000, // [Optional] You can set delay of the retry to connect
    retryAmount: 5, // [Optional] How much times bot will be request to connect
    leaveOnEmpty: true, // [Optional] Check, does bot will leave on empty either will stay
    // eslint-disable-next-line max-len
    isHttps: false, // [Optional] Is it secure connection? HTTP / FTP / IP = false, HTTPS / SFTP = true
    spotifyClientID: "abcdef123456", // Put your spotify client OD
    spotifyClientSecret: "abcdef123456", // Put your spotify ckuebt secret
    leaveTimeout: 3000, // [Optional] When bot will leave from voice channel
});

client.commands = new Collection();
client.tunes.connect();

const cmds = readdirSync("./commands").filter((f) => f.endsWith(".js"));

// eslint-disable-next-line no-restricted-syntax
for (const file of cmds) {
    const command = require(`./commands/${file}`);
    // eslint-disable-next-line no-console
    console.log(`Loading command: ${file}`);
    client.commands?.set(command?.name, command);
}

const guildEvents = readdirSync("./events/guild").filter((f) => f.endsWith(".js"));

// eslint-disable-next-line no-restricted-syntax
for (const file of guildEvents) {
    // eslint-disable-next-line no-console
    console.log(`Loading guild event: ${file}`);
    const event = require(`./events/guild/${file}`);
    client.on(file.split(".")[0], event.bind(null, client));
}

const playerEvents = readdirSync("./events/player").filter((f) => f.endsWith(".js"));

// eslint-disable-next-line no-restricted-syntax
for (const file of playerEvents) {
    // eslint-disable-next-line no-console
    console.log(`Loading player event: ${file}`);
    const event = require(`./events/player/${file}`);
    client.tunes.on(file.split(".")[0], event.bind(null, client));
}

client.login("secret_bot_token");
