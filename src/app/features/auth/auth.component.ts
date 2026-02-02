import { Component } from '@angular/core';
import { AuthFormComponent } from './auth-form';
import { AuthService, type AuthCredentials } from '@core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [AuthFormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  handleSubmit(credentials: AuthCredentials): void {
    const response = this.authService.login(credentials);
    if (response.success) {
      this.router.navigate(['/']);
    }
  }
}
