import { AfterViewInit, Component, ElementRef, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Content } from '../contentscontroller.service';
import { Environment, EnvironmentLoaderService } from '../environmentloader.service';

@Component({
  selector: 'content-show-dialog',
  templateUrl: './content-show-dialog.component.html',
  styleUrls: ['./content-show-dialog.component.css'],
})
export class ContentShowDialogComponent implements AfterViewInit {
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

  public get srcs(): string[] {
    const array = new Array<string>;
    this.previousSrc ? array.push(this.previousSrc) : array.push('');
    this.currentSrc ? array.push(this.currentSrc) : array.push('');
    this.nextSrc ? array.push(this.nextSrc) : array.push('');
    return array;
  }

  private get previousSrc(): string | undefined {
    return this.content.previousContent ? this.content.previousContent.src : undefined;
  }

  private get currentSrc(): string | undefined {
    return this.content.src;
  }

  private get nextSrc(): string | undefined {
    return this.content.nextContent ? this.content.nextContent.src : undefined;
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

  public get imageHeight(): string {
    if (screen.orientation.type.includes("landscape")) {
      return '100%';
    } else if (screen.orientation.type.includes("portrait")) {
      return 'auto';
    } else {
      return '100%';
    }
  }

  public get imageWidth(): string {
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
  }

  public get previewVertialRatio(): string {
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
