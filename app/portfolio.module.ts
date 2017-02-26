import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { PortfolioComponent }  from './portfolio.component';
import { GalleryComponent }  from './gallery/gallery.component';
import { PortfolioItemComponent }  from './portfolioitem/portfolioitem.component';
import { ModalWrapperComponent } from './modalwrapper/modalwrapper.component';

import { PictureModalComponent } from './picturemodal/picturemodal.component';

import { RouterModule }   from '@angular/router';

declare var PORTFOLIO_default_gallery : string;

if(typeof PORTFOLIO_default_gallery == 'undefined')
	PORTFOLIO_default_gallery = 'default';


@NgModule({
  imports: [ 
  	BrowserModule, 
  	HttpModule, 
  	ModalModule.forRoot(),

    BootstrapModalModule,
    RouterModule.forRoot(
	    	[
		    	{ 
		    		path: '', 
		    		pathMatch: 'full', 
		    		redirectTo: '/gallery/'+PORTFOLIO_default_gallery
		    	},
		    	{ 
		    		path: 'gallery/:galleryid', 
		    		component: GalleryComponent,
		    		pathMatch: 'full'
		    	},
		    	{ 
		    		path: 'gallery/:galleryid', 
		    		component: GalleryComponent,
		    		children:
		    			[
		    				{ path: '', pathMatch: 'full' },
			    			{ path: 'modal/:id', component: ModalWrapperComponent }
		    			]
		    	}
			]
		)
	],
	declarations: [ PortfolioComponent, GalleryComponent, ModalWrapperComponent, PortfolioItemComponent, PictureModalComponent ],
	bootstrap: [ PortfolioComponent ],
	
	entryComponents: [ PictureModalComponent ]
})
export class PortfolioModule { }