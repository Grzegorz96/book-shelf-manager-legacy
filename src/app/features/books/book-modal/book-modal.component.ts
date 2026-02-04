import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ScrollLockDirective } from '@core/services';
import { BackdropClickDirective } from '@core/directives';

@Component({
  selector: 'app-book-modal',
  imports: [LucideAngularModule, ScrollLockDirective, BackdropClickDirective],
  templateUrl: './book-modal.component.html',
  styleUrl: './book-modal.component.scss',
})
export class BookModalComponent {
  @Input() loader = false;
  @Input() loaderText = 'Loading...';
  @Output() close = new EventEmitter<void>();

  protected onBackdropClick(): void {
    if (!this.loader) {
      this.close.emit();
    }
  }
}
