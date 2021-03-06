import { Component, OnInit , AfterViewInit, ElementRef, Inject, Input } from '@angular/core';
import { PictureService } from './shared/picture.service'
import { Picture } from './shared/picture'
import { RouterModule,Router ,ActivatedRoute}   from '@angular/router';
import { AppConfig, APP_CONFIG } from './shared/config.service';

@Component({
	moduleId: module.id,
    selector: 'portfolio',
    templateUrl: 'portfolio.component.html',
    styleUrls: ['portfolio.component.css'],
    //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
    providers: [PictureService]

})
export class PortfolioComponent implements OnInit, AfterViewInit  { 
	@Input() url: string;
	
	private galleries: string[];
	private cur_gallery: string;

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

	constructor(private image_service: PictureService,
				@Inject(APP_CONFIG) config: AppConfig,
				private router:Router,private route: ActivatedRoute,
				private el: ElementRef){
		this.status="Chargement des images...";

		this.galleries = JSON.parse(el.nativeElement.getAttribute('galleries'));
		this.cur_gallery = config.default_gallery;
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

	public ngOnInit(): void {
		if(this.url)
			this.image_service.setUrl(this.url);
		if(this.galleries)
			console.log("found galleries:" + this.galleries);
	}

	public getTabClass(gallery) : string {
		this.cur_gallery = this.router.url.split("/")[2];
		return this.cur_gallery==gallery?"active":"inactive";
	}

}