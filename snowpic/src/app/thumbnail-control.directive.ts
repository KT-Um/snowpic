import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Content } from './content-controller.service';
import { EventHandlerService } from './event-handler.service';

@Directive({
  selector: '[thumbnail-control]'
})
export class ThumbnailControlDirective {
  private _content: Content | undefined;
  @Output() public contentChange = new EventEmitter();
  @Input() public thumbnail: Content | undefined;
  
  constructor(private eventHandler: EventHandlerService, private elementRef: ElementRef) { }

  @Input() public set content(content: Content | undefined) {
    this._content = content;

    if (!this._content || !this.thumbnail) return;
    if (this._content.fileIndex === this.thumbnail.fileIndex) {
      this.eventHandler.scaleThumbnailDown();
      this.eventHandler.scaleThumbnailUp(this.elementRef.nativeElement);
    }
  }

  @HostListener('click', ['$event'])
  private onClick(event: PointerEvent): void {
    this.eventHandler.scaleThumbnailDown();
    this.eventHandler.scaleThumbnailUp(this.elementRef.nativeElement);

    this.contentChange.emit(this._content = this.thumbnail);
  }
}
