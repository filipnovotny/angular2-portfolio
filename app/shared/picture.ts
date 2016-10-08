import 'rxjs/add/operator/map';

declare var EXIF:any;

export abstract class PictureBase {
	private static counter: number = 0;

	public faulty:boolean = false;

	public id: number = null;

	public label: string;
	public name: string;

	public width: number;
	public height: number;

	public path: string;

	public abstract picLoaded(pic: PictureBase) : void;
	public abstract picError(pic: PictureBase) : void;

	public getSizeDifference(width : number, height?: number) : number{
		return Math.abs(width-this.width)+(height?Math.abs(height-this.height):0);
	}

	public getLabel() : string {
		return this.label;
	}

	public getId(){
		return this.id;
	}

	public constructor(json?: PictureBase) {
		this.id = PictureBase.counter;
		this.label = json.label;
		this.name = json.name;
		this.width = json.width;
		this.height = json.height;
		this.path = json.path;
		var self = this;
		if(!this.width || !this.height){
			
			if(!this.width || !this.height){
				var img  = new Image();
				
				img.onload = function() {  					
					//!!!!!WARNING: there is no error handler in this function
					//we could end up not loading our pictures if this function fails
				    EXIF.getData(img, function() {
				        var orientation: number = EXIF.getTag(this, "Orientation");
				        if(orientation>4){ //take into account exif rotations, if necessary
				        	self.width = this.height;
  							self.height = this.width;
				        }else{
				        	self.width = this.width;
  							self.height = this.height;
				        }
				        self.picLoaded(self);
				    });				    
				}
				img.onerror = function(){
					self.picError(self);
				}
				img.src = this.path;
			}
			
		}else{
			self.picLoaded(self);	
		}
		PictureBase.counter++;	
	}
}

export abstract class Thumbnail extends PictureBase {
	public thumbname : string;
	public thumbsizecategory: number;

	public constructor(json?: Thumbnail) {
		super(json);
		this.thumbname = json.thumbname;
		this.thumbsizecategory = json.thumbsizecategory;
	}
}

export abstract class Picture extends PictureBase {
	public thumbs : Thumbnail[];

	public previous: Picture;
	public next: Picture;

	public abstract createThumbnail(json: Thumbnail) : Thumbnail;

	public getClosestThumbBySize(width: number, height?: number) : Thumbnail {
		var best_thumb : Thumbnail = this.thumbs[0];

		for(let thumb of this.thumbs){
			var difference = thumb.getSizeDifference(width, height);
			var best_difference = best_thumb.getSizeDifference(width, height);
			if(difference<best_difference)
				best_thumb = thumb;
		}
		return best_thumb;
	}

	public constructor(json?: Picture) {
		super(json);
		
	}

	public createThumbs(json?: Picture) : void{
		this.thumbs = json.thumbs.map
                                  (
                                    (elt : Thumbnail) => {
                                          var thumb = this.createThumbnail(elt);
                                          thumb.label = thumb.label?thumb.label:this.label;
                                          thumb.name = thumb.label?thumb.label:this.name;
                                          thumb.id = this.id;
                                          return thumb;
                                       }
                                  );
	}
}

