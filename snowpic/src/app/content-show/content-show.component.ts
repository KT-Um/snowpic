import { AfterViewInit, Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Content } from '../content-controller.service';
import { Environment, EnvironmentLoaderService } from '../environmentloader.service';

@Component({
  selector: 'content-show',
  templateUrl: './content-show.component.html',
  styleUrls: ['./content-show.component.scss'],
})
export class ContentShowComponent implements AfterViewInit {
  private readonly NO_CONTENT: Content = {
    fileIndex: 0, name: '', type: '', mtime: '', src: '', format: '', extension: '', nextContent: undefined, previousContent: undefined, autoplay: false
  }

  //private readonly TOTAL_THUMBNAIL_COUNT: number = (screen.width > screen.height) ? screen.width / (screen.width / 10) * 2 + 1 : screen.height / (screen.height / 10) * 2 + 1;
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
  private readonly VIEW_TO_THUMBNAIL_RATIO: number = 0.9;
  private readonly THUMBNAIL_SCALE: number = 0.7;
  private readonly THUMBNAIL_PADDING: number = 4;

  private _isDialogOpened: boolean;
  private _dialogCloseButton: boolean;
  private _thumbnails: Content[];
  private _isShowThumbnails: boolean;
  
  private _outerViewHeightInNumber!: number;
  private _contentHeight!: string;
  private _contentWidth!: string;
  private _innerViewHeight!: string;
  private _innerViewWidth!: string;
  private _outerViewHeight!: string;
  private _outerViewWidth!: string;

  private _thumbnailViewHeightInNumber!: number;
  private _thumbnailViewWidthInNumber!: number;
  private _thumbnailViewLeftPaddingInNumber!: number;
  private _thumbnailHeightInNumber!: number;
  private _thumbnailWidthInNumber!: number;
  private _thumbnailViewTopInNumber!: number;
  private _thumbnailViewLeftInNumber!: number;
  
  private _thumbnailViewHeight!: string;
  private _thumbnailViewWidth!: string;
  private _thumbnailViewLeftPadding!: string;
  private _thumbnailHeight!: string;
  private _thumbnailWidth!: string;
  private _thumbnailViewTop!: string;
  private _thumbnailViewLeft!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _content: Content,
    private environmentLoader: EnvironmentLoaderService,
  ) {
      this._isDialogOpened = false;
      this._dialogCloseButton = true;
      this._thumbnails = [];
      this._isShowThumbnails = false;
      _content.autoplay = true;

      (function loadThumbnails(thumbnails: Content[], content: Content, noSupportedFormat) {
        for (let i = 0, previousContent = content.previousContent; previousContent; i++, previousContent = previousContent.previousContent) {
          if (previousContent.format !== noSupportedFormat) thumbnails.splice(0, 0, previousContent);
        }
  
        thumbnails.push(content);
  
        for (let i = 0, nextContent = content.nextContent; nextContent; i++, nextContent = nextContent.nextContent) {
          if (nextContent.format !== noSupportedFormat) thumbnails.push(nextContent);
        }
      })(this._thumbnails, this._content, this.NO_SUPPORTED_FORMAT);

      this.environmentLoader.load((env: Environment) => {
        this._dialogCloseButton = env.dialogCloseButton === 'true';
        this._isShowThumbnails = env.showThumbnails === 'true';

        this.init();
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._isDialogOpened = true;
    }, 300);
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event: UIEvent): void {
    this.init();
  }

  private init(): void {
    this._outerViewHeightInNumber = this.isShowThumbnails ? window.innerHeight * this.VIEW_TO_THUMBNAIL_RATIO : window.innerHeight;
    
    this._innerViewHeight = this.isShowThumbnails ? `${window.innerHeight * this.VIEW_TO_THUMBNAIL_RATIO}px` : `${window.innerHeight}px`;
    this._innerViewWidth = `${window.innerWidth}px`;
    this._outerViewHeight = `${this._outerViewHeightInNumber}px`;
    this._outerViewWidth = `${window.innerWidth * 3}px`;
    this._contentHeight = `100%`;
    this._contentWidth = `100%`;
    
    this._thumbnailViewHeightInNumber = window.innerHeight * (1 - this.VIEW_TO_THUMBNAIL_RATIO);
    this._thumbnailHeightInNumber = this._thumbnailViewHeightInNumber * this.THUMBNAIL_SCALE;
    this._thumbnailWidthInNumber = this._thumbnailHeightInNumber * 3 / 4;
    this._thumbnailViewLeftPaddingInNumber = window.innerWidth / 2;
    this._thumbnailViewWidthInNumber = (this._thumbnailWidthInNumber + this.THUMBNAIL_PADDING) * (this._thumbnails.length + 1) + this._thumbnailViewLeftPaddingInNumber * 2;
    this._thumbnailViewLeftInNumber = window.innerWidth / 2 - (this._thumbnailWidthInNumber + this.THUMBNAIL_PADDING) * (this._content.fileIndex + 1) + this._thumbnailWidthInNumber / 2 - this.THUMBNAIL_PADDING / 2 - this._thumbnailViewLeftPaddingInNumber;
    this._thumbnailViewTopInNumber = this._outerViewHeightInNumber;

    this._thumbnailViewHeight = this.toPX(this._thumbnailViewHeightInNumber);
    this._thumbnailHeight = this.toPX(this.isShowThumbnails ? this._thumbnailHeightInNumber : 0);
    this._thumbnailWidth = this.toPX(this._thumbnailWidthInNumber);
    this._thumbnailViewLeftPadding = this.toPX(this._thumbnailViewLeftPaddingInNumber);
    this._thumbnailViewWidth = this.toPX(this._thumbnailViewWidthInNumber);
    this._thumbnailViewLeft = this.toPX(this._thumbnailViewLeftInNumber);
    this._thumbnailViewTop = this.toPX(this._thumbnailViewTopInNumber);
  }

  private toPX(num: number): string {
    return `${num}px`;
  }

  public set content(content: Content) {
    this._content = content;
    this.init();
  }

  public get content(): Content {
    return this._content;
  }

  public get thumbnails(): Content[] {
    return this._thumbnails.slice(0);
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

  public get contentList(): Content[] {
    const array = new Array<Content>;
    array.push(this._content.previousContent ? this._content.previousContent : this.NO_CONTENT);
    array.push(this._content);
    array.push(this._content.nextContent ? this._content.nextContent : this.NO_CONTENT);
    return array;
  }

  public get isDialogOpened(): boolean {
    return this._isDialogOpened;
  }

  public get isDialogCloseButton(): boolean {
    return this._dialogCloseButton;
  }

  public get isShowThumbnails(): boolean {
    return this._isShowThumbnails && this._thumbnails.length > 0;
  }

  public get height(): string {
    return this._contentHeight;
  }

  public get width(): string {
    return this._contentWidth;
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

  public get thumbnailViewHeight(): string {
    return this._thumbnailViewHeight;
  }

  public get thumbnailViewWidth(): string {
    return this._thumbnailViewWidth;
  }

  public get thumbnailViewLeftPadding(): string {
    return this._thumbnailViewLeftPadding;
  }

  public get thumbnailViewLeft(): string {
    return this._thumbnailViewLeft;
  }

  public get thumbnailViewTop(): string {
    return this._thumbnailViewTop;
  }

  public get thumbnailHeight(): string {
    return this._thumbnailHeight;
  }

  public get thumbnailWidth(): string {
    return this._thumbnailWidth;
  }
}
