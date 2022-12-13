const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('creates a poll. // with upvote and downvote emojis.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option.setName('description')
                .setDescription('poll description.')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('channel to post poll to.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),

    async execute(interaction) {
        const { options } = interaction;

        const channel = options.getChannel('channel');
        const desc = options.getString('description');

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(desc)
            .setTimestamp();

        try {
            const m = await channel.send({ embeds: [embed] });
            await m.react('<:upvote:1052031951231524875>');
            await m.react('<:downvote:1052031923104526357>');
            await interaction.reply(`\`:\` poll sent to <#${channel.id}>.`);
        } catch (err) {
            console.log(err)
        }
    }
}