import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageShowDialogComponent, ImageSrc } from './image-show-dialog/image-show-dialog.component';
import { ImageproviderService } from './imageprovider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private readonly IMAGE_EXTENSIONS = /jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF/;
  private _items: { name: string, type: string, date: string, src: string }[];

  constructor(private imageProvider: ImageproviderService, private dialog: MatDialog) {
    this._items = [];
  }

  public isTopDirectory(): boolean {
    return this.imageProvider.isNowTopDirectory();
  }

  public get currentPath(): string {
    return this.imageProvider.getCurrentPath();
  }

  public get items(): { name: string, type: string, src: string }[] {
    return this._items;
  }

  public get count(): number {
    return this._items.length;
  }

  private onRetrieve = (contents: any) => {
    this._items = [];
    contents.forEach((content: any) => {
      if (content.type === 'file') {
        if (this.isImageFile(content.name)) {
          content.src = this.getImageURL(content.name);
          this._items.push(content);
        }
      } else {
        this._items.push(content);
      }
    });
  };

  ngOnInit(): void {
    this.imageProvider.accessTopDirectory(this.onRetrieve);
  }

  public exploreIn(newPath: string): void {
    this.imageProvider.exploreIn(this.onRetrieve, newPath);
  }

  public exploreOut(): void {
    this.imageProvider.exploreOut(this.onRetrieve);
  }

  private isImageFile(imageName: string): boolean {
    const extension = imageName.substring(imageName.lastIndexOf('.') + 1, imageName.length);
    const match = extension.match(this.IMAGE_EXTENSIONS);
    if (match) {
      return true;
    }
    return false;
  }

  public get isLoading(): boolean {
    return this.imageProvider.isLoading();
  }

  private getImageURL(imageName: string): string {
    return this.imageProvider.url.concat(this.currentPath, imageName);
  }

  public showImage(imageName: string) {
    this.currentPath;
    const imageSrc: ImageSrc = { src: this.getImageURL(imageName) };
    const dialogRef = this.dialog.open(ImageShowDialogComponent, {
      data: imageSrc,
      width: '95vw',
      height: '95vh',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }
}
