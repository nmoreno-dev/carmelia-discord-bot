import { Client, Events } from 'discord.js';
import { DiscordBot } from '..';

export default {
  name: Events.ClientReady,
  once: true, // Se ejecuta solo una vez
  execute(bot: DiscordBot, client: Client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
};
