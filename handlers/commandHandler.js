function loadCommands(client) {
    const ascii = require('ascii-table');
    const fs = require('node:fs');
    const table = new ascii().setHeading('commands', 'status');

    let cmdArr = [];

    const cmdFolders = fs.readdirSync('./commands');
    for (const folder of cmdFolders) {
        const cmdFiles = fs
            .readdirSync(`./commands/${folder}`)
            .filter((file) => file.endsWith('.js'));

        for (const file of cmdFiles) {
            const cmdFile = require(`../commands/${folder}/${file}`);

            const properties = { folder, ...cmdFile };
            client.commands.set(cmdFile.data.name, properties);

            cmdArr.push(cmdFile.data.toJSON());

            table.addRow(file, 'loaded');
            continue;
        }
    }

    client.application.commands.set(cmdArr);

    return console.log(table.toString(), '\n[+] commands loaded.');
}

module.exports = { loadCommands };