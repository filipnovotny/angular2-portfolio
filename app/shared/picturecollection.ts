import { PictureBase, Picture, Thumbnail } from './picture';
import {Observable, Observer} from 'rxjs/Rx';
import * as _ from "underscore";


export class PictureBaseWithParent extends PictureBase {
  constructor(json?:PictureBase, private collection?: PictureCollection) {
    super(json);
  }
  public picLoaded() : void {
    this.collection.picLoaded(this);
  }
  public picError() : void {
    this.collection.picError(this);
  }
}

export class ThumbnailWithParent extends Thumbnail {
  constructor(json?:Thumbnail, private collection?: PictureCollection) {
    super(json);
  }
  public picLoaded() : void {
    this.collection.picLoaded(this);
  }
  public picError() : void {
    this.collection.picError(this);
  }
}

export class PictureWithParent extends Picture {
  constructor(json?:Picture, private collection?: PictureCollection) {
    super(json);
    super.createThumbs(json);
  }
  public picLoaded() : void {
    this.collection.picLoaded(this);
  }
  public picError() : void {
    this.collection.picError(this);
  }

  public createThumbnail(json: Thumbnail) : Thumbnail {
    console.log("creating thumbnail on this with ", this, "with", this.collection);
    return new ThumbnailWithParent(json, this.collection);
  }  
}


export class PictureCollection implements IterableIterator<Picture> {

  private pointer :number= 0;
  private nbLoaded :number= 0;
  private maxLoaded: number =0;
  private observer: Observer<Picture[]>;
  
  constructor(private collection: Picture[]) {

  }

  public get length(): number {
    return this.collection.length;
  }

  public push(val: Picture): number {
    this.collection.push(val);
    return 0; 
  }

  public getCollection() : Observable<Picture[]>{
    return Observable.create(observer => {      
      this.observer = observer;      
    });
    
  }

  public getTempCollection() : Picture[]{
    return this.collection;
  }

  private reorderCollection() : void{
    if(this.nbLoaded>=this.maxLoaded){
      console.log("all pics loaded:",this.nbLoaded,this.maxLoaded)
      var processedCollection = _(this.collection).without(_(this.collection).findWhere({faulty: true}));
      var processedCollection = _(processedCollection).sortBy(pic => pic.width/pic.height);
      console.log(this.collection);
      console.log(processedCollection);
      this.observer.next(processedCollection);
      this.observer.complete();
    }
  }

  public picLoaded(pic: PictureBase) : void{
    this.nbLoaded++;
    console.log("Pic is loaded",this.nbLoaded,pic);
    this.reorderCollection();
  }

  public picError(pic: PictureBase) : void{
    this.nbLoaded++;
    pic.faulty = true;
    console.log("Error loading pic",this.nbLoaded,pic);
    this.reorderCollection();
  }

  public next(): IteratorResult<Picture> {
    if (this.pointer < this.collection.length) {
      return {
        done: false,
        value: this.collection[this.pointer++]
      }
    } else {
      return {
        done: true
      }
    }
  }

  public setPictures(pics: Picture[]){
    this.collection = pics;
    for(var pic of pics){
      this.maxLoaded+=(pic.thumbs.length+1);
    }
    console.log("max pics are set to ",this.maxLoaded);
  }

  [Symbol.iterator](): IterableIterator<Picture> {
    return this;
  }

}
