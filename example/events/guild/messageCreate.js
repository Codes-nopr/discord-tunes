module.exports = async (client, message) => {
    if (message.author.bot || !message.guild || message.webhookId) return;
    const prefixMention = "!";
    try {
        if (!message.content.startsWith(prefixMention)) return;
        const args = message.content.slice(prefixMention.length).split(/ +/g);
        const cmd = args.shift().toLowerCase();
        // eslint-disable-next-line max-len
        const command = client.commands.get(cmd) || client.commands.find((x) => x.aliases && x.aliases.includes(cmd));

        try {
            command.execute(client, message, args);
        // eslint-disable-next-line no-empty
        } catch (e) { }
    // eslint-disable-next-line no-console
    } catch (e) { console.log(e); }
};
