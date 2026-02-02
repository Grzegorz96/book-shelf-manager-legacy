import { Component, Signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ScrollLockDirective } from '@core/services';
import { BackdropClickDirective } from '@core/directives';
import { ErrorModalService } from './error-modal.service';
import { ErrorModalState } from './error-modal.interface';

@Component({
  selector: 'app-error-modal',
  imports: [LucideAngularModule, ScrollLockDirective, BackdropClickDirective],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss',
})
export class ErrorModalComponent {
  protected readonly modalState: Signal<ErrorModalState | null>;

  constructor(private readonly errorModalService: ErrorModalService) {
    this.modalState = this.errorModalService.state;
  }

  protected handleDismiss(): void {
    this.errorModalService.closeErrorModal();
  }

  protected handleAction(): void {
    this.errorModalService.executeAction();
  }
}
