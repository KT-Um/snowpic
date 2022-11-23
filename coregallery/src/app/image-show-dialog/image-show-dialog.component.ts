import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ImageSrc {
  src: string;
}

@Component({
  selector: 'cg-image-show-dialog',
  templateUrl: './image-show-dialog.component.html',
  styleUrls: ['./image-show-dialog.component.css']
})
export class ImageShowDialogComponent implements AfterViewInit {

  private _src: string;
  private _isDialogOpened: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) private data: ImageSrc) {
    this._src = data.src;
    this._isDialogOpened = false;
    setTimeout(()=>{this.isDialogOpened = true;}, 200);
  }

  ngAfterViewInit(): void {
  }

  public get src(): string {
    return this._src;
  }

  public set isDialogOpened(isOpened: boolean) {
    this._isDialogOpened = isOpened;
  }

  public get isDialogOpened(): boolean {
    return this._isDialogOpened;
  }
}
