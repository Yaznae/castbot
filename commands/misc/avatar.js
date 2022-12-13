const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('obtains user avatar')
        .addUserOption(user => 
            user.setName('user')
                .setDescription('user to get avatar from')
                .setRequired(false)),
    async execute(interaction) {
        let usr;
        const intrcUser = interaction.options.getUser('user')
        intrcUser ? usr = intrcUser : usr = interaction.user

        const avEmbed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle(`// ${usr.username}'s avatar`)
            .setImage(usr.displayAvatarURL({ dynamic: true, size: 2048 }));

        await interaction.reply({ embeds: [avEmbed] })
    },
};