import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ScrollLockDirective } from '@core/services';
import { BackdropClickDirective } from '@core/directives';
import { ErrorModalService } from './error-modal.service';
import { ErrorModalState } from './error-modal.interface';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-error-modal',
  imports: [LucideAngularModule, ScrollLockDirective, BackdropClickDirective, AsyncPipe],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss',
})
export class ErrorModalComponent {
  protected readonly modalState$: Observable<ErrorModalState | null>;

  constructor(private readonly errorModalService: ErrorModalService) {
    this.modalState$ = this.errorModalService.state$;
  }

  protected handleDismiss(): void {
    this.errorModalService.closeErrorModal();
  }

  protected handleAction(): void {
    this.errorModalService.executeAction();
  }
}
