import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageShowDialogComponent, ImageSrc } from './image-show-dialog/image-show-dialog.component';
import { ImageproviderService } from './imageprovider.service';
import { APP_TITLE, SUPPORT_FORMAT } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private readonly IMAGE_EXTENSIONS;
  private _items: { name: string, type: string, date: string, src: string }[];
  private readonly _title: string;

  constructor(private imageProvider: ImageproviderService, private dialog: MatDialog) {
    this._items = [];
    this._title = APP_TITLE.title;
    this.IMAGE_EXTENSIONS = SUPPORT_FORMAT.format;
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

  public get title(): string {
    return this._title;
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
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
  }
}
