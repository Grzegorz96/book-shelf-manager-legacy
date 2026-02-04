import { Component, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import type { AuthCredentials } from '@core/services';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { ValidationErrorPipe } from '@core/pipes';

@Component({
  selector: 'app-auth-form',
  imports: [LucideAngularModule, ReactiveFormsModule, KeyValuePipe, ValidationErrorPipe],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
  @Output()
  protected readonly onSubmit = new EventEmitter<AuthCredentials>();

  protected readonly authForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  handleSubmit(): void {
    if (this.authForm.valid) {
      const credentials = this.authForm.getRawValue();

      this.onSubmit.emit(credentials);
    } else {
      this.authForm.markAllAsTouched();
    }
  }
}
