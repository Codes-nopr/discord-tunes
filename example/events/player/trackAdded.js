module.exports = async (client, player, track) => {
    const ch = await client.channels.cache.get(player.textChannel);
    await ch.send({ content: "Added" });
};
