import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { PortfolioModule } from './portfolio.module';
import {enableProdMode} from '@angular/core';
import { APP_CONFIG, AppConfig }  from './shared/config.service';

declare var PORTFOLIO_url : string;
declare var PORTFOLIO_default_gallery : string;
export var PORTFOLIO_DI_CONFIG: AppConfig = {
  url: '/img/',
  default_gallery: 'default',
  title: 'Portfolio configuration'
};

if(PORTFOLIO_url)
	PORTFOLIO_DI_CONFIG.url = PORTFOLIO_url;

if(typeof PORTFOLIO_default_gallery !== 'undefined')
	PORTFOLIO_DI_CONFIG.default_gallery = PORTFOLIO_default_gallery;


enableProdMode();
platformBrowserDynamic([{ provide: APP_CONFIG, useValue: PORTFOLIO_DI_CONFIG }]).bootstrapModule(PortfolioModule);	

