const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('obtain server info'),
    async execute(interaction) {
        if (!interaction.inGuild()) {
            await interaction.reply('`:` can only be used in servers.')
            return;
        }
        const server = interaction.guild;
        let verYN;
        let parYN;

        server.verified ? verYN = '<:check:1051242580144308295>' : verYN = '<:cross:1051242577736777769>';
        server.partnered ? parYN = '<:check:1051242580144308295>' : parYN = '<:cross:1051242577736777769>';

        const serverEmbed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle(`// info about ${server.name}`)
            .setThumbnail(`${server.iconURL({ dynamic: true })}`)
            .addFields(
                { name: 'member count:', value: `${server.members.cache.filter(member => !member.user.bot).size}`, inline: true },
                { name: 'channel count:', value: `${server.channels.cache.filter((c) => c.type !== 'category').size}`, inline: true },
                { name: 'role count:', value: `${server.roles.cache.size}`, inline: true },
                { name: 'owner:', value: `<@${server.ownerId}>`, inline: true },
                { name: 'created at:', value: `${dayjs(server.createdAt).format('dddd DD/MM/YYYY HH:mm')}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'verified:', value: `${verYN}`, inline: true },
                { name: 'partnered:', value: `${parYN}`, inline: true }
            )

        await interaction.reply({ embeds: [serverEmbed] })
    },
};