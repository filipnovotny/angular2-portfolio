import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { APP_CONFIG, AppConfig }  from './shared/config.service';

import { PortfolioComponent }  from './portfolio.component';
import { PortfolioItemComponent }  from './portfolioitem/portfolioitem.component';

import { PictureModalComponent } from './picturemodal/picturemodal.component';

export const PORTFOLIO_DI_CONFIG: AppConfig = {
  url: '/img/images.json',
  title: 'Portfolio configuration'
};

@NgModule({
  imports: [ 
  	BrowserModule, 
  	HttpModule, 
  	ModalModule.forRoot(),
    BootstrapModalModule
  	],
  declarations: [ PortfolioComponent,PortfolioItemComponent, PictureModalComponent ],
  providers: [{ provide: APP_CONFIG, useValue: PORTFOLIO_DI_CONFIG }],
  bootstrap: [ PortfolioComponent ],

  entryComponents: [ PictureModalComponent ]
})
export class PortfolioModule { }