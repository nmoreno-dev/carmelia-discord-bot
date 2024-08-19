import { REST, Routes } from 'discord.js';
import { config } from '../config';
import path from 'path';
import fs from 'fs';

const { DISCORD_GUILD_ID, DISCORD_CLIENT_ID, DISCORD_BOT_TOKEN } = config;

export class CommandDeployer {
  private commands: any[] = [];

  constructor() {
    this.loadCommands();
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
        this.commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }

  public async deployCommands() {
    const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

    try {
      console.log(
        `Started refreshing ${this.commands.length} application (/) commands.`,
      );

      const data = await rest.put(
        Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
        { body: this.commands },
      );

      console.log(
        `Successfully ${(data as unknown as any[]).length} reloaded application (/) commands.`,
      );
    } catch (error) {
      console.error(error);
    }
  }
}

// Si quieres ejecutar directamente la clase
const deployer = new CommandDeployer();
deployer.deployCommands();
