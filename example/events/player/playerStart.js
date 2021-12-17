const { MessageEmbed } = require("discord.js");

module.exports = async (client, player, track) => {
    // eslint-disable-next-line no-console
    console.log(player);
    const ch = await client.channels.cache.get(player.textChannel);
    const embed = new MessageEmbed()
    .setColor("PURPLE")
    .setTitle("Now playing")
    .setDescription(`[${player.queue.current.title}](${player.queue.current.uri})`)
    .setThumbnail(player.queue.current.thumbnail);
    await ch.send({ embeds: [embed] });
    // eslint-disable-next-line no-console
    console.log(player);
};
