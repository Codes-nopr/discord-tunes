module.exports = {
    name: "play",
    aliases: [],

    async execute(client, message, args) {
        const { channel } = message.member.voice;
        client.tunes.play(args.join(" "), message.author, message.guild.id, channel.id, message.channel.id, 100);
    },
};
