import { ContentChildren, Directive, ElementRef, EventEmitter, HostListener, Input, Output, QueryList } from '@angular/core';
import { Content } from './content-controller.service';
import { EventHandlerService } from './event-handler.service';

@Directive({
  selector: '[peripherals-control]'
})
export class PeripheralsControlDirective {
  @ContentChildren('origins', { descendants: true }) private contentElements: QueryList<ElementRef<HTMLElement>> | undefined;
  @ContentChildren('videos', { descendants: true }) private videosElements: QueryList<ElementRef<HTMLVideoElement>> | undefined;
  
  @Input() public movementX: string | undefined;
  @Input() public content: Content | undefined;
  @Output() public contentChange = new EventEmitter();

  private isWheeling: boolean;

  constructor(private eventHandler: EventHandlerService) {
    this.isWheeling = true;
  }

  @HostListener('wheel', ['$event'])
  private onWheel(event: WheelEvent): void {
    if (!this.isWheeling) return; // skip some event occurings
    this.isWheeling = !this.isWheeling;

    if (event.deltaX > 0 || (event.deltaX === 0 && event.deltaY > 0)) {
      this.moveNext();
    } else if (event.deltaX < 0 || (event.deltaX === 0 && event.deltaY < 0)) {
      this.movePrevious();
    }

    setTimeout(() => { this.isWheeling = !this.isWheeling; }, this.eventHandler.WHEELING_DURATION);
  }

  @HostListener('keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'esc':
        break;
      case 'ArrowLeft':
        this.movePrevious();
        break;
      case 'ArrowRight':
        this.moveNext();
        break;
    }
  }

  private get isNotReady(): boolean {
    if (this.eventHandler.isMoving) return true;
    if (!this.movementX || !this.content || !this.videosElements) return true;
    return false;
  }

  private get elements(): ElementRef<HTMLElement>[] | undefined {
    const elements = this.contentElements?.toArray();
    if (!elements || elements.length === 0) return undefined;

    return elements;
  }

  private moveNext(): void {
    if (this.isNotReady) return;

    const elements = this.elements;
    if (elements) {
      this.eventHandler.slideAndMoveNext(
        elements[1].nativeElement,
        elements[2].nativeElement,
        parseInt(this.movementX!),
        this.content!,
        this.contentChange,
        this.videosElements!
      );
    }
  }

  private movePrevious(): void {
    if (this.isNotReady) return;

    const elements = this.elements;
    if (elements) {
      this.eventHandler.slideAndMovePrevious(
        elements[1].nativeElement,
        elements[0].nativeElement,
        parseInt(this.movementX!),
        this.content!,
        this.contentChange,
        this.videosElements!
      );
    }
  }
}
