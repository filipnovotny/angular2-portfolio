import { Component, ViewContainerRef, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Picture, Thumbnail } from "../shared/picture"

import { ActivatedRoute, Router }   from '@angular/router';


import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { NgClass } from '@angular/common';

import { PictureModalContext, PictureModalComponent } from '../picturemodal/picturemodal.component';

import { PictureService } from '../shared/picture.service'

import * as _ from "underscore";


@Component({
	moduleId: module.id,
	template: '',

	providers: [Modal]
})
export class ModalWrapperComponent implements OnDestroy { 
	public currentDialog = null;
	public previousId : number = null;
	constructor(private picture_service: PictureService, overlay: Overlay, 
					vcRef: ViewContainerRef, public modal: Modal, private route: ActivatedRoute, private router: Router){
		route.params.subscribe
		(
			p => 
				{
					console.log("url changed!",this.currentDialog);
					if(this.currentDialog){
						this.currentDialog.close();
					}
					var picture = this.picture_service.getPicture((p as any).id).subscribe

						(
							picture => 
							{
								
								this.modal.open(PictureModalComponent,  overlayConfigFactory({ 
																	picture: picture,
																	showClose : true,
																	isBlocking : false,
																	size : 'sm'
																}, PictureModalContext)).then(
									(dialog) => {
										this.previousId = (p as any).id;
										this.currentDialog = dialog;
										this.currentDialog.onDestroy.subscribe(() => {
											if((p as any).id == this.previousId){
												this.router.navigate(['/gallery']);
											}
										});
									}
								);
								
							}
						)
				}
		);
	}

	ngOnDestroy() : void {
		if(this.currentDialog)
			this.currentDialog.close();
	}

}