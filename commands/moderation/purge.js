const {
    SlashCommandBuilder,
    CommandInteraction,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('clears an amount of messages.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('number of messages to clear.')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('user to clear messages from.')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const amount = options.getInteger('amount');
        const user = options.getUser('user');

        const msgs = await channel.messages.fetch({
            limit: amount + 1
        });

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply(`\`:\` i have no permission to delete messages.`);
        }

        if (user) {
            let i = 0;
            const filtered = [];

            (await msgs).filter((msg) => {
                if (msg.author.id === user.id && amount > i) {
                    filtered.push(msg);
                    i++
                }
            });

            await channel.bulkDelete(filtered).then(msgs => {
                interaction.reply(`\`:\` deleted ${msgs.size} messages from ${user.tag}.`);
            });
        } else {
            await channel.bulkDelete(amount, true).then(msgs => {
                interaction.reply(`\`:\` deleted ${msgs.size} messages.`);
            });
        }
    }
}