const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "queue",
    aliases: [],

    async execute(client, message, args) {
        const q = client.tunes.queueList(message.guild.id, "BLUE");
        message.channel.send({ embeds: [q] });
    },
};
