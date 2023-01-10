import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Content } from './content-controller.service';

@Directive({
  selector: '[thumbnail-touch-control]'
})
export class ThumbnailTouchControlDirective {
  private readonly SKIP_FRAMES: number = 15;
  private readonly NO_SUPPORTED_FORMAT = '';

  @Input() public content: Content | undefined;
  @Output() public contentChange = new EventEmitter();

  private frameCount: number = 0;
  private lastX: number = 0;

  constructor() { }

  @HostListener('touchstart', ['$event'])
  private onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0] || event.changedTouches[0];
    this.frameCount = 0;
    this.lastX = touch.pageX;
  }

  @HostListener('touchmove', ['$event'])
  private onTouchMove(event: TouchEvent): void {
    if (this.frameCount++ % this.SKIP_FRAMES !== 0) return;
    if (!this.content) return;

    const touch = event.touches[0] || event.changedTouches[0];
    
    const direction = touch.pageX - this.lastX;
    if (direction > 0) {
      if (this.content.previousContent && this.content.previousContent.format !== this.NO_SUPPORTED_FORMAT) this.content = this.content.previousContent;
    } else if (direction < 0) {
      if (this.content.nextContent && this.content.nextContent.format !== this.NO_SUPPORTED_FORMAT) this.content = this.content.nextContent;
    }

    this.contentChange.emit(this.content);
    this.lastX = touch.pageX;
  }
}
