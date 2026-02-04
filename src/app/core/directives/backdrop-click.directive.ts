import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Use on a modal/overlay backdrop element. Emits only when the user performs a full click
 * on the backdrop (mousedown + mouseup on the same element). Prevents closing when the user
 * clicks inside the dialog and releases on the backdrop (drag).
 */
@Directive({
  selector: '[appBackdropClick]',
  host: {
    '(mousedown)': 'onMouseDown($event)',
    '(click)': 'onClick($event)',
  },
})
export class BackdropClickDirective {
  /** Emitted when a full click (mousedown and mouseup) occurred on the host element. */
  // readonly backdropClick = output<void>();
  @Output() backdropClick = new EventEmitter<void>();

  private _mouseDownTarget: EventTarget | null = null;

  // @HostListener('mousedown', ['$event'])
  // protected onMouseDown(event: MouseEvent): void {
  //   this._mouseDownTarget = event.target;
  // }

  // @HostListener('click', ['$event'])
  // protected onClick(event: MouseEvent): void {
  //   if (this._mouseDownTarget === event.currentTarget) {
  //     this.backdropClick.emit();
  //   }
  //   this._mouseDownTarget = null;
  // }
  protected onMouseDown(event: MouseEvent): void {
    this._mouseDownTarget = event.target;
  }

  protected onClick(event: MouseEvent): void {
    if (this._mouseDownTarget === event.currentTarget) {
      this.backdropClick.emit();
    }
    this._mouseDownTarget = null;
  }
}
