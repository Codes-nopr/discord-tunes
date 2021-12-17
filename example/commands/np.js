const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "np",
    aliases: [],

    async execute(client, message, args) {
        const np = client.tunes.nowPlaying(message.guild.id);
        message.channel.send({ embeds: [np] });
    },
};
