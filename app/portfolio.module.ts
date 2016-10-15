import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { PortfolioComponent }  from './portfolio.component';
import { PortfolioItemComponent }  from './portfolioitem/portfolioitem.component';

import { PictureModalComponent } from './picturemodal/picturemodal.component';



@NgModule({
  imports: [ 
  	BrowserModule, 
  	HttpModule, 
  	ModalModule.forRoot(),
    BootstrapModalModule
  	],
  declarations: [ PortfolioComponent,PortfolioItemComponent, PictureModalComponent ],
  bootstrap: [ PortfolioComponent ],

  entryComponents: [ PictureModalComponent ]
})
export class PortfolioModule { }