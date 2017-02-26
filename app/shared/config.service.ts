import { OpaqueToken } from '@angular/core';

export interface AppConfig {
  url: string;
  title: string;
  default_gallery: string;

}

export let APP_CONFIG = new OpaqueToken('app.config');