import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { DiscordBot } from '..';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autochat')
    .setDescription('Manage autochat settings for the current channel.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Set autochat settings.')
        .addBooleanOption((option) =>
          option
            .setName('enabled')
            .setDescription('Enable or disable autochat'),
        )
        .addIntegerOption((option) =>
          option
            .setName('lowerthreshold')
            .setDescription('Set the lower threshold for message responses')
            .setMinValue(1),
        )
        .addIntegerOption((option) =>
          option
            .setName('upperthreshold')
            .setDescription('Set the upper threshold for message responses')
            .setMinValue(2),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('view')
        .setDescription('View the current autochat settings.'),
    ),

  async execute(bot: DiscordBot, interaction: ChatInputCommandInteraction) {
    // Verifica que el comando se esté ejecutando en un servidor
    if (!interaction.guildId || !interaction.channelId) {
      await interaction.reply({
        content: 'This command can only be used in a server channel.',
        ephemeral: true,
      });
      return;
    }

    const guildContext = bot.getGuildContext(interaction.guildId);
    const channelSettings = guildContext.getChannel(interaction.channelId);

    if (interaction.options.getSubcommand() === 'set') {
      // Obtener las opciones, o usar los valores actuales si no se proporcionan
      const currentSettings = channelSettings.getSettings().autochat;

      const enabled =
        interaction.options.getBoolean('enabled') ?? currentSettings.enabled;
      const lowerThreshold =
        interaction.options.getInteger('lowerthreshold') ??
        currentSettings.lowerThreshold;
      const upperThreshold =
        interaction.options.getInteger('upperthreshold') ??
        currentSettings.upperThreshold;

      // Validar que lowerThreshold sea menor que upperThreshold
      if (lowerThreshold >= upperThreshold) {
        await interaction.reply({
          content: 'Lower threshold must be less than upper threshold.',
          ephemeral: true,
        });
        return;
      }

      // Actualizar las configuraciones
      channelSettings.setSettings({
        autochat: {
          enabled: enabled,
          lowerThreshold: lowerThreshold,
          upperThreshold: upperThreshold,
        },
      });

      await interaction.reply({
        content: `Autochat settings updated:\nEnabled: ${enabled}\nLower Threshold: ${lowerThreshold}\nUpper Threshold: ${upperThreshold}`,
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === 'view') {
      const settings = channelSettings.getSettings().autochat;
      await interaction.reply({
        content: `Current autochat settings:\nEnabled: ${settings.enabled}\nLower Threshold: ${settings.lowerThreshold}\nUpper Threshold: ${settings.upperThreshold}`,
        ephemeral: true,
      });
    }
  },
};
