import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContentShowComponent } from '../content-show/content-show.component';
import { ContentControllerService, Content } from '../content-controller.service';
import { Environment, EnvironmentLoaderService } from '../environmentloader.service';

@Component({
  selector: 'content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.css']
})
export class ContentListComponent implements OnInit {
  private readonly NO_APP_NAME: string = '';
  private readonly NO_PATH: string = '';
  private readonly IMAGE_FORMAT: string = 'image';
  private readonly VIDEO_FORMAT: string = 'video';
  private readonly MP4: string = 'mp4';
  private readonly OGG: string = 'ogg';
  private readonly WEBM: string = 'webm';
  private readonly TYPE_MP4: string = 'video/mp4';
  private readonly TYPE_OGG: string = 'video/ogg';
  private readonly TYPE_WEBM: string = 'video/webm';
  private readonly NO_TYPE: string = '';

  private _contents: Content[];
  private _appName: string | undefined;
  private _pastPath: string | undefined;
  private _isTopDirectory: boolean | undefined;
  private _currentPath: string | undefined;
  private _isLoading: boolean | undefined;

  constructor(private contentsController: ContentControllerService, private dialog: MatDialog, private environmentLoader: EnvironmentLoaderService) {
    this._contents = [];
  }

  ngOnInit(): void {
    this.environmentLoader.load((env: Environment) => {
      if (!env.appName) throw new Error("App title info is not loaded.");
      this._appName = env.appName;
    });

    this.home();
  }

  public home(): void {
    this._contents = [];
    this._isLoading = true;
    this.contentsController.ready().then(controller => { controller?.accessTopDirectory(this.onRetrieve, this.onComplete); })
  }

  public get isTopDirectory(): boolean {
    return this._isTopDirectory ? this._isTopDirectory : false;
  }

  public get currentPath(): string {
    return this._currentPath ? this._currentPath : this.NO_PATH;
  }

  public get contents(): Content[] {
    return this._contents;
  }

  public get count(): number {
    return this._contents.length;
  }

  public get appName(): string {
    return this._appName ? this._appName : this.NO_APP_NAME;
  }

  public get pastPath(): string {
    return this._pastPath ? this._pastPath : this.NO_PATH;
  }

  public get imageFormat(): string {
    return this.IMAGE_FORMAT;
  }

  public get videoFormat(): string {
    return this.VIDEO_FORMAT;
  }

  public getVideoType(content: Content): string {
    if (content.extension === this.MP4) return this.TYPE_MP4;
    if (content.extension === this.OGG) return this.TYPE_OGG;
    if (content.extension === this.WEBM) return this.TYPE_WEBM;
    return this.NO_TYPE;
  }

  private onRetrieve = (contents: Content[]) => {
    this._contents = [];
    contents.forEach((content: Content) => {
      if (content.type === 'file') {
        if (content.format === this.IMAGE_FORMAT || content.format === this.VIDEO_FORMAT)
          this._contents.push(content);
      } else {
        this._contents.push(content);
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
      this.dialog.open(ContentShowComponent, {
        data: content,
        width: env.contentWidth,
        height: env.contentHeight,
        maxWidth: env.contentMaxWidth,
        maxHeight: env.contentMaxHeight,
      });
    });
  }
}
