import { AfterViewInit, Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Content } from '../contentscontroller.service';
import { Environment, EnvironmentLoaderService } from '../environmentloader.service';

@Component({
  selector: 'content-show-dialog',
  templateUrl: './content-show-dialog.component.html',
  styleUrls: ['./content-show-dialog.component.css'],
})
export class ContentShowDialogComponent implements AfterViewInit {
  private readonly NO_CONTENT: Content = {
    name: '', type: '', mtime: '', src: '', format: '', extension: '', nextContent: undefined, previousContent: undefined, autoplay: false
  }

  private readonly NO_SUPPORTED_FORMAT = '';
  private readonly IMAGE_FORMAT: string = 'image';
  private readonly VIDEO_FORMAT: string = 'video';
  private readonly MP4: string = 'mp4';
  private readonly OGG: string = 'ogg';
  private readonly WEBM: string = 'webm';
  private readonly TYPE_MP4: string = 'video/mp4';
  private readonly TYPE_OGG: string = 'video/ogg';
  private readonly TYPE_WEBM: string = 'video/webm';
  private readonly NO_TYPE: string = '';

  private _isDialogOpened: boolean;
  private _dialogCloseButton: boolean;
  private _preloadedContents: Content[];
  private _isContentPreview: boolean;
  
  private _innerViewHeight: string;
  private _innerViewWidth: string;
  private _outerViewHeight: string;
  private _outerViewWidth: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public content: Content,
    private environmentLoader: EnvironmentLoaderService,
  ) {
      this._isDialogOpened = false;
      this._dialogCloseButton = true;
      this._preloadedContents = [];
      this._isContentPreview = false;
      content.autoplay = true;

      // Preload code
      /*for (let i = 0, previousContent = content.previousContent; i < this.PRELOADED_MAX_PREVIOUS; i++, previousContent = previousContent.previousContent) {
        if (!previousContent) break;
        this._preloadedContents.splice(0, 0, previousContent);
      }

      this._preloadedContents.push(content);

      for (let i = 0, nextContent = this.content.nextContent; this._preloadedContents.length < this.PRELOADED_TOTAL_COUNT; i++, nextContent = nextContent.nextContent) {
        if (!nextContent) break;

        this._preloadedContents.push(nextContent);
      }*/

      this.environmentLoader.load((env: Environment) => {
        this._dialogCloseButton = env.dialogCloseButton === 'true';
        this._isContentPreview = env.contentPreviewList === 'true';
      });

      this._innerViewHeight = `${window.innerHeight}px`;
      this._innerViewWidth = `${window.innerWidth}px`;
      this._outerViewHeight = `${window.innerHeight}px`;
      this._outerViewWidth = `${window.innerWidth * 3}px`;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._isDialogOpened = true;
    }, 300);
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event: UIEvent): void {
    this.calcDimensionAfterResize();
  }

  private calcDimensionAfterResize(): void {
    this._innerViewHeight = `${window.innerHeight}px`;
    this._innerViewWidth = `${window.innerWidth}px`;
    this._outerViewHeight = `${window.innerHeight}px`;
    this._outerViewWidth = `${window.innerWidth * 3}px`;
  }

  public get preloadedContents(): Content[] {
    return this._preloadedContents.slice(0);
  }

  public get imageFormat(): string {
    return this.IMAGE_FORMAT;
  }

  public get videoFormat(): string {
    return this.VIDEO_FORMAT;
  }

  public get noFormat(): string {
    return this.NO_SUPPORTED_FORMAT;
  }

  public getVideoType(content: Content): string {
    if (content.extension === this.MP4) return this.TYPE_MP4;
    if (content.extension === this.OGG) return this.TYPE_OGG;
    if (content.extension === this.WEBM) return this.TYPE_WEBM;
    return this.NO_TYPE;
  }

  public get contents(): Content[] {
    const array = new Array<Content>;
    array.push(this.content.previousContent ? this.content.previousContent : this.NO_CONTENT);
    array.push(this.content);
    array.push(this.content.nextContent ? this.content.nextContent : this.NO_CONTENT);
    return array;
  }

  public get isDialogOpened(): boolean {
    return this._isDialogOpened;
  }

  public get isDialogCloseButton(): boolean {
    return this._dialogCloseButton;
  }

  public get isContentPreview(): boolean {
    return this._isContentPreview && this._preloadedContents.length > 0;
  }

  public get previewHeight(): string {
    if (screen.width > screen.height) {
      return `${screen.width / 10}px`;
    } else {
      return `${screen.height / 10}px`;
    }
  }

  public get previewWidth(): string {
    if (screen.width > screen.height) {
      return `${screen.height / 10}px`;
    } else {
      return `${screen.width / 10}px`;
    }
  }

  public get height(): string {
    if (screen.orientation.type.includes("landscape")) {
      return '100%';
    } else if (screen.orientation.type.includes("portrait")) {
      return 'auto';
    } else {
      return '100%';
    }
  }

  public get width(): string {
    if (screen.orientation.type.includes("landscape")) {
      return 'auto';
    } else if (screen.orientation.type.includes("portrait")) {
      return '100%';
    } else {
      return 'auto';
    }
  }

  public get innerViewHeight(): string {
    return this._innerViewHeight;
  }

  public get innerViewWidth(): string {
    return this._innerViewWidth;
  }

  public get outerViewHeight(): string {
    return this._outerViewHeight;
  }

  public get outerViewWidth(): string {
    return this._outerViewWidth;
  }

  /*public get viewVertialRatio(): string {
    if (screen.orientation.type.includes("landscape")) {
      return '70%';
    } else if (screen.orientation.type.includes("portrait")) {
      return '90%';
    } else {
      return '90%';
    }
  }*/

  /*public get previewVertialRatio(): string {
    if (screen.orientation.type.includes("landscape")) {
      return '15%';
    } else if (screen.orientation.type.includes("portrait")) {
      return '10%';
    } else {
      return '10%';
    }
  }*/

  /*private get scrollbarWidth(): number {
    let el = document.createElement("div");
    el.style.cssText = "overflow: scroll; visibility: hidden; position: absolute;";
    document.body.appendChild(el);
    let width = el.offsetWidth - el.clientWidth;
    el.remove();
    return width;
  }*/
}
