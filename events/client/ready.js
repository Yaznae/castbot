const { Client, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config()

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        await mongoose.connect(process.env.MONGODB || '', {
            keepAlive: true,
        });

        if (mongoose.connect) {
            console.log('[+] connected to mongodb.')
        }

        console.log(`[+] logged in as ${client.user.tag}`);

        const activities = [
            "/help",
            `${client.guilds.cache.size} servers`,
            ".gg/cast"
        ];

        setInterval(() => {
            const status = activities[Math.floor(Math.random() * activities.length)];
            client.user.setPresence({ status: 'idle', activities: [{ name: `${status}`, type: ActivityType.Listening }] });
        }, 5000);
    }
}