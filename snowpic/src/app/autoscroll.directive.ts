import { Directive, PLATFORM_ID, ElementRef, Inject, OnChanges, SimpleChanges, Input } from '@angular/core';

@Directive({
  selector: '[autoscroll]'
})
export class AutoScrollDirective implements OnChanges {
  @Input() autoscroll: boolean | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private elementRef: ElementRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.autoscroll) {
      this.elementRef.nativeElement.scrollIntoView({
        behavior: "auto",
        block: 'start',
        inline: 'start'
      });
    }
  }
}
