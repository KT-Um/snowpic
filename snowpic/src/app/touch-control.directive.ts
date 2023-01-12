import { ContentChildren, Directive, ElementRef, EventEmitter, HostListener, Input, Output, QueryList } from '@angular/core';
import { Content } from './content-controller.service';
import { EventHandlerService } from './event-handler.service';

@Directive({
  selector: '[touch-control]'
})
export class TouchControlDirective {
  private readonly NO_SUPPORTED_FORMAT = '';

  @ContentChildren('origins', { descendants: true }) private contentElements: QueryList<ElementRef<HTMLElement>> | undefined;
  @ContentChildren('videos', { descendants: true }) private videosElements: QueryList<ElementRef<HTMLVideoElement>> | undefined;
  
  @Input() public movementX: string | undefined;
  @Input() public content: Content | undefined;
  @Output() public contentChange = new EventEmitter();

  private readonly EVENT_TIME_GAP: number = 160;
  private readonly AMOUNT_MOVEMENT: number = 30;
  private readonly SKIP_FRAMES: number = 30;

  constructor(private eventHandler: EventHandlerService) { }

  @HostListener('touchstart', ['$event'])
  private onTouchStart(event: TouchEvent) {
    if (event.touches.length > 1) return;
    if (!this.movementX || !this.content || !this.videosElements) return;

    const touch = event.touches[0] || event.changedTouches[0];

    this.eventHandler.initView();
    this.eventHandler.slideEvent.startX = touch.pageX;
    this.eventHandler.slideEvent.lastX = touch.pageX;
    this.eventHandler.slideEvent.startEventTime = event.timeStamp;
  }

  @HostListener('touchmove', ['$event'])
  private onTouchMove(event: TouchEvent) {
    if (event.touches.length > 1) return;
    if (this.eventHandler.isMoving) return;
    if (!this.content) return;

    const touch = event.touches[0] || event.changedTouches[0];
    const eventTimeGap = event.timeStamp - this.eventHandler.slideEvent.startEventTime;

    if (eventTimeGap >= this.EVENT_TIME_GAP) {
      const elements = this.elements;
      if (elements) {
        const amountMovement = touch.pageX - this.eventHandler.slideEvent.startX;
        if (amountMovement > 0) {
          if (!this.content.previousContent || this.content.previousContent.format === this.NO_SUPPORTED_FORMAT) {
            this.eventHandler.flinchLeft(elements[1].nativeElement);
            return;
          }
        }
        
        if (amountMovement < 0) {
          if (!this.content.nextContent || this.content.nextContent.format === this.NO_SUPPORTED_FORMAT) {
            this.eventHandler.flinchRight(elements[1].nativeElement);
            return;
          }
        }

        elements.forEach(element => {
          this.eventHandler.slide(element.nativeElement, amountMovement);
        });
      }
    }

    if (this.eventHandler.slideEvent.count++ % this.SKIP_FRAMES === 0) this.eventHandler.slideEvent.lastX = touch.pageX;
  }

  @HostListener('touchend', ['$event'])
  private onTouchEnd(event: TouchEvent): void {
    if (event.touches.length > 1) return;
    if (!this.movementX || !this.content || !this.videosElements) return;

    const elements = this.elements;
    if (!elements) return;

    const touch = event.touches[0] || event.changedTouches[0];

    const amountMovement = touch.pageX - this.eventHandler.slideEvent.lastX;
    const movementDirection = touch.pageX - this.eventHandler.slideEvent.startX;
    
    if (Math.abs(amountMovement) > this.AMOUNT_MOVEMENT) {
      if (movementDirection > 0 && amountMovement > 0) {
        if (this.content.previousContent && this.content.previousContent.format !== this.NO_SUPPORTED_FORMAT) {
          if (this.eventHandler.isTwitched) this.eventHandler.resetFlinch(elements);
          this.slidePrevious(parseInt(this.movementX), this.content, this.contentChange, this.videosElements);
          return;
        }

        this.eventHandler.flinchLeft(elements[1].nativeElement);
      } else if (movementDirection < 0 && amountMovement < 0) {
        if (this.content.nextContent && this.content.nextContent.format !== this.NO_SUPPORTED_FORMAT) {
          if (this.eventHandler.isTwitched) this.eventHandler.resetFlinch(elements);
          this.slideNext(parseInt(this.movementX), this.content, this.contentChange, this.videosElements);
          return;
        }

        this.eventHandler.flinchRight(elements[1].nativeElement);
      }
    }

    this.eventHandler.slideBack(elements);
  }

  private get elements(): ElementRef<HTMLElement>[] | undefined {
    const elements = this.contentElements?.toArray();
    if (!elements || elements.length === 0) return undefined;

    return elements;
  }

  private slideNext(movementX: number, content: Content, contentChange: EventEmitter<Content>, videosElementsToReset: QueryList<ElementRef<HTMLVideoElement>>): void {
    const elements = this.elements;
    if (elements) {
      this.eventHandler.slideNext(
        elements[1].nativeElement,
        elements[2].nativeElement,
        movementX,
        content,
        contentChange,
        videosElementsToReset
      );
    }
  }

  private slidePrevious(movementX: number, content: Content, contentChange: EventEmitter<Content>, videosElementsToReset: QueryList<ElementRef<HTMLVideoElement>>): void {
    const elements = this.elements;
    if (elements) {
      this.eventHandler.slidePrevious(
        elements[1].nativeElement,
        elements[0].nativeElement,
        movementX,
        content,
        contentChange,
        videosElementsToReset
      );
    }
  }
}
