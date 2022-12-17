import { AfterViewInit, Component, ElementRef, HostListener, Inject, QueryList, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Content } from '../contentscontroller.service';
import { Environment, EnvironmentLoaderService } from '../environmentloader.service';
import { animate, style, AnimationBuilder, AnimationPlayer } from '@angular/animations';

@Component({
  selector: 'sp-content-show-dialog',
  templateUrl: './content-show-dialog.component.html',
  styleUrls: ['./content-show-dialog.component.css'],
})
export class ContentShowDialogComponent implements AfterViewInit {
  @ViewChildren("content") private contents: QueryList<ElementRef> | undefined;

  private readonly EVENT_TIME_GAP: number = 160;
  private readonly AMOUNT_MOVEMENT: number = 30;
  private readonly ANIMATION_FRAME: number = 30;
  private readonly MOVE_EVENT_ANIMATION_DURATION: number = (screen.width > 600) ? 600 : 100;
  private readonly MAX_MOVE_EVENT_ANIMATION_DURATION: number = this.MOVE_EVENT_ANIMATION_DURATION * 1.4;
  private readonly PRELOADED_TOTAL_COUNT: number = (screen.width > screen.height) ? screen.width / (screen.width / 10) * 2 + 1: screen.height / (screen.height / 10) * 2 + 1;
  private readonly PRELOADED_MAX_PREVIOUS: number = 5;

  private _isDialogOpened: boolean;
  private _dialogCloseButton: boolean;
  private _preloadedContents: Content[];
  private _isContentPreview: boolean;
  
  private _innerViewHeight: string;
  private _innerViewWidth: string;
  private _outerViewHeight: string;
  private _outerViewWidth: string;

