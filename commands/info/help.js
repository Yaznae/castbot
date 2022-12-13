const { 
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
 } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('shows the list of commands'),
    async execute(interaction) {
        const text = {
            info: 'info',
            moderation: 'moderation',
            misc: 'miscellaneous',
            bot: 'bot'
        };

        const dirs = [
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
        ];

        const formatString = (str) =>
            `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categs = dirs.map((dir) => {
            const getCmds = interaction.client.commands
                .filter((cmd) => cmd.folder === dir)
                .map((cmd) => {
                    return {
                        name: cmd.data.name,
                        description:
                            cmd.data.description ||
                            'no description set.',
                    };
                });

            return {
                directory: formatString(dir),
                commands: getCmds,
            };
        });

        const embed = new EmbedBuilder().setColor("#2f3136").setDescription(
            '// choose a category from the menu:'
        );

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help-menu')
                    .setPlaceholder('select category')
                    .setDisabled(state)
                    .addOptions(
                        categs.map((cmd) => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `// ${cmd.directory} category commands`,
                            };
                        })
                    )
            ),
        ];

        const initialMsg = await interaction.reply({
            embeds: [embed],
            components: components(false),
        });

        const filter = (interaction) =>
            interaction.user.id === interaction.member.id

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.StringSelect,
        });

        collector.on('collect', (interaction) => {
            const [directory] = interaction.values;
            const category = categs.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categEmbed = new EmbedBuilder()
                .setTitle(`// ${formatString(directory)} commands`)
                .setDescription(
                    `list of commands under ${directory}`
                )
                .addFields(
                    category.commands.map((cmd) => {
                        return {
                            name: `\`${cmd.name}\``,
                            value: cmd.description,
                            inline: true
                        };
                    })
                );

            interaction.update({ embeds: [categEmbed] })
        });

        collector.on('end', () => {
            initialMsg.edit({ components: components(true) });
        });
    },
};