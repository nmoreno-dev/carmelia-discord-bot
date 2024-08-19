import GuildChannel from './GuildChannel';

export class GuildContext {
  public channels: Map<string, GuildChannel>; // Puedes ajustar 'any' al tipo que mejor se adapte a tus configuraciones
  public guildId: string;
  constructor(guildId: string) {
    this.channels = new Map();
    this.guildId = guildId;
  }

  public getChannel(channelId: string): GuildChannel {
    if (!this.channels.has(channelId)) {
      this.channels.set(channelId, new GuildChannel(channelId));
    }

    return this.channels.get(channelId)!;
  }
}
