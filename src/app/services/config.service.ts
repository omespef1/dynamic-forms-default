import { Injectable } from '@angular/core';
import { Config } from 'src/app/models/config';
import { HttpClient } from '@angular/common/http';
import { CONFIG_LS_NAME,APP_VERSION } from '../utils/const';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  get config(): Config {
    const data = localStorage.getItem(`${CONFIG_LS_NAME}-${APP_VERSION}`);
    if (data && data !== '') {
      return JSON.parse(atob(data));
    }
    return new Config();
  }

  constructor(private http: HttpClient) { }

  clean() {
    localStorage.removeItem(`${CONFIG_LS_NAME}-${APP_VERSION}`);
  }

  async getAppConfig(): Promise<void> {
    try {
      const config = await this.http.get<Config>('assets/config/config.json').toPromise();
      if (config) {
        localStorage.setItem(`${CONFIG_LS_NAME}-${APP_VERSION}`, btoa(JSON.stringify(config)));
      }
    } catch (error) {
      console.error(`ConfigService: ${error}`);
    }
  }
}
