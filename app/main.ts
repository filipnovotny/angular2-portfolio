import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { PortfolioModule } from './portfolio.module';
import { APP_CONFIG, AppConfig }  from './shared/config.service';

declare var PORTFOLIO_url : string;
export var PORTFOLIO_DI_CONFIG: AppConfig = {
  url: '/img/',
  title: 'Portfolio configuration'
};

if(typeof PORTFOLIO_url !== 'undefined')
	PORTFOLIO_DI_CONFIG.url = PORTFOLIO_url;

platformBrowserDynamic([{ provide: APP_CONFIG, useValue: PORTFOLIO_DI_CONFIG }]).bootstrapModule(PortfolioModule);	

