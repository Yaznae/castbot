const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('ban user from server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('user to be banned.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('reason for banning.')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser('user');
        const reason = options.getString('reason');

        const member = await interaction.guild.members.fetch(user.id);

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply(`\`:\` couldn't ban ${user.username} due to you having a lower role.`);
        } else if (member.roles.highest.position >= interaction.guild.members.fetch(interaction.client.user.id).roles.highest.position) {
            return interaction.reply(`\`:\` couldn't ban ${user.username} due to me having a lower role.`);
        } else if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply(`\`:\` i have no permission to ban members.`);
        }

        await member.ban({ reason });

        await interaction.reply(`\`:\` banned <@${user.id}>. reason: ${reason}`);
    }
}