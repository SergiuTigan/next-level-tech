import {Directive, ElementRef, EventEmitter, HostListener, inject, Output} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  readonly elementRef = inject(ElementRef);
  @Output() clickOutside = new EventEmitter<void>();

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
