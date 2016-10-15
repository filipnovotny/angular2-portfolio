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
  private collection: PictureCollection;
  constructor(private http: Http,@Inject(APP_CONFIG) config: AppConfig) { 
    this.picturesUrl  = config.url;
  }

  public setUrl(url: string) : void{
    this.picturesUrl = url;
  }

  getPictures(): Observable<PictureCollection> {
        return this.http.get(this.picturesUrl)
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
                                  return pcl;
                               }
                            )
                         //...errors if any
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }
}