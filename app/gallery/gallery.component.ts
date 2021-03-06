import { Component, OnInit , AfterViewInit, ElementRef, Inject, Input } from '@angular/core';
import { PictureService } from '../shared/picture.service'
import { Picture } from '../shared/picture'
import { RouterModule, ActivatedRoute }   from '@angular/router';

@Component({
	moduleId: module.id,
    selector: 'gallery',
    templateUrl: 'gallery.component.html',
    styleUrls: ['gallery.component.css']
    //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
})
export class GalleryComponent implements AfterViewInit  { 
	@Input() url: string;

	private pictures : Picture[];
	private width : number;
	private height: number;
	private nb_elements_per_row: number = 4;
	private margin : number = 10;
	private borderweight : number = 4;
	private status: string;

	private element_width: number;
	private element_height: number;

	public shouldUseMyClass: boolean;

	constructor(private image_service: PictureService,private el: ElementRef,private route: ActivatedRoute){
		this.status="Chargement des images...";

		route.params.subscribe
		(
			p => 
				{
					var galleryid:string = (p as any).galleryid;
					console.log("gallery changed to " + galleryid);

					image_service.setUrl(galleryid);
					this.getPictures();
				}
		);
	}

	public ngAfterViewInit() : void {	
		
        var sizeCheckInterval = setInterval(() => {        	
        	this.height = this.el.nativeElement.getBoundingClientRect().height;
        	this.width = this.el.nativeElement.getBoundingClientRect().width;

        	if(this.width < 640)
 				this.nb_elements_per_row=2;
 			else
 				this.nb_elements_per_row=4;

        	this.element_width = (this.width)/this.nb_elements_per_row -2*(this.margin+this.borderweight);
        });        
	}

	public getPictures() : void {
		this.image_service.getPictures().subscribe(
								pictures => {
									this.pictures = pictures.getTempCollection();
									this.status="Mise en page des images...";
									return pictures.getCollection().subscribe(
										pictures => {
											this.status="Terminé.";
											this.pictures = pictures
										}
									)
								},
                                err => {
                                    console.log(err);
                                });
	}

}