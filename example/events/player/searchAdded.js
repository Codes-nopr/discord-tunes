module.exports = (client, player, track) => {
    const ch = client.channels.cache.get(player.textChannel);
    ch.send({ content: "Added" });
};
