const { REST, Routes } = require('discord.js');
require('dotenv').config()
const fs = require('node:fs')

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`[+] refreshing ${commands.length} commands...`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`[+] refreshed ${commands.length} commands.`)
    } catch (error) {
        console.error(error);
    }
})();