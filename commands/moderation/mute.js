const {
    Client,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('mutes user from texting in server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('user to be muted.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('time until unmuted.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('reason for muting.')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { guild, options } = interaction;

        const user = options.getUser('user');
        const member = guild.members.cache.get(user.id);
        const time = options.getString('duration');
        const convertedTime = ms(time);
        const reason = options.getString('reason') || 'no reason provided.';

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply(`\`:\` couldn't mute ${user.username} due to you having a lower role.`);
        } else if (member.roles.highest.position >= interaction.guild.members.fetch(interaction.client.user.id).roles.highest.position) {
            return interaction.reply(`\`:\` couldn't mute ${user.username} due to me having a lower role.`);
        } else if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply(`\`:\` i have no permission to mute members.`);
        } else if (!convertedTime) {
            return interaction.reply(`\`:\` couldn't compute time to mute.`);
        }

        try {
            await member.timeout(convertedTime, reason);

            interaction.reply(`\`:\` muted <@${user.id}> for ${time} seconds. reason: ${reason}`);
        } catch (err) {
            console.log(err);
        }
    }
}