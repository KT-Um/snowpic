import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContentShowDialogComponent } from './content-show-dialog/content-show-dialog.component';
import { ContentsProviderService, Content } from './contentsprovider.service';
import { APP_TITLE, SUPPORTED_FORMAT } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private readonly IMAGE_EXTENSIONS;
  private _items: Content[];
  private readonly _title: string;
  private _pastPath: string;

  constructor(private contentsProvider: ContentsProviderService, private dialog: MatDialog) {
    this._title = APP_TITLE.title;
    this.IMAGE_EXTENSIONS = SUPPORTED_FORMAT.format;
    this._items = [];
    this._pastPath = '';
  }

  ngOnInit(): void {
    this.contentsProvider.accessTopDirectory(this.onRetrieve);
  }

  private init(): void {
    this._items = [];
    this._pastPath = '';
  }

  public home(): void {
    this.init();
    this.contentsProvider.accessTopDirectory(this.onRetrieve);
  }

  public isTopDirectory(): boolean {
    return this.contentsProvider.isNowTopDirectory();
  }

  public get currentPath(): string {
    return this.contentsProvider.getCurrentPath();
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

  public get pastPath(): string {
    return this._pastPath;
  }

  private onRetrieve = (contents: Content[]) => {
    this._items = [];
    contents.forEach((content: Content) => {
      if (content.type === 'file') {
        if (this.isImageFile(content.name)) {
          this._items.push(content);
        }
      } else {
        this._items.push(content);
      }
    });
  };

  public exploreIn(newPath: string): void {
    this.contentsProvider.exploreIn(this.onRetrieve, newPath);
  }

  public exploreOut(): void {
    this._pastPath = this.contentsProvider.exploreOut(this.onRetrieve);
  }

  private isImageFile(imageName: string): boolean {
    const extension = imageName.substring(imageName.lastIndexOf('.') + 1, imageName.length);

    if (extension.match(this.IMAGE_EXTENSIONS)) {
      return true;
    } else {
      return false;
    }
  }

  public get isLoading(): boolean {
    return this.contentsProvider.isLoading();
  }

  public showContent(contentName: string): void {
    this.currentPath;
    const content: Content | undefined = this.contentsProvider.getContent(contentName);

    const dialogRef = this.dialog.open(ContentShowDialogComponent, {
      data: content,
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
  }
}
