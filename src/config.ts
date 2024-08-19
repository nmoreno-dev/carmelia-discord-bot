import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '../.env' });

class Config {
  private static instance: Config;
  public readonly NODE_ENV: string;
  public readonly TENOR_API_KEY: string;
  public readonly GIPHY_API_KEY: string;
  public readonly OPENAI_API_KEY: string;
  public readonly DISCORD_BOT_TOKEN: string;
  public readonly DISCORD_CLIENT_ID: string;
  public readonly DISCORD_GUILD_ID: string;
  public readonly IMAGE_GENERATION: string;

  private constructor() {
    dotenv.config();

    process.env.TZ = 'America/Argentina/Buenos_Aires';

    // Verificar y asignar las variables de entorno
    this.NODE_ENV = this.getEnvVar('NODE_ENV');
    this.TENOR_API_KEY = this.getEnvVar('TENOR_API_KEY');
    this.GIPHY_API_KEY = this.getEnvVar('GIPHY_API_KEY');
    this.OPENAI_API_KEY = this.getEnvVar('OPENAI_API_KEY');
    this.DISCORD_BOT_TOKEN = this.getEnvVar('DISCORD_BOT_TOKEN');
    this.DISCORD_CLIENT_ID = this.getEnvVar('DISCORD_CLIENT_ID');
    this.DISCORD_GUILD_ID = this.getEnvVar('DISCORD_GUILD_ID');
    this.IMAGE_GENERATION = this.getEnvVar('IMAGE_GENERATION');
  }

  private getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`La variable de entorno ${key} no está definida`);
    }
    return value;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export const config = Config.getInstance();
