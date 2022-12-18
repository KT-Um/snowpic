import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { ContentChildren, Directive, ElementRef, EventEmitter, HostListener, Input, Output, QueryList } from '@angular/core';
import { Content } from './contentscontroller.service';

@Directive({
  selector: '[slide]'
})
export class ProcessSlideEventDirective {
  @ContentChildren("contents", { descendants: true }) private contents: QueryList<ElementRef> | undefined;
  @Input() public content: Content | undefined;
  @Input() public innerViewWidth: string | undefined;
  @Output() public contentChange = new EventEmitter();

  private readonly EVENT_TIME_GAP: number = 160;
  private readonly AMOUNT_MOVEMENT: number = 30;
  private readonly ANIMATION_FRAME: number = 30;
  private readonly MOVE_EVENT_ANIMATION_DURATION: number = (screen.width > 600) ? 600 : 100;
  private readonly MAX_MOVE_EVENT_ANIMATION_DURATION: number = this.MOVE_EVENT_ANIMATION_DURATION * 1.4;
  //private readonly PRELOADED_TOTAL_COUNT: number = (screen.width > screen.height) ? screen.width / (screen.width / 10) * 2 + 1: screen.height / (screen.height / 10) * 2 + 1;
  //private readonly PRELOADED_MAX_PREVIOUS: number = 5;

  private slideEvent: { count: number, startX: number, lastX: number, startEventTime: number };
  private slideAnimationList: AnimationPlayer[];
  private isWheeling: boolean;
  private isAnimating: boolean;

  constructor(private animationBuilder: AnimationBuilder) {
    this.slideAnimationList = [];
    this.slideEvent = this.initSlideEvent();
    this.isWheeling = true;
    this.isAnimating = false;
  }

  private initSlideEvent() {
    return this.slideEvent = { count: 0, startX: 0, lastX: 0, startEventTime: 0 };
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
    if (!this.content || !this.innerViewWidth) return;
    if (this.content.nextContent) {
      const elements = this.contents?.toArray();
      if (!elements || elements.length === 0) throw new Error("No content element found. Cannot slide your content.");

      const currentElement: HTMLElement = elements[1].nativeElement;
      const nextElement: HTMLElement = elements[2].nativeElement;
      this.move(currentElement, nextElement, (parseInt(this.innerViewWidth) * -1), duration, this.content.nextContent);
    }
  }

  private movePrevious(duration: number): void {
    if (!this.content || !this.innerViewWidth) return;
    if (this.content.previousContent) {
      const elements = this.contents?.toArray();
      if (!elements || elements.length === 0) throw new Error("No content element found. Cannot slide your content.");

      const currentElement: HTMLElement = elements[1].nativeElement;
      const previousElement: HTMLElement = elements[0].nativeElement;
      this.move(currentElement, previousElement, (parseInt(this.innerViewWidth) * 1), duration, this.content.previousContent);
    }
  }

  private move(fadeOutElement: HTMLElement, fadeInElement: HTMLElement, x: number, duration: number, contentToSet: Content): void {
    this.animateX(fadeOutElement, x, { duration: duration });
    this.animateX(fadeInElement, x, { duration: duration, doAfterFinished: () => {
      this.content = contentToSet;
      this.contentChange.emit(this.content);
    }});
  }

  private animateX(element: HTMLElement, x: number, options?: { duration?: number, isContinuous?: boolean, easing?: string, doAfterFinished?: Function }): void {
    if (!options) {
      options = { duration: this.MOVE_EVENT_ANIMATION_DURATION, isContinuous: false, easing: 'ease-in-out' };
    } else {
      if (options.duration === undefined) options.duration = this.MOVE_EVENT_ANIMATION_DURATION;
      if (options.isContinuous  === undefined) options.isContinuous = false;
      if (options.easing  === undefined) options.easing = 'ease-in-out';
    }

    const player: AnimationPlayer = this.animationBuilder.build([
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
    if (!this.content || !this.content.previousContent) return true;
    return false;
  }

  private get isLastContent(): boolean {
    if (!this.content || !this.content.nextContent) return true;
    return false;
  }
}
