import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AppConfig, APP_CONFIG } from '../shared/config.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Observable} from 'rxjs/Rx';

import { Picture } from './picture';
import { PictureCollection, PictureWithParent } from './picturecollection';


@Injectable()
export class PictureService {
  private picturesUrl : string;
  private basePicturesUrl : string;
  private collection: PictureCollection;
  private resolved_collection: boolean = false;
  private ppics: Picture[];
  private obs_collection: Observable<PictureCollection> = null;
  private obs_collection_onetime: Observable<PictureCollection> = null;
  private imageExtention : string = ".json"; 
  constructor(private http: Http,@Inject(APP_CONFIG) config: AppConfig) { 
    this.basePicturesUrl  = config.url; 

    this.obs_collection_onetime = Observable.create(observer => {
        if(this.resolved_collection){
          observer.next(this.collection);
          observer.complete();
        }else{
          this.obs_collection.subscribe(collection => {
            this.resolved_collection = true;
            this.collection = collection;
            observer.next(collection);
            observer.complete();
          });  
        }
           
      });
  }

  public setUrl(url: string) : void{
    var new_url:string = this.basePicturesUrl+url+this.imageExtention;
    if(this.picturesUrl && this.picturesUrl != new_url){
      this.picturesUrl = new_url
      this.resolved_collection = false;
      this.retrievePictures();
    }
    else
      this.picturesUrl = new_url;
  }

  private retrievePictures() : void{
    this.obs_collection = this.http.get(this.picturesUrl)
                        // ...and calling .json() on the response to return data
                         .map(
                               (res:Response) : PictureCollection => {
                                 var pics : Picture[];
                                 var pcl = new PictureCollection(pics);
                                 pics = res.json().data.map
                                  (
                                    (elt : Picture) : Picture => 
                                          new PictureWithParent(elt,pcl)
                                       
                                  );
                                  for(let idx in pics){
                                    var _idx = parseInt(idx);
                                    pics[idx].previous = pics[(_idx-1+pics.length)%pics.length];
                                    pics[idx].next = pics[(_idx+1+pics.length)%pics.length];

                                  }
                                  pcl.setPictures(pics);
                                  this.ppics = pics;
                                  return pcl;
                               }
                            )
                         //...errors if any
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));


  }

  getOrderedPictures() : Observable<Picture[]> {
    return null;
  }

  getPicture(id: number) : Observable<Picture> {
    var observable = Observable.create(observer => {      
        this.obs_collection_onetime.subscribe(collection => {
          var picture = _(collection.getTempCollection()).find(o => o.id==id);
          observer.next(picture);
          observer.complete();
        }
      ); 
    });
    return observable;
  }

  getPictures(): Observable<PictureCollection> {
    if(!this.obs_collection)
      this.retrievePictures();
    return this.obs_collection_onetime;
  }
}