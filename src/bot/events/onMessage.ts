import { Message, Events } from 'discord.js';
import Agent from '../../agent';
import { DiscordBot } from '..';

const agent = new Agent();

// MARK: askAI()
const askAI = async (message: Message) => {
  message.channel.sendTyping();
  const fetchedMessages = await message.channel.messages.fetch({
    limit: 20,
  });
  const history: { role: 'user' | 'assistant'; content: string }[] =
    fetchedMessages.reverse().map((msg) => {
      return {
        role: msg.author.bot ? 'assistant' : 'user',
        content: msg.author.bot
          ? msg.content
          : JSON.stringify({
              user_id: msg.author.id,
              user_name: msg.author.bot ? 'NatalIA' : msg.author.globalName,
              message_content: msg.content,
            }),
      };
    });
  const answere = await agent.getChatCompletion(history);

  if (agent.shouldIncludeGif) {
    const gif = await agent.getGIFCompletion({
      context: { role: 'user', content: answere },
    });
    await message.channel.send(`${answere}`);
    await message.channel.send(`GIF Query: ${gif.query}`);
    return await message.channel.send(`${gif.gifURL}`);
  }

  return await message.channel.send(answere);
};

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(bot: DiscordBot, message: Message) {
    // Verifica que el mensaje no sea de un bot
    if (message?.author?.bot) return;

    // MARK: Should Respond
    const shouldNataliaRespond = /\b(Carmelia|Carme)\b/i.test(message.content);
    if (shouldNataliaRespond) {
      return askAI(message);
    }

    // MARK: Interventions
    const guildId = message.guild?.id;
    if (!guildId) return;

    // Obtener o crear el contexto del servidor
    const guildContext = bot.getGuildContext(guildId);
    const channelId = message.channel.id;

    // Obtener o crear las configuraciones del canal
    const channelSettings = guildContext.getChannel(channelId);

    // Check if autochat is enabled
    if (!channelSettings.getSettings().autochat.enabled) return;

    if (channelSettings.shouldRespond()) {
      return askAI(message);
    }
  },
};
