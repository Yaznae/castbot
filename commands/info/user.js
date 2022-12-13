const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('requests info')
        .addUserOption(user =>
            user.setName('user')
                .setDescription('obtain info from this user')
                .setRequired(false)),
    async execute(interaction) {
        let imember;
        let botYN;
        let fEmbed;
        let isGuild = interaction.inGuild();
        const iuser = interaction.options.getUser('user');

        if (iuser) {
            if (isGuild) {
                imember = interaction.guild.members.cache.get(iuser.id)
                if (imember.user.bot) {
                    botYN = '<:check:1051242580144308295>'
                } else {
                    botYN = '<:cross:1051242577736777769>'
                }
            } else {
                imember = iuser
                if (imember.bot) {
                    botYN = '<:check:1051242580144308295>'
                } else {
                    botYN = '<:cross:1051242577736777769>'
                }
            }
        } else {
            if (isGuild) {
                imember = interaction.member
                if (imember.user.bot) {
                    botYN = '<:check:1051242580144308295>'
                } else {
                    botYN = '<:cross:1051242577736777769>'
                }
            } else {
                imember = interaction.user
                if (imember.bot) {
                    botYN = '<:check:1051242580144308295>'
                } else {
                    botYN = '<:cross:1051242577736777769>'
                }
            }
        }

        if (isGuild) {
            const rolemap = imember.roles.cache
                .sort((a, b) => b.position - a.position)
                .map(r => r)
                .join(", ");

            if (rolemap.length > 1024) rolemap = 'too many roles.';
            if (!rolemap) rolemap = 'no roles.';

            const userEmbed = new EmbedBuilder()
                .setColor("#2f3136")
                .setTitle(`// ${imember.user.username}'s info`)
                .setThumbnail(`${imember.user.displayAvatarURL({ dynamic: true })}`)
                .addFields(
                    { name: "id:", value: `${imember.id}`, inline: true },
                    { name: "bot:", value: `${botYN}`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: "date created:", value: `${dayjs(imember.user.createdAt).format('dddd DD/MM/YYYY HH:mm')}`, inline: true },
                    { name: "joined at:", value: `${dayjs(imember.joinedAt).format('dddd DD/MM/YYYY HH:mm')}`, inline: true },
                    { name: 'roles:', value: rolemap }
                );

            fEmbed = userEmbed;
        } else {
            const userEmbed = new EmbedBuilder()
                .setColor("#2f3136")
                .setTitle(`// ${imember.username}'s info`)
                .setThumbnail(`${imember.displayAvatarURL({ dynamic: true })}`)
                .addFields(
                    { name: "id:", value: `${imember.id}`, inline: true },
                    { name: "bot:", value: `${botYN}`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: "date created:", value: `${dayjs(imember.createdAt).format('dddd DD/MM/YYYY HH:mm')}`, inline: true }
                );

            fEmbed = userEmbed;
        }



        await interaction.reply({ embeds: [fEmbed] })
    },
};