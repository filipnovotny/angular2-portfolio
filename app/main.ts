import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { PortfolioModule } from './portfolio.module';
import { APP_CONFIG, AppConfig }  from './shared/config.service';

declare var PORTFOLIO_url : string;
declare var PORTFOLIO_default_gallery : string;
export var PORTFOLIO_DI_CONFIG: AppConfig = {
  url: '/img/',
  default_gallery: 'whatever',
  title: 'Portfolio configuration'
};

if(typeof PORTFOLIO_url !== 'undefined')
	PORTFOLIO_DI_CONFIG.url = PORTFOLIO_url;

if(typeof PORTFOLIO_default_gallery !== 'undefined')
	PORTFOLIO_DI_CONFIG.default_gallery = PORTFOLIO_default_gallery;


platformBrowserDynamic([{ provide: APP_CONFIG, useValue: PORTFOLIO_DI_CONFIG }]).bootstrapModule(PortfolioModule);	

