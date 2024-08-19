interface ChannelSettingsData {
  autochat: {
    enabled: boolean;
    lowerThreshold: number;
    upperThreshold: number;
  };
}

class GuildChannel {
  private settings: ChannelSettingsData;
  private messageCount: number;
  private responseThreshold: number;

  public channelId: string;

  constructor(channelId: string) {
    this.channelId = channelId;

    // Configuración inicial por defecto
    this.settings = {
      autochat: {
        enabled: true,
        lowerThreshold: 5,
        upperThreshold: 25,
      },
    };

    this.messageCount = 0;
    this.responseThreshold = this.generateRandomThreshold();
  }

  // Método privado para generar un umbral aleatorio basado en los límites configurados
  private generateRandomThreshold(): number {
    const { lowerThreshold, upperThreshold } = this.settings.autochat;
    return (
      Math.floor(Math.random() * (upperThreshold - lowerThreshold + 1)) +
      lowerThreshold
    );
  }

  // Método para incrementar el conteo de mensajes y verificar si el bot debe responder
  public shouldRespond(): boolean {
    if (!this.settings.autochat.enabled) return false;

    this.messageCount++;

    if (this.messageCount >= this.responseThreshold) {
      this.messageCount = 0; // Resetear el contador
      this.responseThreshold = this.generateRandomThreshold(); // Generar un nuevo umbral
      return true;
    }

    return false;
  }

  // Método para obtener las configuraciones actuales
  public getSettings(): ChannelSettingsData {
    return this.settings;
  }

  // Método para establecer o modificar configuraciones
  public setSettings(newSettings: Partial<ChannelSettingsData>): void {
    this.settings = {
      ...this.settings,
      ...newSettings,
      autochat: {
        ...this.settings.autochat,
        ...newSettings.autochat,
      },
    };

    // Reiniciar el umbral de respuesta cuando cambian las configuraciones
    this.responseThreshold = this.generateRandomThreshold();
  }
}

export default GuildChannel;
