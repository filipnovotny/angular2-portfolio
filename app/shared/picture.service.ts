import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AppConfig, APP_CONFIG } from '../shared/config.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Observable} from 'rxjs/Rx';


import { Picture } from './picture';

@Injectable()
export class PictureService {
  private picturesUrl : string;
  constructor(private http: Http,@Inject(APP_CONFIG) config: AppConfig) { 
    this.picturesUrl  = config.url;
  }

  getPictures(): Observable<Picture[]> {
        return this.http.get(this.picturesUrl)
                        // ...and calling .json() on the response to return data
                         .map(
                               (res:Response) : Picture[] => {
                                 var pics : Picture[] = res.json().data.map
                                  (
                                    (elt : Picture) : Picture => 
                                          new Picture(elt)
                                       
                                  );
                                  for(let idx in pics){
                                    var _idx = parseInt(idx);
                                    pics[idx].previous = pics[(_idx-1+pics.length)%pics.length];
                                    pics[idx].next = pics[(_idx+1+pics.length)%pics.length];

                                  }
                                  return pics;
                               }
                            )
                         //...errors if any
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }
}