import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { ElementRef, EventEmitter, Injectable, QueryList } from '@angular/core';
import { Content } from './content-controller.service';

interface SlideEvent {
  count: number;
  startX: number;
  lastX: number;
  startEventTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventHandlerService {
  private readonly DEFAULT_DURATION: number = (screen.width > 600) ? 600 : 100;
  public readonly WHEELING_DURATION: number = this.DEFAULT_DURATION * 1.4;
  private readonly ZERO_DURATION: number = 0;
  private readonly EASING: string = 'ease-in-out';
  private readonly SCALE_UP: string = '1.2';
  private readonly SCALE_DOWN: string = '1';

  private scaledUpThumbnailList!: HTMLElement[];
  private _thumbnailSlideEvent!: SlideEvent;

  private slideAnimationList!: AnimationPlayer[];
  private _slideEvent!: SlideEvent;
  private _isMoving!: boolean;

  constructor(private animationBuilder: AnimationBuilder) {
    this.initView();
    this.initThumbnailView();
  }

  public initThumbnailView(): void {
    if (this.scaledUpThumbnailList) this.scaleDown();
    this.scaledUpThumbnailList = [];
    this._thumbnailSlideEvent = { count: 0, startX: 0, lastX: 0, startEventTime: 0 };
  }

  public initView(): void {
    while (this.slideAnimationList && this.slideAnimationList.length > 0) {
      const player = this.slideAnimationList.pop();
      if (player) player.destroy();
    }

    this.slideAnimationList = [];
    this._slideEvent = { count: 0, startX: 0, lastX: 0, startEventTime: 0 };
    this._isMoving = false;
  }

  public get isMoving(): boolean {
    return this._isMoving;
  }

  public get slideEvent() {
    return this._slideEvent;
  }

  public get thumbnailSlideEvent() {
    return this._thumbnailSlideEvent;
  }

  public slide(element: HTMLElement, x: number) {
    this.doAnimation(element, x, this.ZERO_DURATION, true);
  }

  public slideBack(elements: ElementRef<HTMLElement>[]) {
    elements.forEach(element => {
      this.doAnimation(element.nativeElement, 0, this.DEFAULT_DURATION, false);
    });
  }

  public slideAndMoveNext(
    currentElement: HTMLElement,
    nextElement: HTMLElement,
    movementX: number,  
    content: Content,
    contentChange: EventEmitter<Content>,
    videosElementsToReset: QueryList<ElementRef<HTMLVideoElement>>,
  ): void {
    if (content.nextContent) {
      this.move(
        currentElement,
        nextElement,
        (movementX * -1),
        content,
        content.nextContent,
        contentChange,
        videosElementsToReset,
      );
    }
  }

  public slideAndMovePrevious(
    currentElement: HTMLElement,
    previousElement: HTMLElement,
    movementX: number,
    content: Content,
    contentChange: EventEmitter<Content>,
    videosElementsToReset: QueryList<ElementRef<HTMLVideoElement>>,
  ): void {
    if (content.previousContent) {
      this.move(
        currentElement,
        previousElement,
        (movementX * 1),
        content,
        content.previousContent,
        contentChange,
        videosElementsToReset,
      );
    }
  }

  private move(
    fadeOutElement: HTMLElement,
    fadeInElement: HTMLElement,
    x: number,
    currentContent: Content,
    newContentToAssign: Content,
    contentChange: EventEmitter<Content>,
    videosElementsToReset: QueryList<ElementRef<HTMLVideoElement>>,
  ): void {
    this.doAnimation(fadeOutElement, x, this.DEFAULT_DURATION, false);
    this.doAnimation(fadeInElement, x, this.DEFAULT_DURATION, false,
      () => {
        (function stopVideoPlayingAndReset(videosElements: QueryList<ElementRef<HTMLVideoElement>>) {
          videosElements.forEach((videoElement: ElementRef) => {
            if (videoElement.nativeElement) {
              videoElement.nativeElement.currentTime = 0;
              videoElement.nativeElement.pause();
            }
          });
        })(videosElementsToReset);

        (function resetVideoAutoplay(content: Content) {
          content.autoplay = false;
          newContentToAssign.autoplay = true;
        })(currentContent);

        contentChange.emit(currentContent = newContentToAssign);
        if ((fadeInElement as HTMLVideoElement).play) (fadeInElement as HTMLVideoElement).play();
    });
  }

  private doAnimation(element: HTMLElement, x: number, duration: number, isKeepAnimating: boolean, doAfterFinished?: Function): void {
    const player: AnimationPlayer = this.animationBuilder.build([
      animate(`${duration}ms ${this.EASING}`, style({
        transform: `translateX(${x}px)`
      }))
    ]).create(element);

    player.onStart(() => { this._isMoving = true; });
    player.onDone(() => {
      if (doAfterFinished) doAfterFinished();

      if (isKeepAnimating) {
        this.slideAnimationList.push(player);
      } else {
        (function destroyAllAnimations(slideAnimationList: AnimationPlayer[]) {
          while (slideAnimationList.length > 0) {
            const player = slideAnimationList.pop();
            if (player) player.destroy();
          }
        })(this.slideAnimationList);

        player.destroy();
      }

      this._isMoving = false;
    });

    player.play();
  }

  public scaleUp(element: HTMLElement): void {
    this.scaledUpThumbnailList.push(element);
    const keyframes = new KeyframeEffect(
      element,
      [{ scale: this.SCALE_UP, margin: '4px' }],
      { duration: 100, fill: 'forwards' }
    )

    const animation = new Animation(keyframes, document.timeline);
    animation.play();
  }

  public scaleDown(): void {
    while (this.scaledUpThumbnailList.length > 0) {
      const element = this.scaledUpThumbnailList.pop()!;
      const keyframes = new KeyframeEffect(
        element,
        [{ scale: this.SCALE_DOWN, margin: '0px' }],
        { duration: 0, fill: 'forwards' }
      )
  
      const animation = new Animation(keyframes, document.timeline);
      animation.play();
    }
  }
}
