module.exports = {
    name: "skip",

    async execute(client, message) {
        client.tunes.skip(message.guild.id);
    },
};
