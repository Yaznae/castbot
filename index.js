const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
} = require('discord.js');
const logs = require('discord-logs');
require('dotenv').config()

const { handleLogs } = require('./handlers/handleLogs');
const { loadEvents } = require('./handlers/eventHandler');
const { loadCommands } = require('./handlers/commandHandler');

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
});

logs(client, {
    debug: true
});

client.commands = new Collection();

client.login(process.env.TOKEN).then(() => {
    handleLogs(client);
    loadEvents(client);
    loadCommands(client);
});

module.exports = client;