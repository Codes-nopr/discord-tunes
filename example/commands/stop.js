module.exports = {
    name: "stop",

    async execute(client, message) {
        client.tunes.stop(message.guild.id);
    },
};
