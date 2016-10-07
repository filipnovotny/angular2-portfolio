import { Component, ViewContainerRef, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { Picture, Thumbnail } from "../shared/picture"

import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { PictureModalContext, PictureModalComponent } from '../picturemodal/picturemodal.component';


@Component({
	moduleId: module.id,
	templateUrl: 'portfolioitem.component.html',
	styleUrls: ['portfolioitem.component.css'],
    selector: 'portfolio-item',

    providers: [Modal]
})
export class PortfolioItemComponent implements OnInit {	
	@Input() picture: Picture;
	@Input() elementwidth: number;

  	constructor(overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    	overlay.defaultViewContainer = vcRef;
  	}

	public getWidth() : number{
		return this.picture.getClosestThumbBySize(this.elementwidth).width;
	}

	get width() : number{
	  return this.picture.getClosestThumbBySize(this.elementwidth).width;
	}

	get selectedthumb() : Thumbnail{
	  return this.picture.getClosestThumbBySize(this.elementwidth);
	}

	public ngOnInit(): void {
		
	}

	onClick() {
		return this.modal.open(PictureModalComponent,  overlayConfigFactory({ 
			picture: this.picture,
			showClose : true,
			isBlocking : false,
			size : 'md'
		}, PictureModalContext));
  }
}