  private slideEvent: { count: number, startX: number, lastX: number, startEventTime: number };
  private slideAnimationList: AnimationPlayer[];
  private isWheeling: boolean;
  private isAnimating: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private content: Content,
    private animationBuilder: AnimationBuilder,
    private environmentLoader: EnvironmentLoaderService,
  ) {
      this._isDialogOpened = false;
      this._dialogCloseButton = true;
      this._preloadedContents = [];
      this._isContentPreview = false;
      this.slideAnimationList = [];
      this.slideEvent = this.initSlideEvent();
      this.isWheeling = true;
      this.isAnimating = false;

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

  private calcDimensionAfterResize(): void {
    this._innerViewHeight = `${window.innerHeight}px`;
    this._innerViewWidth = `${window.innerWidth}px`;
    this._outerViewHeight = `${window.innerHeight}px`;
    this._outerViewWidth = `${window.innerWidth * 3}px`;
  }

  private initSlideEvent() {
    return this.slideEvent = { count: 0, startX: 0, lastX: 0, startEventTime: 0 };
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event: UIEvent): void {
    this.calcDimensionAfterResize();
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  private onTouch(event: TouchEvent): void {
    if (this.isAnimating) return;

    const touch = event.touches[0] || event.changedTouches[0];

    switch(event.type) {
      case 'touchstart':
        this.initSlideEvent();
        this.slideEvent.startX = touch.pageX;
        this.slideEvent.lastX = touch.pageX;
        this.slideEvent.startEventTime = event.timeStamp;
        break;
      case 'touchmove': {
        const eventTimeGap = event.timeStamp - this.slideEvent.startEventTime;

        if (eventTimeGap >= this.EVENT_TIME_GAP) {
          let elements = this.contents?.toArray();
          if (!elements) return;

          const amountMovement = touch.pageX - this.slideEvent.startX;
          elements.forEach((element: ElementRef) => {
            this.animateX(
              element.nativeElement,
              amountMovement,
              { duration: 0, isContinuous: true },
            );
          });
        }

        if (this.slideEvent.count++ % this.ANIMATION_FRAME === 0) this.slideEvent.lastX = touch.pageX;
        break;
      }
      case 'touchend': {
        const amountMovement = touch.pageX - this.slideEvent.lastX;
        const movementDirection = touch.pageX - this.slideEvent.startX;

        let elements = this.contents?.toArray();
        if (!elements) return;

        if (Math.abs(amountMovement) > this.AMOUNT_MOVEMENT) {
          if (movementDirection > 0) {
            this.movePrevious(this.MOVE_EVENT_ANIMATION_DURATION);
          } else if (movementDirection < 0) {
            this.moveNext(this.MOVE_EVENT_ANIMATION_DURATION);
          }
        } else {
          elements.forEach((element: ElementRef) => {
            this.animateX(element.nativeElement, 0);
          }); // move back
        }

        this.initSlideEvent();     
        break;
      }
    }
  }

  @HostListener('wheel', ['$event'])
  private onWheel(event: WheelEvent): void {
    if (this.isAnimating) return;
    if (!this.isWheeling) return; // skip event
    this.isWheeling = false;

    if (event.deltaX > 0 || (event.deltaX === 0 && event.deltaY > 0)) {
      this.moveNext(this.MOVE_EVENT_ANIMATION_DURATION);
    } else if (event.deltaX < 0 || (event.deltaX === 0 && event.deltaY < 0)) {
      this.movePrevious(this.MOVE_EVENT_ANIMATION_DURATION);
    }

    setTimeout(() => {
      this.isWheeling = true;
    }, this.MAX_MOVE_EVENT_ANIMATION_DURATION);
  }

  @HostListener('keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent): void {
    if (this.isAnimating) return;
    switch (event.key) {
      case 'esc':
        break;
      case 'ArrowLeft':
        if (this.isFirstContent) return;
        this.movePrevious(this.MOVE_EVENT_ANIMATION_DURATION);
        break;
      case 'ArrowRight':
        if (this.isLastContent) return;
        this.moveNext(this.MOVE_EVENT_ANIMATION_DURATION);
        break;
    }
  }

  private moveNext(duration: number): void {
    if (this.content.nextContent !== undefined) {
      const elements = this.contents?.toArray();
      if (!elements) return;

      const currentElement: HTMLElement = elements[1].nativeElement;
      const nextElement: HTMLElement = elements[2].nativeElement;
      this.move(currentElement, nextElement, (parseInt(this.innerViewWidth) * -1), duration, this.content.nextContent);
    }
  }

  private movePrevious(duration: number): void {
    if (this.content.previousContent !== undefined) {
      const elements = this.contents?.toArray();
      if (!elements) return;

      const currentElement: HTMLElement = elements[1].nativeElement;
      const previousElement: HTMLElement = elements[0].nativeElement;
      this.move(currentElement, previousElement, (parseInt(this.innerViewWidth) * 1), duration, this.content.previousContent);
    }
  }

  private move(fadeOutElement: HTMLElement, fadeInElement: HTMLElement, x: number, duration: number, contentToSet: Content): void {
    this.animateX(fadeOutElement, x, { duration: duration });
    this.animateX(fadeInElement, x, { duration: duration, doAfterFinished: () => { this.content = contentToSet; } });
  }

  private animateX(element: HTMLElement, x: number, options?: { duration?: number, isContinuous?: boolean, easing?: string, doAfterFinished?: Function }): void {
    if (!options) {
      options = { duration: this.MOVE_EVENT_ANIMATION_DURATION, isContinuous: false, easing: 'ease-in-out' };
    } else {
      if (options.duration === undefined) options.duration = this.MOVE_EVENT_ANIMATION_DURATION;
      if (options.isContinuous  === undefined) options.isContinuous = false;
      if (options.easing  === undefined) options.easing = 'ease-in-out';
    }

    let player: AnimationPlayer = this.animationBuilder.build([
      animate(`${options.duration!}ms ${options.easing}`, style({
        transform: `translateX(${x}px)`
      }))
    ]).create(element);

    player.onStart(() => {this.isAnimating = true;});
    player.onDone(() => {
      if (options!.doAfterFinished) options!.doAfterFinished();
      if (!(options!.isContinuous)) {
        if (this.slideAnimationList.length > 0) {
          this.slideAnimationList.forEach(player => { player.destroy(); });
          this.slideAnimationList = [];
        } else {
          player.destroy();
        }
      } else {
        this.slideAnimationList.push(player);
      }
      this.isAnimating = false;
    });
    player.play();
  }

  private get isFirstContent(): boolean {
    if (!this.content.previousContent) return true;
    return false;
  }

  private get isLastContent(): boolean {
    if (!this.content.nextContent) return true;
    return false;
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
