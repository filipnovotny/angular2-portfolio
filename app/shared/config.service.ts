import { OpaqueToken } from '@angular/core';

export interface AppConfig {
  url: string;
  title: string;
}

export let APP_CONFIG = new OpaqueToken('app.config');