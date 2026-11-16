import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private apiUrl!: string;

  loadConfig(): void {
    const envUrl = (window as any).__API_URL__ as string | undefined;

    if (envUrl) {
      // Producao (Coolify): URL definida pela variavel API_URL
      this.apiUrl = envUrl.replace(/\/+$/, '');
    } else {
      // Desenvolvimento local: mesmo host, porta 8080
      const ip = window.location.hostname;
      this.apiUrl = `http://${ip}:8080`;
    }

    console.log('API configurada:', this.apiUrl);
  }

  getApi(path: string): string {
    if (!this.apiUrl) {
      throw new Error('Configuração ainda não carregada!');
    }
    return `${this.apiUrl}/${path}`;
  }
}
