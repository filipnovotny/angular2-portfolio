import { Component, HostListener } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import {Picture,Thumbnail} from '../shared/picture';
import { NgClass } from '@angular/common';


export class PictureModalContext extends BSModalContext {
  public picture: Picture;
}

@Component({
  moduleId: module.id,
  selector: 'modal-content',
  styleUrls: ['picturemodal.component.css'],
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */ templateUrl: 'picturemodal.component.html'
})
export class PictureModalComponent implements ModalComponent<PictureModalContext> {
  context: PictureModalContext;
  public shouldUseMyClass: boolean;
  loading: boolean = true;

  constructor(public dialog: DialogRef<PictureModalContext>) {
    this.context = dialog.context;
  }

  @HostListener('window:keydown', ['$event.keyCode'])
  onKeyUp(keycode: number) {
    keycode === 37 && this.prevPicture(); //left arrow
    keycode === 39 && this.nextPicture(); //right arrow
  }

  get selectedthumb() : Thumbnail{
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return this.context.picture.getClosestThumbBySize(x,y);
  }

  nextPicture(){
    this.loading = true;
    this.context.picture = this.context.picture.next; 
  }

  prevPicture(){
    this.loading = true;
    this.context.picture = this.context.picture.previous; 
  }

  beforeDismiss(): boolean {
    return false;
  }

  beforeClose(): boolean {
    return false;
  }

  onLoad() : void {
      this.loading = false;
  }
}
