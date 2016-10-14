import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { PortfolioModule } from './portfolio.module';
import {enableProdMode} from '@angular/core';

enableProdMode();
platformBrowserDynamic().bootstrapModule(PortfolioModule);