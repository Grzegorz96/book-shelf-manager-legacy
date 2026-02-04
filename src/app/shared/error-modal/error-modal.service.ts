import { Injectable } from '@angular/core';
import { ErrorModalState } from './error-modal.interface';
import { BehaviorSubject } from 'rxjs';

export interface OpenErrorModalParams extends ErrorModalState {
  onAction?: () => void;
  /** Called when modal is closed by dismiss (Cancel, X, overlay). Not called when primary action is used. */
  onDismiss?: () => void;
}

/**
 * Global state manager for `ErrorModalComponent`.
 * Allows opening the modal from any place in the app.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorModalService {
  private readonly _state$ = new BehaviorSubject<ErrorModalState | null>(null);
  public readonly state$ = this._state$.asObservable();

  private onAction: (() => void) | null = null;
  private onDismiss: (() => void) | null = null;

  openErrorModal(params: OpenErrorModalParams): void {
    this.onAction = params.onAction ?? null;
    this.onDismiss = params.onDismiss ?? null;
    const nextState: ErrorModalState = {
      title: params.title,
      message: params.message,
      actionLabel: params.actionLabel,
      dismissLabel: params.dismissLabel,
    };

    this._state$.next(nextState);
  }

  /**
   * Closes the modal. When `runDismissCallback` is true, invokes the optional
   * `onDismiss` callback (e.g. when user clicks Cancel, X, or overlay).
   */
  closeErrorModal(): void {
    this.onDismiss?.();

    this.resetState();
  }

  executeAction(): void {
    const action: (() => void) | null = this.onAction;

    this.resetState();

    action?.();
  }

  private resetState(): void {
    this.onAction = null;
    this.onDismiss = null;
    this._state$.next(null);
  }
}
