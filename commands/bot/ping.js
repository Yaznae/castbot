const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pings bot // returns latency'),
    async execute(interaction) {
        await interaction.reply(`\`:\` latency is ${Math.round(interaction.client.ws.ping)}ms`)
    },
};