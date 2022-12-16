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
  private supportedFormats: RegExp | undefined;
  private NO_MATCH: RegExp = new RegExp('');
  private NO_APP_NAME: string = '';

  private _items: Content[];
  private _appName: string | undefined;
  private _pastPath: string;

  constructor(private contentsController: ContentsControllerService, private dialog: MatDialog, private environmentLoader: EnvironmentLoaderService) {    
    this._items = [];
    this._pastPath = '';
  }

  ngOnInit() {
    this.environmentLoader.load((env: Environment) => {
      if (!env.appName) throw new Error("App title info is not loaded.");
      if (!env.supportedForamts) throw new Error("Supported formats info is not loaded.");
      
      this._appName = env.appName;
      this.supportedFormats = new RegExp(env.supportedForamts);
    });

    this.contentsController.ready(() => {
      this.home();
    });

    //Test code
    setTimeout(() => {
      //this.exploreIn("2011/2011-04-16(양재천)");
    }, 500);

    setTimeout(() => {
      //this.showContent("DSC_0076.JPG");
      //this.showContent("DSC_0056.JPG");
      //this.showContent("DSC_0068.JPG");
    }, 500);
    //http://192.168.0.16/Photo/2011/2011-04-16(양재천)/DSC_0061.JPG
    //http://192.168.0.16/Photo/2011/2011-04-16(양재천)/DSC_0068.JPG
  }

  public home(): void {
    this._items = [];
    this._pastPath = '';
    this.contentsController.accessTopDirectory(this.onRetrieve);
  }

  public isTopDirectory(): boolean {
    return this.contentsController.isNowTopDirectory();
  }

  public get currentPath(): string {
    return this.contentsController.getCurrentPath();
  }

  public get items(): { name: string, type: string, src: string }[] {
    return this._items;
  }

  public get count(): number {
    return this._items.length;
  }

  public get appName(): string {
    return this._appName ? this._appName : this.NO_APP_NAME;
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
    this.contentsController.exploreIn(this.onRetrieve, newPath);
  }

  public exploreOut(): void {
    this._pastPath = this.contentsController.exploreOut(this.onRetrieve);
  }

  private isImageFile(imageName: string): boolean {
    const extension = imageName.substring(imageName.lastIndexOf('.') + 1, imageName.length);

    if (extension.match(this.supportedFormats ? this.supportedFormats : this.NO_MATCH)) {
      return true;
    } else {
      return false;
    }
  }

  public get isLoading(): boolean {
    return this.contentsController.isLoading();
  }

  public showContent(contentName: string): void {
    let width, height, maxWidth, maxHeight;
    this.environmentLoader.load((env: Environment) => {
      width = env.contentWidth;
      height = env.contentHeight;
      maxWidth = env.contentMaxWidth;
      maxHeight = env.contentMaxHeight;
    });

    const dialogRef = this.dialog.open(ContentShowDialogComponent, {
      data: this.contentsController.findContent(contentName),
      width: width,
      height: height,
      maxWidth: maxWidth,
      maxHeight: maxHeight,
    });
  }
}
