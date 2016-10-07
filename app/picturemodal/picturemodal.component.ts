import { Component, HostListener } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import {Picture} from '../shared/picture';

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

  constructor(public dialog: DialogRef<PictureModalContext>) {
    this.context = dialog.context;
  }

  @HostListener('window:keydown', ['$event.keyCode'])
  onKeyUp(keycode: number) {
    keycode === 37 && this.prevPicture(); //left arrow
    keycode === 39 && this.nextPicture(); //right arrow
  }

  nextPicture(){
    this.context.picture = this.context.picture.next; 
  }

  prevPicture(){
    this.context.picture = this.context.picture.previous; 
  }

  beforeDismiss(): boolean {
    return false;
  }

  beforeClose(): boolean {
    return false;
  }
}
