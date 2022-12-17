import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContentShowDialogComponent } from './content-show-dialog/content-show-dialog.component';
import { ContentsControllerService, Content } from './contentscontroller.service';
import { Environment, EnvironmentLoaderService } from './environmentloader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private readonly NO_APP_NAME: string = '';
  private readonly NO_PATH: string = '';
  private readonly IMAGE_FORMAT: string = 'image';
  private readonly VIDEO_FORMAT: string = 'video'

  private _items: Content[];
  private _appName: string | undefined;
  private _pastPath: string | undefined;
  private _isTopDirectory: boolean | undefined;
  private _currentPath: string | undefined;
  private _isLoading: boolean | undefined;

  constructor(private contentsController: ContentsControllerService, private dialog: MatDialog, private environmentLoader: EnvironmentLoaderService) {    
    this._items = [];
  }

  ngOnInit() {
    this.environmentLoader.load((env: Environment) => {
      if (!env.appName) throw new Error("App title info is not loaded.");
      this._appName = env.appName;
    });

    this.home();
  }

  public home(): void {
    this._items = [];
    this._isLoading = true;
    this.contentsController.ready().then(controller => { controller?.accessTopDirectory(this.onRetrieve, this.onComplete); })
  }

  public get isTopDirectory(): boolean {
    return this._isTopDirectory ? this._isTopDirectory : false;
  }

  public get currentPath(): string {
    return this._currentPath ? this._currentPath : this.NO_PATH;
  }

  public get items(): Content[] {
    return this._items;
  }

  public get count(): number {
    return this._items.length;
  }

  public get appName(): string {
    return this._appName ? this._appName : this.NO_APP_NAME;
  }

  public get pastPath(): string {
    return this._pastPath ? this._pastPath : this.NO_PATH;
  }

  private onRetrieve = (contents: Content[]) => {
    this._items = [];
    contents.forEach((content: Content) => {
      if (content.type === 'file') {
        if (content.format === this.IMAGE_FORMAT)
          this._items.push(content);
      } else {
        this._items.push(content);
      }
    });
  };

  private onComplete = () => {
    this.contentsController.ready().then((controller) => {
      this._isTopDirectory = controller?.isNowTopDirectory();
      this._currentPath = controller?.getCurrentPath();
      this._isLoading = controller?.isLoading();
    });
  }

  public exploreIn(newPath: string): void {
    this._isLoading = true;
    this.contentsController.ready().then(controller => {
      controller?.exploreIn(this.onRetrieve, this.onComplete, newPath);
    });
  }

  public exploreOut(): void {
    this._isLoading = true;
    this.contentsController.ready().then(controller => {
      this._pastPath = controller?.exploreOut(this.onRetrieve, this.onComplete);
    });
  }

  public get isLoading(): boolean {
    return this._isLoading !== undefined ? this._isLoading : true;
  }

  public showContent(content: Content): void {
    this.environmentLoader.load((env: Environment) => {
      this.dialog.open(ContentShowDialogComponent, {
        data: content,
        width: env.contentWidth,
        height: env.contentHeight,
        maxWidth: env.contentMaxWidth,
        maxHeight: env.contentMaxHeight,
      });
    });
  }
}
