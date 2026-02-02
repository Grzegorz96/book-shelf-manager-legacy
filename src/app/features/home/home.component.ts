import { Component, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-home',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected readonly isAuthenticated: Signal<boolean>;

  constructor(authService: AuthService) {
    this.isAuthenticated = authService.isAuthenticated;
  }
}
