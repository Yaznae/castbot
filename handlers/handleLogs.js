const { EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs')

function handleLogs(client) {
    const logSchema = require('../models/logs');

    function send_log(guildId, embed) {
        logSchema.findOne({ Guild: guildId }, async (err, data) => {
            const logChannel = client.guilds.cache.get(data.Channel);
            embed.setTimestamp();
            logChannel.send({ embeds: [embed] });
        });
    }

    client.on("messageDelete", function (message) {
        if (message.author.bot) return;

        const embed = new EmbedBuilder()
            .setTitle('// deleted message')
            .setColor('#2f3136')
            .setDescription(`
            \`author:\` <@${message.author.id}>
            \`date:\` ${dayjs(message.createdAt).format('dddd DD/MM/YYYY HH:mm')}
            \`channel:\` <#${message.channel.id}>
            \`message:\`
            ${message.content.replace(/`/g, "'")}
            `);

        return send_log(message.guild.id, embed);
    });

    client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {

        const embed = new EmbedBuilder()
            .setTitle('// channel topic update')
            .setColor('#2f3136')
            .setDescription(`
            \`channel:\` <#${channel.id}>
            \`old topic:\` ${oldTopic}
            \`new topic:\` ${newTopic}
            `);

        return send_log(channel.guild.id, embed)
    });

    client.on('guildMemberBoost', (member) => {

        const embed = new EmbedBuilder()
            .setTitle('// server boosted !!')
            .setColor('Pink')
            .setDescription(`
            \`booster:\` <@${member.user.id}>
            \n
            thank u sm for boosting ♡`)

        return send_log(member.guild.id, embed);
    });
}

module.exports = { handleLogs }