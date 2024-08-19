import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Agent from '../../agent';
import { DiscordBot } from '..';

const command = new SlashCommandBuilder()
  .setName('gif')
  .setDescription('Fetch a GIF based on the recent chat history.')
  .addStringOption((option) =>
    option
      .setName('query')
      .setDescription('A specific search query for the GIF')
      .setRequired(false),
  ); // Este parámetro es opcional;

module.exports = {
  data: command,
  async execute(_bot: DiscordBot, interaction: ChatInputCommandInteraction) {
    if (!interaction.channel) return;

    await interaction.deferReply(); // Diferir la respuesta ya que la operación puede tardar
    const query = interaction.options.getString('query');

    const agent = new Agent();

    const fetchedMessages = await interaction.channel.messages.fetch({
      limit: 20,
    });

    const linkRegex = /https?:\/\/[^\s]+/g; // Regex para detectar enlaces HTTP o HTTPS

    const context: { role: 'user' | 'assistant'; content: string }[] = [];
    fetchedMessages.reverse().forEach((msg) => {
      // Remover los enlaces del contenido del mensaje
      const contentWithoutLinks = msg.content.replace(linkRegex, '[link]');
      context.push({
        role: msg.author.bot ? 'assistant' : 'user',
        content: msg.author.bot
          ? contentWithoutLinks
          : JSON.stringify({
              user_id: msg.author.id,
              user_name: msg.author.username,
              message_content: contentWithoutLinks,
            }),
      });
    });

    // Asumiendo que `agent.getGIFCompletion` es una función que se puede adaptar para trabajar con slash commands
    const answer = await agent.getGIFCompletion({
      context,
      humanGeneratedQuery: query,
    });

    // Enviar el primer mensaje con la query
    await interaction.followUp({
      content: `GIF Query: ${answer.query}`,
    });

    // Enviar el segundo mensaje con el link del GIF
    await interaction.followUp({
      content: `${answer.gifURL}`,
    });
  },
};
