import { Component, signal, Signal } from '@angular/core';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LogoComponent } from '@shared/logo';
import { AuthService, ThemeService } from '@core/services';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly isAuthenticated: Signal<boolean>;
  protected readonly isDark: Signal<boolean>;
  protected readonly isMenuOpen = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly themeService: ThemeService,
    private readonly router: Router
  ) {
    this.isAuthenticated = this.authService.isAuthenticated;
    this.isDark = this.themeService.isDark;
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  /** Closes the dropdown only when it is open (mobile view). No-op when nav is always visible. */
  protected closeMenuIfOpen(): void {
    if (this.isMenuOpen()) {
      this.closeMenu();
    }
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected readonly routes = signal([
    {
      label: 'Books',
      icon: 'LibraryBig',
      path: '/books',
    },
  ]);

  protected handleLogout(): void {
    const response = this.authService.logout();
    if (response.success) {
      this.router.navigate(['/']);
    }
  }
}
