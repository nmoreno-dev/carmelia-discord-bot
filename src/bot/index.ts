import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { config } from '../config';
import path from 'path';
import fs from 'fs';
import { GuildContext } from './GuildContext';

const DISCORD_BOT_TOKEN = config.DISCORD_BOT_TOKEN;

export class DiscordBot {
  // Extendemos el tipo del client para incluir 'commands'
  private client: Client;
  private guildContexts: Map<string, GuildContext>;
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.client.commands = new Collection();
    this.guildContexts = new Map();

    this.loadCommands();
    this.loadEvents();
  }

  private loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        this.client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }

  private loadEvents() {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath).default; // Importa el evento con `default`

      if (event.once) {
        this.client.once(event.name, (...args) => event.execute(this, ...args));
      } else {
        this.client.on(event.name, (...args) => event.execute(this, ...args));
      }
    }
  }

  public getGuildContext(guildId: string): GuildContext {
    if (!this.guildContexts.has(guildId)) {
      this.guildContexts.set(guildId, new GuildContext(guildId));
    }
    return this.guildContexts.get(guildId)!;
  }

  public login() {
    this.client.login(DISCORD_BOT_TOKEN);
  }
}
