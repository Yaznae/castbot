const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick user from server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('user to be kicked.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('reason for kicking.')
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser('user');
        const reason = options.getString('reason') || 'no reason provided.';

        const member = await interaction.guild.members.fetch(user.id)

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply(`\`:\` couldn't kick ${user.username} due to you having a lower role.`);
        } else if (member.roles.highest.position >= interaction.guild.members.fetch(interaction.client.user.id).roles.highest.position) {
            return interaction.reply(`\`:\` couldn't kick ${user.username} due to me having a lower role.`);
        } else if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply(`\`:\` i have no permission to kick members.`);
        }

        await member.kick(reason);

        await interaction.reply(`\`:\` kicked <@${user.id}>. reason: ${reason}`);
    }
}